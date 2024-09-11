const axios = require('axios');
const CCM = require('../function-libs/cache/cache-mgt.js');

// const cModule = require('../common/c.js');
const API_HOST = "https://www.hl.co.uk"
const API_FUNDS_PATH = "ajax/funds/fund-search/search"
const API_FUNDS_QUERY = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=200&lo=0&sort=fd.full_description&sort_dir=asc&"
const API_FUNDS_QUERY2 = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&lo=0&sort=fd.full_description&sort_dir=asc&"

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
        return null
    }
}

const fundsCount = async () => {
    try {
        // Query Number of Funds
        let resource = `${API_HOST}/${API_FUNDS_PATH}?start=0&rpp=1`
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
        let resource = `${API_HOST}/${API_FUNDS_PATH}?start=${start}&rpp=${rpp}&sort_dir=asc`
        console.log("fundsPageImpl:",resource)
        return {funds : (await DownloadResource(resource)).Results}
    } catch(e) {
        console.log(e)
        return {funds : []}
    }
}

const fundsPage =  async (start,rpp) => {
    const webResourceTimeout = CCM.PAGE_REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE
    const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';

    const cacheResource = `${HL_FOLDER}/funds/funds-${start}.json`; 
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
                    res.status(200).json(await CCM.getResource(cacheBucket,cacheResource,cacheTag))
                }
                else {
                    console.log("CCM.NOT_FOUND",cacheResource)
                    res.status(200).json(await CCM.updateResource(await fundsPageImpl(start,rpp),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
                }
            } break;
            case CCM.NOT_FOUND: {
                console.log("CCM.NOT_FOUND",cacheResource)
                res.status(200).json(await CCM.updateResource(await fundsPageImpl(start,rpp),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                res.status(500).json({})
            }
        }    
    } catch(e) {
        console.log("fundspage",e)    
        res.status(500).json({})
    }
}


//https://www.hl.co.uk/ajax/funds/fund-search/search?investment=&companyid=1174&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&lo=0&sort=fd.full_description&sort_dir=asc&
module.exports = {
    fundsCount,
    fundsPage
}