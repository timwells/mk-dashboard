const axios = require('axios');
const CCM = require('./common/cache/ccm.js');
const HL = require('./hl-constants.js')
const pp = require('./hl-postprocess.js')

const downloadResource = async (resource) => {
    try {
        const {data} = await axios.get(resource,{ headers: HL.HEADERS});
        return data
    } catch(e) {
        console.log(e)
    }
    return null
}

const fundsStats = async () => {
    try {
        // Query Number of Funds
        let resource = `${HL.HOST}/${HL.FUNDS_SEARCH_PATH}?start=0&rpp=1`
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
        let resource = `${HL.HOST}/${HL.FUNDS_SEARCH_PATH}?start=${start}&rpp=${rpp}&sort_dir=asc`
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
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_1HR
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL.FUNDS_CACHE_PAGES_PATH}/funds-${start}-${rpp}.json`; 
    const cacheTag = `funds-page-${start}-${rpp}`

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

const fundsPagesListObjs = async () => {
  return await CCM.listObjects(CCM.BUCKET_NAME,`${HL.FUNDS_CACHE_PAGES_PATH}`)
}

const fundsConsolidationImpl = async () => {
    try {
        const files = await CCM.listObjects(CCM.BUCKET_NAME,`${HL.FUNDS_CACHE_PAGES_PATH}`)
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
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_1WEEK
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL.FUNDS_CACHE_CONSOLIDATED_PATH}/consolidated-funds.json`; 
    const cacheTag = "consolidated-funds"

    // Check Cache
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
                    return (await CCM.updateResource(await fundsConsolidationImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.RE_CACHE))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("funds - CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await fundsConsolidationImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.INIT_CACHE))
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

async function fundDetailsImpl(companyid,sectorid,sedol) {
    try {
        const resource = `${HL.HOST}/${HL.FUNDS_SEARCH_PATH}?companyid=${companyid}&sectorid=${sectorid}`
        let content = await downloadResource(resource)        
        if (content?.total_results > 0) {
            let totalResults = content.total_results
            for(let i=0; i < totalResults; ++i) {                
                if(content[`${i}`].sedol === sedol) 
                    return content[`${i}`]
            }
        }
    }
    catch(e) {
        console.log(e)
    }
    return {
        status: "NOK",
        searchTitle: searchTitle,
        sedol: sedol
    }
}

async function fundDetails(companyid,sectorid,sedol) {
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_12HRS
    const live = false
    const cacheResource = `${HL.FUNDS_CACHE_DETAILS_PATH}/${sedol}.json`; 
    const cacheTag = `sedol-details-${sedol}`

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
                    return (await CCM.updateResource(await fundDetailsImpl(companyid,sectorid,sedol),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.RE_CACHE))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await fundDetailsImpl(companyid,sectorid,sedol),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.INIT_CACHE))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
            }
        }    
    } catch(e) {
        console.log(`fundDetails-${companyid},${sectorid},${sedol}`,e)    
    }
    return null
}

// ETF Scan
// https://www.hl.co.uk/shares/exchange-traded-funds-etfs/list-of-etfs?etf_search_input=&companyid=128&sectorid=&tab=prices
//
//

module.exports = {
    fundsStats,
    fundsPage,
    fundsPagesListObjs,
    funds,
    fundDetails
}