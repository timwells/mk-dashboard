const axios = require('axios')
const cheerio = require('cheerio')

//const cModule = require('./common/c.js');
//const CCM = require('./common/cache-mgt.js');
//const { Storage } = require('@google-cloud/storage');
//const { Readable } = require('stream');

const LTT_HOST = "https://www.longtermtrends.net"
const REQUEST_TIMEOUT = 80000

const LTT_CACHE = 'ltt-cache'
const LTT_FOLDER = LTT_CACHE

/*
https://www.longtermtrends.net/data-wilshire-gdp-ratio/
https://www.longtermtrends.net/data-equities-gdp-ratio/
https://www.longtermtrends.net/data-gdp/
https://www.longtermtrends.net/data-dow-gdp-ratio/
https://www.longtermtrends.net/data-cyclical-vs-defensive-stocks-ratio/
https://www.longtermtrends.net/data-cyclical-vs-defensive-stocks-ratio/
https://www.longtermtrends.net/data-60-40-stocks-bonds-portfolio/
https://www.longtermtrends.net/data-stocks-vs-bonds-correlation/
*/

const MOVING_AVERAGE_125 = 125
const MOVING_AVERAGE_200 = 200
const MOVING_AVERAGE_500 = 500
const MOVING_AVERAGE_1000 = 1000

function validateBoolParameter(param, validValues) {
    return validValues.includes(param);
}

async function fetchResource(
    url,
    timeout
) {
    let { data } = await axios.get(url)
    return data
}

function formatResource(
    data
)
{
    let rwdata = data.map((e,i) => [ 
            new Date(Buffer.from(e[0],'base64').toString('ascii')).getTime(),
            +parseFloat(Buffer.from(e[1],'base64').toString('ascii')).toFixed(3)]
    )
    return { rwdata: rwdata, expMA: expMA(rwdata,5000) }
}

/*
function averageExponentialTrend(data) {
    // Ensure there are at least two data points
    if (data.length < 2) {
        throw new Error('At least two data points are required to calculate the trend.');
    }

    // Transform the y-values using the natural logarithm
    const transformedData = data.map(point => [point[0], Math.log(point[1])]);

    // Calculate the means of x and ln(y)
    const n = transformedData.length;
    const meanX = transformedData.reduce((sum, point) => sum + point[0], 0) / n;
    const meanLnY = transformedData.reduce((sum, point) => sum + point[1], 0) / n;

    // Calculate the numerator and denominator for the slope (m)
    let numerator = 0;
    let denominator = 0;
    transformedData.forEach(point => {
        const x = point[0];
        const lnY = point[1];
        numerator += (x - meanX) * (lnY - meanLnY);
        denominator += (x - meanX) ** 2;
    });

    // Calculate the slope (m) and intercept (b)
    const slope = numerator / denominator;
    const intercept = meanLnY - slope * meanX;

    // Convert the slope and intercept back to the exponential form
    const a = Math.exp(intercept);
    const b = slope;

    // Return the parameters of the exponential trend line: y = a * e^(bx)
    // return { a, b };
    return transformedData
}
*/
/*
const data = [
    [ date: '2023-07-01', value: 100 ],
    [ date: '2023-07-02', value: 105 ],
    [ date: '2023-07-03', value: 102 ],
    [ date: '2023-07-04', value: 108 ],
    [ date: '2023-07-05', value: 110 ]
];

const periods = 3; // Number of periods for EMA
const emaLine = exponentialMovingAverage(data, periods);
*/

/*
function expMA(data, periods) {
    // Ensure the data is sorted by date
    // data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const alpha = 2 / (periods + 1);
    const emaData = [];

    // Initialize the EMA with the first value
    let ema = data[0][1];

    // Calculate the EMA for each data point
    data.forEach((point, index) => {
        if (index === 0) {
            emaData.push([point[0],point[1]]);
        } else {
            ema = alpha * point[1] + (1 - alpha) * ema;
            emaData.push([point[0],+ema.toFixed(2)]);
        }
    });

    return emaData;
}
*/

