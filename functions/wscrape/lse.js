const cheerio = require('cheerio');
const cModule = require('./common/c.js');
const axios = require('axios');

const LSE_SECTOR_HOST = "https://www.lse.co.uk"
const LSE_SECTOR_PERFORMANCE = LSE_SECTOR_HOST + "/share-prices/sectors/"
const USER_AGENT = "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"

const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const SECTOR_PERFORMANCE_RESOURCE = 'lse-cache/sector-peformance.json';
const CONSTITUENT_PERFORMANCE_FOLDER = 'lse-cache/constituents/'
const BROKER_RATINGS_FOLDER = 'lse-cache/broker-ratings/'

const PAGE_REQUEST_TIMEOUT = 80000
const CACHE_AGE =  43200  // seconds

const STORAGE_SUCCESS = 200
const STORAGE_NOT_FOUND = 404

const LSE_EXC_HOST = "https://api.londonstockexchange.com"
const LSE_EXC_LOOKUP = "/api/gw/lse/instruments/alldata/"

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
async function ProcessBrokerRatings(
    htmlContent
){
    const $ = cheerio.load(htmlContent);
    const tableRows = $('.sp-broker-ratings__table > tbody > tr');
    let brokerRatingsList = []
    $(tableRows).each((i,row) => {
        let brokerRating = {}
        $(row).find('td').each((j,e) => {   
            // console.log(j,$(e).text());
            switch(j) {
                case 0: { brokerRating.date = $(e).text(); } break;
                case 1: { brokerRating.broker = $(e).text();} break;
                case 2: { brokerRating.recommendation = $(e).text();} break;
                case 3: { brokerRating.oldTarget = $(e).text();} break;
                case 4: { brokerRating.newTarget = $(e).text();} break;
                case 5: { brokerRating.ratingType = $(e).text();} break;
            }
        })
        // Skip header.
        if(i>0) brokerRatingsList.push(brokerRating)
    }) 
    return brokerRatingsList
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
                    constituentPerformance.epic = $(e).find('a').attr('data-item').split(".")[0]
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
async function brokerratings(
    req, 
    res
) {
    const webResource = `https://www.lse.co.uk/ShareBrokerTips.html?shareprice=${req.query.epic}`
    const webResourceTimeout = PAGE_REQUEST_TIMEOUT
    const cacheBucket = BUCKET_NAME
    const cacheResource = BROKER_RATINGS_FOLDER + req.query.epic + ".json"
    const cacheAge = CACHE_AGE
    const cacheTag = req.query.epic
    const live = validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';

    //console.log(webResource,webResourceTimeout)
    //console.log(cacheBucket,cacheResource)
    //console.log(cacheAge,cacheTag,live)

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
                    let p2 = await updateResource(webResource,webResourceTimeout,ProcessBrokerRatings,cacheBucket,cacheResource,cacheAge,cacheTag)
                    p2.source = "re-cache"
                    p2.tag = cacheTag
                    res.status(200).json(p2)
                }
            } break;
            case STORAGE_NOT_FOUND: {
                let p3 = await updateResource(webResource,webResourceTimeout,ProcessBrokerRatings,cacheBucket,cacheResource,cacheAge,cacheTag)
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
        console.log("brokeratings",e)    
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
// `https://api.londonstockexchange.com/api/gw/lse/instruments/alldata/${epic}`
async function constituentdetails(
    req, 
    res
) {
    const epic = req.query.epic
    const LSE_EXC_API = `${LSE_EXC_HOST}${LSE_EXC_LOOKUP}${epic}`
    try {
        const { data } = await axios.get(LSE_EXC_API)
            
        const payload = {
            description: data.description,
            bid: data.bid,
            offer: data.offer,
            volume: data.volume,
            turnover: data.turnover,
            epic: epic,
            sedol: data.sedol,
            chartUrl : `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_SEDOL=${data.sedol}&WIDTH=800&HEIGHT=400&TIME_SPAN=10Y&SUBSAMPLINGGRANULARITY=MONTH&XAXISCLOSECOL=0&LINE_WIDTH=1&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&ID_NOTATION_COLOR1=25456b`
        }
        res.status(200).json(payload)
    }
    catch(e) {
        res.status(500).json({})
    }
}

module.exports = {
    sectorpeformance,
    constituentperformance,
    constituentdetails,
    brokerratings,
}
