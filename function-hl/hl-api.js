const axios = require('axios');
const cheerio = require('cheerio');
const CCM = require('./common/cache/ccm.js');
const pp = require('./hl-postprocess.js')

// const cModule = require('../common/c.js');
const HL_HOST = "https://www.hl.co.uk"
const HL_FUNDS_PATH = "ajax/funds/fund-search/search"
const API_FUNDS_QUERY = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=200&lo=0&sort=fd.full_description&sort_dir=asc&"
const API_FUNDS_QUERY2 = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&lo=0&sort=fd.full_description&sort_dir=asc&"

//const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const HL_FOLDER = 'hl-cache';
const HL_SUB_FUNDS = "funds";
const HL_SUB_FUNDS_PAGES = "pages";
const HL_SUB_FUNDS_CONSOLIDATED = "consolidated";

const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.hl.co.uk"
}

const downloadResource = async (resource) => {
    try {
        const {data} = await axios.get(resource,{ headers: HEADERS});
        return data
    } catch(e) {
        console.log(e)
    }
    return null
}

const fundsStats = async () => {
    try {
        // Query Number of Funds
        let resource = `${HL_HOST}/${HL_FUNDS_PATH}?start=0&rpp=1`
        let totalFunds = (await downloadResource(resource)).TotalResults
        return {availableFunds: totalFunds}
    } catch(e) {
        console.log(e)
    }
    return {availableFunds: 0}
}

const fundsPageImpl = async (start,rpp) => {
    try {
        // Query Number of Funds
        let resource = `${HL_HOST}/${HL_FUNDS_PATH}?start=${start}&rpp=${rpp}&sort_dir=asc`
        let content = await downloadResource(resource)        
        if (content?.Results !== undefined) {
            for(let i = 0; i < content.Results.length; i++) {
                pp.delFundAttrList.forEach(attr => { delete content.Results[i][attr] })

                // Optimise Floats
                pp.optimseFundAttrFloatList.forEach(attr => { 
                    content.Results[i][attr] = +(parseFloat(content.Results[i][attr])).toFixed(2)                
                })
                content.Results[i].name = content.Results[i].full_description
            }
            return {funds: content.Results}
        }
    } catch(e) { 
        console.log("fundsPageImpl",e) 
    }
    return {funds: []}
}

const fundsPage = async (start,rpp) => {
    const webResourceTimeout = CCM.PAGE_REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL_FOLDER}/${HL_SUB_FUNDS}/${HL_SUB_FUNDS_PAGES}/funds-${start}-${rpp}.json`; 
    const cacheTag = `funds-${start}`

    //console.log("webResourceTimeout:",webResourceTimeout)
    //console.log("cacheBucket:",cacheBucket)
    //console.log("cacheResource:",cacheResource)
    //console.log("cacheAge:",cacheAge)
    //console.log("cacheTag:",cacheTag)
    //console.log("live:",live)

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
            }
        }    
    } catch(e) {
        console.log("fundspage",e)    
    }
    return null
}
const listFundObjs = async () => {
  return await CCM.listObjects(CCM.BUCKET_NAME,`${HL_FOLDER}/${HL_SUB_FUNDS}/${HL_SUB_FUNDS_PAGES}`)
}

const fundsConsolidationImpl = async () => {
    try {
        const files = await CCM.listObjects(CCM.BUCKET_NAME,`${HL_FOLDER}/${HL_SUB_FUNDS}/${HL_SUB_FUNDS_PAGES}`)
        let funds = []
        for(let i = 0; i < files.length; i++) {
            const content = await CCM.getResource(CCM.BUCKET_NAME,files[i].name,"tag")
            if (content?.data?.funds !== undefined) {
                // console.log(i,content.data.funds.length)
                funds = [...funds, ...content.data.funds]
            } else {
                console.log("The attribute does not exist.");
            }
        }
        return funds
    }
    catch(e) {
        console.log("fundsConsolidationImpl",e)    
    }
    return []
}

const funds = async () => {
    const webResourceTimeout = CCM.PAGE_REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_1YEAR
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL_FOLDER}/${HL_SUB_FUNDS}/${HL_SUB_FUNDS_CONSOLIDATED}/consolidated-funds.json`; 
    const cacheTag = "consolidated-funds"

    // Check Cache
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
                console.log("funds - CCM.SUCCESS")
                if(!hotRequest) { // Get Resource from cache if not hotRequest
                    return await CCM.getResource(cacheBucket,cacheResource,cacheTag)
                }
                else {
                    console.log("funds - CCM.NOT_FOUND",cacheResource)
                    return (await CCM.updateResource(await fundsConsolidationImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("funds - CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await fundsConsolidationImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
            }
        }    
    } catch(e) {
        console.log("funds",e)    
    }
    return []
}

async function fundDetail(searchTitle) {
    try {
        const resource = `${HL_HOST}/${HL_FUNDS_PATH}?investment=${searchTitle}`
        let content = await downloadResource(resource)        
        if (content?.total_results == 1) {
            return content["0"]
        }
        return {}
    }
    catch(e) {
        console.log(e)
    }
    return {}
}


module.exports = {
    fundsStats,
    fundsPage,
    listFundObjs,
    funds,
    fundDetail
}