// const trend = averageExponentialTrend(data);
/*
function calMA(data, period) {
    const mAD = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            mAD.push([data[i][0], null ]);
        } else {
            let sum = 0;
            for (let j = i; j > i - period; j--) { 
                sum += data[j][1] 
            }
            const average = sum / period;
            mAD.push([data[i][0], +parseFloat(average.toFixed(2))]);
        }
    }
    return mAD;
}
*/
/*
function reduceBySkip(data,skip) {
    const reducedData = [];
    for (let i = 0; i < data.length; i++) {
        if ((i + 1) % skip !== 0) {
            reducedData.push(data[i]);
        }
    }
    return reducedData;
}
*/
/*
const _longtermtrends = async (req,res) => {
    const datasetname = req.query.dataset;
    const url = `${LTT_HOST}/${datasetname}`
        
    const data = getDataSet(url) 

    let rdata = data.map((e,i) => [ new Date(Buffer.from(e[0],'base64').toString('ascii')).getTime(),
                +parseFloat(Buffer.from(e[1],'base64').toString('ascii')).toFixed(3)])
    console.log(rdata.length)
    rdata = reduceBySkip(rdata,10)
    console.log(rdata.length)

    //const ma125 = calMA(rdata,MOVING_AVERAGE_125)
    //const ma200 = calMA(rdata,MOVING_AVERAGE_200)
    //const ma500 = calMA(rdata,MOVING_AVERAGE_500)
    //const ma1000 = calMA(rdata,MOVING_AVERAGE_1000)
    const _expMA = expMA(rdata,5000);

    let obj = {
        name: datasetname,
        data: rdata,
        //ma125: ma125,
        //ma200: ma200,
        //ma500: ma500,
        //ma1000: ma1000,
        expMA: _expMA
    }

    res.status(200).json(obj);
}
*/
/*
const longtermtrends = async (req,res) => {
    const datasetname = req.query.dataset;
    const url = `${LTT_HOST}/${datasetname}`

    const webResource = url
    const webResourceTimeout = REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheResource = `${LTT_FOLDER}/${datasetname}.json` 
    const cacheAge = CCM.CACHE_AGE
    const cacheTag = datasetname
    const live = validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
*/
/*
    console.log("webResource:",webResource)
    console.log("webResourceTimeout:",webResourceTimeout)
    console.log("cacheBucket:",cacheBucket)
    console.log("cacheResource:",cacheResource)
    console.log("cacheAge:",cacheAge)
    console.log("cacheTag:",cacheTag)
*/
/*
try {
        const cacheResponse = await CCM.queryResourceStatus(cacheBucket,cacheResource);
        const hotRequest = (cacheResponse.expired || live)
        let statusCode = 200
        let dataObj = {}
        switch(cacheResponse.status) {
            case CCM.SUCCESS: {
                if(!hotRequest) { // Get Resource from cache if NOT hotRequest
                    dataObj = await CCM.getResource(cacheBucket,cacheResource)
                } else {
                    dataObj = await CCM.updateResource(
                        await CCM.fetchFormattedResource(fetchResource,webResource,formatResource),
                        cacheBucket,cacheResource,cacheAge,cacheTag,
                        "re-cache")
                }
            } break;
            case CCM.NOT_FOUND: {
                dataObj = await CCM.updateResource(
                    await CCM.fetchFormattedResource(fetchResource,webResource,formatResource),
                    cacheBucket,cacheResource,cacheAge,cacheTag,
                    "initial")
        } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                dataObj = {}
                statusCode = 500
            }
        }

        return res.status(statusCode).json(dataObj)
    } catch(e) {
        console.log("longtermtrends",e)    
        statusCode = 500
        dataObj = {}
        return res.status(statusCode).json(dataObj)
    }        
}
*/

const thumbnails = async (req, res) => {
    const { data } = await axios.get(LTT_HOST)
    const $ = cheerio.load(data)
    let cards = $('div.card.row')
    let thumbnails = []
    $(cards).each((i,card) => {
        let title = $(card).find('img').attr("alt");
        let src = $(card).find('img').attr("src");
        let footNote = $(card).find('p.card-text').text();
        thumbnails.push({title: title, src: `${LTT_HOST}${src}`, footnote: footNote })
    })

    return thumbnails;
}

const test1 = async (req, res) => {
    res.status(200).send("test1 - longtermtrends");
}

const test = async (req, res) => {
    res.status(200).send("test - longtermtrends");
}

module.exports = {
    test,
    thumbnails,
    // longtermtrends,
}
