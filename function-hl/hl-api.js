const axios = require('axios');
const CCM = require('./common/cache/ccm.js');

// const cModule = require('../common/c.js');
const HL_HOST = "https://www.hl.co.uk"
const HL_FUNDS_PATH = "ajax/funds/fund-search/search"
const API_FUNDS_QUERY = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=200&lo=0&sort=fd.full_description&sort_dir=asc&"
const API_FUNDS_QUERY2 = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&lo=0&sort=fd.full_description&sort_dir=asc&"

//const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const HL_FOLDER = 'hl-cache';
const HL_SUB_FUNDS = "funds";
const REQUEST_TIMEOUT = 80000

const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.hl.co.uk"
}

const DownloadResource = async (resource) => {
    try {
        const {data} = await axios.get(resource,{ headers: HEADERS});
        return data
    } catch(e) {
        console.log(e)
    }
    return null
}

const fundsCount = async () => {
    try {
        // Query Number of Funds
        let resource = `${HL_HOST}/${HL_FUNDS_PATH}?start=0&rpp=1`
        let totalFunds = (await DownloadResource(resource)).TotalResults
        return {fundsCount: totalFunds}
    } catch(e) {
        console.log(e)
    }
    return {fundsCount: 0}
}

const fundsPageImpl = async (start,rpp) => {
    try {
        // Query Number of Funds
        let resource = `${HL_HOST}/${HL_FUNDS_PATH}?start=${start}&rpp=${rpp}&sort_dir=asc`
        console.log("fundsPageImpl:",resource)
        return {funds : (await DownloadResource(resource)).Results}
    } catch(e) {
        console.log(e)
        return {funds : []}
    }
}

const fundsPage = async (start,rpp) => {
    const webResourceTimeout = CCM.PAGE_REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL_FOLDER}/${HL_SUB_FUNDS}/funds-${start}.json`; 
    const cacheTag = `funds-${start}`

    console.log("webResourceTimeout:",webResourceTimeout)
    console.log("cacheBucket:",cacheBucket)
    console.log("cacheResource:",cacheResource)
    console.log("cacheAge:",cacheAge)
    console.log("cacheTag:",cacheTag)
    console.log("live:",live)

    try {
        const cacheResponse = await CCM.queryResourceStatus(cacheBucket,cacheResource);
        const hotRequest = (cacheResponse.expired || live)

        switch(cacheResponse.status) {
            case CCM.SUCCESS: {
                console.log("CCM.SUCCESS")
                if(!hotRequest) { // Get Resource from cache if not hotRequest
                    return await CCM.getResource(cacheBucket,cacheResource,cacheTag)
                }
                else {
                    console.log("CCM.NOT_FOUND",cacheResource)
                    return (await CCM.updateResource(await fundsPageImpl(start,rpp),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await fundsPageImpl(start,rpp),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                return null
            }
        }    
    } catch(e) {
        console.log("fundspage",e)    
    }
    return null
}

const listFundObjs = async () => {
  return await CCM.listObjects(CCM.BUCKET_NAME,`${HL_FOLDER}/${HL_SUB_FUNDS}`)
}

const funds = async () => {
    const files = await CCM.listObjects(CCM.BUCKET_NAME,`${HL_FOLDER}/${HL_SUB_FUNDS}`)
    let funds = []
    for(let i = 0; i < files.length; i++) {
        const content = await CCM.getResource(CCM.BUCKET_NAME,files[i].name,"tag")
        if (content?.data?.funds !== undefined) {
            //console.log(i,content.data.funds.length)
            funds = [...funds, ...content.data.funds]
        } else {
            console.log("The attribute does not exist.");
        }
    }
    return funds
}
  
module.exports = {
    fundsCount,
    fundsPage,
    listFundObjs,
    funds
}