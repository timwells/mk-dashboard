const cheerio = require('cheerio');
const cModule = require('./common/c.js');
const axios = require('axios');

const LSE_SECTOR_HOST = "https://www.lse.co.uk"
const LSE_SECTOR_PERFORMANCE = LSE_SECTOR_HOST + "/share-prices/sectors/"
const USER_AGENT = "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"

const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const SECTOR_PERFORMANCE_RESOURCE = 'lse-cache/sector-peformance.json';
const CONSTITUENT_PERFORMANCE_FOLDER = 'lse-cache/constituents/'

const PAGE_REQUEST_TIMEOUT = 80000
const CACHE_AGE =  43200  // seconds

const STORAGE_SUCCESS = 200
const STORAGE_NOT_FOUND = 404


// "https://api.londonstockexchange.com/api/gw/lse/search/autocomplete?q=BARC
const LSE_SEARCH_HOST = "https://api.londonstockexchange.com"
const LSE_EPIC_SEARCH = LSE_SEARCH_HOST + "/api/gw/lse/search/autocomplete"

const { Storage } = require('@google-cloud/storage');
const { Readable } = require('stream');

function extractAndParseEscapedJson(input) {
    // Regular expression to match the escaped JSON part
    const regex = /({.*})/;
  
    // Find the JSON part in the input string
    const match = input.match(regex);
  
    if (match && match[1]) {
      // Extracted JSON string (still escaped)
      const escapedJson = match[1];
  
      try {
        // Parse the escaped JSON string
        const parsedJson = JSON.parse(escapedJson);
        return parsedJson;
      } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
      }
    } else {
        console.error('No JSON found in the input string');
        return null;
    }
}
    

/* Page Struction
<tr class="down">
    <td><a href="https://www.lse.co.uk/share-prices/sectors/aerospace/" 
        title="Aerospace Sector Value">Aerospace</a></td>
    <td class="hidden-xs">11,345.84</td>
    <td class="hidden-tiny">-162.82</td>
    <td>-1.41%</td>
</tr>
*/

