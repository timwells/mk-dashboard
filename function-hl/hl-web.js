//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/B88N705
const axios = require('axios');
const cheerio = require('cheerio');
const HL = require('./hl-constants.js')
const CCM = require('./common/cache/ccm.js');

// const HL_FUND_FACTSHEET_PATH ="funds/fund-discounts,-prices--and--factsheets/search-results"

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/B88N705
// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/a/abrdn-asia-pacific-equity-i-income/fund-analysis/in-detail
//
//<meta
//content="https://www.hl.co.uk/
// funds/fund-discounts,-prices--and--factsheets/search-results/a/abrdn-asia-pacific-equity-i-income"
// name="Url" />
// https://www.hl.co.uk/
// funds/fund-discounts,-prices--and--factsheets/search-results/a/abrdn-asia-pacific-equity-i-income/fund-analysis
// <link rel="canonical" href="https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/a/abrdn-asia-pacific-equity-i-income">
// https://www.chards.co.uk/silver-price/ounce/gbp/25-year

const getResource = async (resource) => {
    try {
        const { data } = await axios.get(resource)
        return cheerio.load(data)
    }
    catch (err) {
    }
    return null
}

const queryTop10Holdings = async ($) => {
    let holdings = [];
    $('#top-10-holdings tbody').find('tr').each((i, row) => {
        let colsD = $(row).find('td');
        let holding = {}        
        colsD.each((j, col) => {
            let entity = $(col).text().replace(/[\n|\t]/gm, '')
            /*>  0 9, >  1 ICICI BANK LIMITED,>  2 2.30%,>  3 India,>  4 Banks */
            switch(j) {
                case 0: break;
                case 1: holding.name = entity; break;
                case 2: holding.weight = entity; break;
                case 3: holding.country = entity; break;
                case 4: holding.sector = entity; break;
            }
        });
        holdings.push(holding);
    })

    return holdings
}
const queryAssetAllocation = async ($) => {
    let assetAllocations = [];
    $('#asset-allocation tbody').find('tr').each((i, row) => {
        let colsD = $(row).find('td');
        let asset = {}        
        colsD.each((j, col) => {
            let entity = $(col).text().replace(/[\n|\t]/gm, '')
            switch(j) {
                case 0: break;
                case 1: asset.type = entity; break;
                case 2: asset.allocation = entity; break;
            }
        });
        assetAllocations.push(asset);
    })

    return assetAllocations
}
async function fundAnalysisImpl(sedol) {
    try {
        let analysis = {}
        analysis.sedol = sedol

        // funds/fund-discounts,-prices--and--factsheets/search-results/B88N705
        const baseResource = `${HL.HOST}/${HL.FUND_FACTSHEET_PATH}/${sedol}`;
        // console.log(baseResource)
        let $ = await getResource(baseResource)

        let canonicalhRef = $("head link[rel='canonical']").attr("href");
        // console.log(canonicalhRef)

        let analysisResource = `${canonicalhRef}/fund-analysis`
        // console.log(analysisResource)
        $ = await getResource(analysisResource)

        analysis.holdings = await queryTop10Holdings($)       
        analysis.assetAllocation = await queryAssetAllocation($)       

        return analysis
    } catch(e) {
        console.log("fundAnalysisImpl",sedol,e)
    }
    return null
}
async function fundAnalysis(sedol) {
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_1WEEK
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL.FUNDS_CACHE_ANALYSIS_PATH}/${sedol}.json`; 
    const cacheTag = `sedol-analysis-${sedol}`

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
                    return (await CCM.updateResource(await fundAnalysisImpl(sedol),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("funds - CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await fundAnalysisImpl(sedol),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
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

module.exports = {
    fundAnalysis,
}

