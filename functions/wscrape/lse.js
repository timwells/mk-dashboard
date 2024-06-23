const cheerio = require('cheerio');
const cModule = require('./common/c.js');

const LSE_SECTOR_HOST = "https://www.lse.co.uk"
const LSE_SECTOR_PERFORMANCE = LSE_SECTOR_HOST + "/share-prices/sectors/"
const USER_AGENT = "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"

const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const SECTOR_PERFOMANCE_RESOURCE = 'lse-cache/sector-peformance.json';

const processRequest = async (url,timeout) => {
    const _pInstance = await cModule.getPuppetInstance();
    const page = await _pInstance.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    const htmlContent = await page.content();
    return cheerio.load(htmlContent);
}

const getPageContent = async (url,timeout) => {
    const _pInstance = await cModule.getPuppetInstance();
    const page = await _pInstance.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    return await page.content();
    // return cheerio.load(htmlContent);
}

const getSectorPeformance = async (htmlContent) => {
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
                } break;
                case 1: { sectorPeformance.value = parseFloat($(e).text().replace(",",""));} break;
                case 2: { sectorPeformance.changePrice = parseFloat($(e).text());} break;
                case 3: { sectorPeformance.changePercent = parseFloat($(e).text().replace("%",""));} break;
            }
        })
        if(i>0) sectorPerformanceList.push(sectorPeformance)
    }) 
    return sectorPerformanceList
}

/*
<tr class="down">
    <td><a href="https://www.lse.co.uk/share-prices/sectors/aerospace/" 
        title="Aerospace Sector Value">Aerospace</a></td>
    <td class="hidden-xs">11,345.84</td>
    <td class="hidden-tiny">-162.82</td>
    <td>-1.41%</td>
</tr>
*/
const sectorpeformance = async (req, res) => {
    const $ = await processRequest(LSE_SECTOR_PERFORMANCE,80000)
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
                } break;
                case 1: { sectorPeformance.value = parseFloat($(e).text().replace(",",""));} break;
                case 2: { sectorPeformance.changePrice = parseFloat($(e).text());} break;
                case 3: { sectorPeformance.changePercent = parseFloat($(e).text().replace("%",""));} break;
            }
        })
        if(i>0) sectorPerformanceList.push(sectorPeformance)
    })

    const { Storage } = require('@google-cloud/storage');
    const { Readable } = require('stream');

    // Upload to storage
    const jsonSectorPerformanceList = JSON.stringify(sectorPerformanceList);

    // Create storage and readable stream.
    const storage = new Storage();
    const jStream = new Readable();
        
    // Define the destination file path in the bucket
    const destination = 'lse-cache/sector-peformance.json';
    
    // Get a reference to the bucket and the file
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(destination);
    
    // Create a writable stream to the file
    const writeStream = file.createWriteStream({ metadata: { contentType: 'application/json'} });

    jStream.push(jsonSectorPerformanceList);
    jStream.push(null); // No more data

    // Pipe the JSON stream to the file write stream
    jStream.pipe(writeStream)
        .on('finish', () => {       
            res.status(200).json(sectorPerformanceList);
        })
        .on('error', (error) => {
            console.error('Error uploading JSON file:', error);
            res.status(500).send('Error uploading JSON file');
        });
}
const sectorpeformance2 = async (req, res) => {
    const { Storage } = require('@google-cloud/storage');
    const { Readable } = require('stream');

    // Get a reference to the bucket and the file
    const storage = new Storage();
    const file = storage.bucket(BUCKET_NAME).file(SECTOR_PERFOMANCE_RESOURCE);
    let [metadata] = await file.getMetadata();

    // 24 hrs period
    const mins24Hours = 60 * 24
    if(cModule.minsTimeDiff(metadata.updated, new Date().toISOString()) < mins24Hours) {
        const [contents] = await file.download();
        let payload = { cacheTime : metadata.updated, data : JSON.parse(contents.toString())}
        res.status(200).json(payload);
    } else {
        // Get Page
        const htmlContent = await getPageContent()
        // Process Page
        let sectorPeformanceList = await getSectorPeformance(htmlContent)

        // Upload

        // Send Request
        res.status(200).send('Re Cache Required');
    }
}

const sectorpeformancecache = async (req, res) => {
    console.log("sectorPeformanceCache")

    const { Storage } = require('@google-cloud/storage');

    const storage = new Storage();
    const bucketName = 'mk-d-b59f2.appspot.com';
    
    const file = storage.bucket(bucketName).file('lse-cache/example_2.json');
    const [contents] = await file.download();
    const jsonContent = JSON.parse(contents.toString());

    res.status(200).send(jsonContent);
}

const sectorpeformancecache1 = async (req, res) => {
    const { Storage } = require('@google-cloud/storage');

    const storage = new Storage();
    const bucketName = 'mk-d-b59f2.appspot.com';

    const source = 'lse-cache/sector-peformance.json';
    const file = storage.bucket(bucketName).file(source);


    const [contents] = await file.download();

    const jContent = JSON.parse(contents.toString());

    res.status(200).send(jContent);
}

const sectorpeformancecacheupload = async (req, res) => {
    console.log("sectorpeformancecacheupload")

    const { Storage } = require('@google-cloud/storage');
    const { Readable } = require('stream');

    const storage = new Storage();
    const bucketName = 'mk-d-b59f2.appspot.com';
    
    // Create an in-memory JSON object
    const jsonObject = {
        message: 'Hello, World!',
        timestamp: new Date().toISOString()
    };
    
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(jsonObject);
    
    // Create a readable stream from the JSON string
    const jsonStream = new Readable();
    jsonStream.push(jsonString);
    jsonStream.push(null); // No more data
    
    // Define the destination file path in the bucket
    const destination = 'lse-cache/uploaded-sample.json';
    
    // Get a reference to the bucket and the file
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(destination);
    
    // Create a writable stream to the file
    const writeStream = file.createWriteStream({
        metadata: { contentType: 'application/json'}
    });
    
    // Pipe the JSON stream to the file write stream
    jsonStream.pipe(writeStream).on('finish', async () => {       
        const [metadata] = await file.getMetadata();
        res.status(200).json(metadata);
        // res.status(200).send('JSON file uploaded successfully.');
    })
    .on('error', (error) => {
        console.error('Error uploading JSON file:', error);
        res.status(500).send('Error uploading JSON file');
    });
}

module.exports = {
    sectorpeformance,
    sectorpeformance2,
    sectorpeformancecache,
    sectorpeformancecache1,
    sectorpeformancecacheupload
}