function validateBoolParameter(param, validValues) {
    return validValues.includes(param);
}
async function getPageContent(
    url,
    timeout
) {
    const _pInstance = await cModule.getPuppetInstance();
    const page = await _pInstance.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    return await page.content();
}
async function queryResourceCacheStatus(
    bucket,
    resource
) {
    const storage = new Storage();
    const file = storage.bucket(bucket).file(resource);    
    let resp = { status: STORAGE_SUCCESS, metadata : null }

    try {
        resp.expired = true  
        const [metadata] = await file.getMetadata()
        if(!cModule.isCacheExpired(metadata)) { resp.expired = false }
        resp.metadata = metadata
        return resp
    } catch(e) {
        resp.status = e.code
    }
    return resp
}
async function getResourceFromCache(
    bucket,
    resource
) {
    const storage = new Storage();
    const file = storage.bucket(bucket).file(resource);
    let payLoad = { status: STORAGE_SUCCESS, data: null}
    try {
        const [contents] = await file.download();
        return { status: STORAGE_SUCCESS, data: JSON.parse(contents.toString())}
    } catch(e) {
        return { status: e.code, data: null }
    }
}
async function uploadJsonStream(
    writeStream, 
    dataObj
) {
    return new Promise((resolve, reject) => {
        const jsonString = JSON.stringify(dataObj);
        const jsonStream = new Readable();

        jsonStream.push(jsonString);
        jsonStream.push(null); // No more data

        jsonStream.pipe(writeStream)
            .on('finish', () => { resolve(dataObj);})
            .on('error', (error) => { reject(error);});
    });
}
async function updateResource(
    webResource,
    webResourceTimeout,
    processContent,
    cacheBucket,
    cacheResource,
    cacheAge,
    cacheTag
) {
    // Get and process page
    try {
        const constituentPeformanceList = await processContent(await getPageContent(webResource,webResourceTimeout))
        if(constituentPeformanceList.length > 0) {
            const storage = new Storage();
            const file = storage.bucket(cacheBucket).file(cacheResource);
            const writeStream = file.createWriteStream({ metadata: { contentType: 'application/json', cacheControl: `public,max-age=${cacheAge}`} });
            return { status: STORAGE_SUCCESS, tag:cacheTag, created: new Date().toISOString(), data: await uploadJsonStream(writeStream,constituentPeformanceList) }
        }
        return {data: []}
     }catch(e) {
        console.log("updateResource",e)
    }
}
async function ProcessSectorPeformance(
    htmlContent
) {
    const $ = cheerio.load(htmlContent);
    const tableRows = $('.sp-sectors__table > tbody > tr');
    let sectorPerformanceList = []
    $(tableRows).each((i,row) => {
        let sectorPeformance = {}
        $(row).find('td').each((j,e) => {   
            // console.log(j,$(e).text());
            switch(j) {
                case 0: {
                    sectorPeformance.name = $(e).find('a').text();
                    sectorPeformance.href = $(e).find('a').attr('href');
                    sectorPeformance.direction = $(e).closest('tr').attr('class');
                    sectorPeformance.constituents = sectorPeformance.constituents = sectorPeformance.href.split("/").filter(str => str !== "").pop();
                } break;
                case 1: { sectorPeformance.value = parseFloat($(e).text().replace(",",""));} break;
                case 2: { sectorPeformance.changePrice = parseFloat($(e).text());} break;
                case 3: { sectorPeformance.changePercent = parseFloat($(e).text().replace("%",""));} break;
            }
        })
        // Skip header.
        if(i>0) sectorPerformanceList.push(sectorPeformance)
    }) 
    return sectorPerformanceList
}
async function ProcessConstituentPeformance(
    htmlContent
) {
    const $ = cheerio.load(htmlContent)
    const tableRows = $('.sp-constituents__table tbody tr');
    let constituentPerformanceList = []
    $(tableRows).each((i,row) => {
        let constituentPerformance = {}
        $(row).find('td').each((j,e) => {   
            // console.log(j,$(e).text());
            switch(j) {
                case 0: {
                    constituentPerformance.name = $(e).find('a').text();
                    constituentPerformance.direction = $(e).closest('tr').attr('class');
                    constituentPerformance.epic = $(e).find('a').attr('data-item')
                } break;
                case 1: { constituentPerformance.price = parseFloat($(e).text().replace(",",""));} break;
                case 2: { constituentPerformance.volume = parseFloat($(e).text());} break;
                case 3: { constituentPerformance.changePercent = parseFloat($(e).text().replace("%",""));} break;
                case 4: { constituentPerformance.low = parseFloat($(e).text());} break;
                case 5: { constituentPerformance.high = parseFloat($(e).text());} break;
                case 6: { constituentPerformance.trades = parseFloat($(e).text());} break;
            }
        })
        // Skip header.
        if(i>0) constituentPerformanceList.push(constituentPerformance)
    }) 
    return constituentPerformanceList
}
async function sectorpeformance(
    req, 
    res
) {
    const webResource = LSE_SECTOR_PERFORMANCE
    const webResourceTimeout = PAGE_REQUEST_TIMEOUT
    const cacheBucket = BUCKET_NAME
    const cacheResource = SECTOR_PERFORMANCE_RESOURCE
    const cacheAge = CACHE_AGE
    const cacheTag = "sector-performance"
    const live = validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';

    try {
        const cacheResponse = await queryResourceCacheStatus(cacheBucket,cacheResource);
        const hotRequest = (cacheResponse.expired || live)

        switch(cacheResponse.status) {
            case STORAGE_SUCCESS: {
                if(!hotRequest) { // Get Resource from cache if not hotRequest
                    let p1 = await getResourceFromCache(cacheBucket,cacheResource)
                    p1.source = "cache"
                    p1.tag = cacheTag
                    p1.created =  cacheResponse.metadata.timeCreated
                    res.status(200).json(p1)
                }
                else {
                    let p2 = await updateResource(webResource,webResourceTimeout,ProcessSectorPeformance,cacheBucket,cacheResource,cacheAge,cacheTag)
                    p2.source = "re-cache"
                    p2.tag = cacheTag
                    res.status(200).json(p2)
                }
            } break;
            case STORAGE_NOT_FOUND: {
                let p3 = await updateResource(webResource,webResourceTimeout,ProcessSectorPeformance,cacheBucket,cacheResource,cacheAge,cacheTag)
                p3.source = "initialised-cache"
                p3.tag = cacheTag
                res.status(200).json(p3)
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                res.status(500).json({})
            }
        }
    } catch(e) {
        console.log("sectorpeformance",e)    
        res.status(500).json({})
    }
}
async function constituentperformance(
    req, 
    res
) {
    const webResource = LSE_SECTOR_PERFORMANCE + req.query.constituents + "/constituents.html"
    const webResourceTimeout = PAGE_REQUEST_TIMEOUT
    const cacheBucket = BUCKET_NAME
    const cacheResource = `${CONSTITUENT_PERFORMANCE_FOLDER}${req.query.constituents}.json`
    const cacheAge = CACHE_AGE
    const cacheTag = req.query.constituents
    const live = validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';

    try {        
        const cacheResponse = await queryResourceCacheStatus(cacheBucket,cacheResource);
        const hotRequest = (cacheResponse.expired || live)

        switch(cacheResponse.status) {
            case STORAGE_SUCCESS: {
                if(!hotRequest) { // Get Resource from cache if not hotRequest
                    let p1 = await getResourceFromCache(cacheBucket,cacheResource)
                    p1.source = "cache"
                    p1.webSource = webResource
                    p1.tag = cacheTag
                    p1.created =  cacheResponse.metadata.timeCreated
                    res.status(200).json(p1)
                }
                else {
                    let p2 = await updateResource(webResource,webResourceTimeout,ProcessConstituentPeformance,cacheBucket,cacheResource,cacheAge,cacheTag)
                    p2.source = "re-cache"
                    p2.webSource = webResource
                    p2.tag = cacheTag
                    res.status(200).json(p2)
                }
            } break;
            case STORAGE_NOT_FOUND: {
                let p3 = await updateResource(webResource,webResourceTimeout,ProcessConstituentPeformance,cacheBucket,cacheResource,cacheAge,cacheTag)
                p3.source = "initialised-cache"
                p3.webSource = webResource
                p3.tag = cacheTag
                res.status(200).json(p3)
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                res.status(500).json({})
            }
        }
    } catch(e) {
        console.log("constituentperformance",e)    
        res.status(500).json({})
    }
}

