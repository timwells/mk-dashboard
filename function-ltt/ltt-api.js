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

// https://www.longtermtrends.net/data-dow-gold-ratio/
const getHistoricalValuesImpl = async (datasetname, period1, period2, interval) => {
    const url = `${LTT_HOST}/${datasetname}`
    const {data} = await axios.get(url)
    let rdata = data.map(
                (e,i) => { return {
                    time: new Date(Buffer.from(e[0],'base64').toString('ascii')).toISOString().slice(0, 10),
                    value: +parseFloat(Buffer.from(e[1],'base64').toString('ascii')).toFixed(3)
                }})
    let obj = {
        name: datasetname,
        data: rdata
    }

    return obj;
}    

module.exports = {
   getHistoricalValuesImpl
}