async function epicdetails(
    req, 
    res
) {
    const { data } = await axios.get("https://api.londonstockexchange.com/api/gw/lse/search/autocomplete?q=BARC")
    res.status(200).json(data)
}

// https://online.hl.co.uk/ajaxx/stocks.php?pid=1719513888018&sq=PRU&filters=funds,&offset=0&instance=&format=jsonp
async function epicdetails2(
    req, 
    res
) {
    const epic = req.query.epic
    const { data } = await axios.get(`https://api.londonstockexchange.com/api/gw/lse/search/autocomplete?q=${epic}`);
    res.status(200).json(data)
}

// https://online.hl.co.uk/ajaxx/stocks.php?pid=1719513888018&sq=PRU&filters=funds,&offset=0&instance=&format=jsonp

const HL_HOST = "https://online.hl.co.uk"
const HL_PATH ="/ajaxx/stocks.php"

async function epicdetails3(
    req, 
    res
) {
    const epic = req.query.epic

    let URL = `${HL_HOST}${HL_PATH}?pid=1719514259627&sq=${epic}&filters=funds,&offset=0&instance=&format=jsonp`

    // axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
    const HEADERS = { headers: { Cookie: "HLWEBsession=1efde538284dd28a3ff892cf321c5b8f;wwwServer=!Ih4GpalN9n1RCNz+2McMypaDwpw0KfyifrUay7nsGK3zr6njEgWfQHaQFhkhjE/nb+TYJhLHeg==" } }
    const { data } = 
        await axios.get(URL,HEADERS)
 
        console.log(data)

    // const parsedJson = extractAndParseEscapedJson(data);
    res.status(200).send("OK")
    // res.status(200).json(data)
}

// https://online.hl.co.uk/ajaxx/stocks.php?pid=1719513888018&sq=PRU&filters=funds,&offset=0&instance=&format=jsonp
async function epicdetails4(
    req, 
    res
) {
    const epic = req.query.epic

    const { data } = await 
        axios.get(`https://online.hl.co.uk/ajaxx/stocks.php?pid=1719514259633&sq=${epic}&filters=funds,&offset=0&instance=&format=jsonp`)
    const parsedJson = extractAndParseEscapedJson(data);

    res.status(200).json(parsedJson)
}


module.exports = {
    sectorpeformance,
    constituentperformance,
    epicdetails,
    epicdetails2,
    epicdetails3,
    epicdetails4
}
