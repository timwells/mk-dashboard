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
        console.log(err)
    }
    return null
}
const queryFundTop10Holdings = async ($) => {
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
const queryFundAssetAllocation = async ($) => {
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

        analysis.holdings = await queryFundTop10Holdings($)       
        analysis.assetAllocation = await queryFundAssetAllocation($)       

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
async function queryEtfFunds($) {
    const tableRows = $(`table[summary="ETF search results"] tbody tr`);
    let etfFunds = [];
    tableRows.each((i,row) => {
        let c = $(row).find('td');                        
        let fundDetails = {}
        c.each((j, col) => {
            let html = $(col).html()
            let bSkip = html.includes("&nbsp;") || html.includes("Page")
            if(!bSkip) {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                if((entity.length !== 0)) {
                    switch(j) {
                        case 0: fundDetails.id = entity;  break; 
                        case 1: {
                            fundDetails.provider = entity;
                            fundDetails.sedol = $(col).find('a').attr("href").split("/").pop()
                        }
                        break;
                        case 4: {
                            fundDetails.name = entity
                        } break;
                        case 5: { 
                            fundDetails.nonLSE = $(col).find('a').attr("data-nonlse")
                        } 
                        break;
                    }
                }
            }
        })
        
        if(Object.keys(fundDetails).length > 0) {
            etfFunds.push(fundDetails)
        }
    })

    return etfFunds
}
async function etfCompaniesFundsListImpl(companyid) {
    const resource = `${HL.HOST}/${HL.ETFS_SEARCH_PATH}?etf_search_input=&companyid=${companyid}&sectorid=&tab=prices&lse_only=1`  
    
    console.log(resource)
    const $ = await getResource(resource)

    let pageEtfs = []

    // Check if funds available: no_results
    if($(`#no_results`).html() !== null) { console.log(`No Results for CompanyId:${companyid}`)} 
    else {
        console.log(`Has Results for CompanyId:${companyid}`)
        // Check if more than 1 page
        let pageRefs = []
        const additionalPages = $(`table[summary="ETF search results"] > tbody > tr:nth-child(1) > td > table > tbody > tr`)
        $(additionalPages).find('a').each((i,e) => { pageRefs.push($(e).attr("href")) })
        let page = 0;
        do {
            pageEtfs.push(...(await queryEtfFunds($)))
            page++
        } while (page < additionalPages.length)
    }

    return pageEtfs;
}
const etfCompaniesFundsList = async (companyid) => {
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_24HRS
    const live = false
    const cacheResource = `${HL.ETFS_CACHE_COMPANIES_PATH}/etf-${companyid}.json`; 
    const cacheTag = `etf-${companyid}`

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
                    return (await CCM.updateResource(await etfCompaniesFundsListImpl(companyid),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.RE_CACHE))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await etfCompaniesFundsListImpl(companyid),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.INIT_CACHE))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
            }
        }    
    } catch(e) {
        console.log("EtfCompaniesFundsList",e)    
    }
    return null
}
const etfsConsolidationImpl = async () => {
    try {
        const files = await CCM.listObjects(CCM.BUCKET_NAME,`${HL.ETFS_CACHE_COMPANIES_PATH}`)
        let etfs = []
        for(let i = 0; i < files.length; i++) {
            const content = await CCM.getResource(CCM.BUCKET_NAME,files[i].name,"tag")
            if (content?.data !== undefined) {
                // console.log(i,content.data.funds.length)
                etfs = [...etfs, ...content.data]
            } else {
                console.log("The attribute does not exist.");
            }
        }
        return etfs
    }
    catch(e) { console.log("etfsConsolidationImpl",e) }
    return []
}
const etfs = async () => {
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_1WEEK
    // const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    const live = false
    const cacheResource = `${HL.ETFS_CACHE_CONSOLIDATED_PATH}/consolidated-etfs.json`; 
    const cacheTag = "consolidated-etfs"

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
                    return (await CCM.updateResource(await etfsConsolidationImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.RE_CACHE))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("funds - CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await etfsConsolidationImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.INIT_CACHE))
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
const etfCompaniesList = async () => {
    const resource = `${HL.HOST}/${HL.ETFS_SEARCH_PATH}`;
    console.log(resource)

    const $ = await getResource(resource)
    let etfs = []

    $('#companyid').find('option').each((i, option) => {
        let _id = $(option).attr('value')
        let _name = $(option).text()
        if(_id.length > 0) etfs.push({name: _name, id: _id})
    })

    return etfs
}
const etfStats = async () => {
    let etfCompanies = await etfCompaniesList()
    return {availableCompanies: etfCompanies.length}
}

const extractSecurityEntity = ($,entity) => {
    entity.length > 0 ? $(entity[0]).text() : "n/a"
}
const etfDetailsImpl = async (sedol) => {
    let details = null
    try {
        details = {}
        const resource = `https://www.hl.co.uk/shares/shares-search-results/${sedol}`

        let { data } = await axios.get(resource)
        const $ = await cheerio.load(data)

        details.provider = $("head meta[name='Share_Title']").attr("content");
        details.name = $("head meta[name='Share_Description']").attr("content");
        details.sedol = $("head meta[name='Share_Sedol']").attr("content");
        details.epic = $("head meta[name='Share_EPIC']").attr("content");
        details.tradeable = $("head meta[name='Share_Tradeable']").attr("content");
        // details.url = $("head meta[property='og:url']").attr("content");

        // Bid | Ask
        let prices = []
        prices.push({id:"Bid", value: $("#security-price .row span[data-field='bid']").first().text().trimStart().trimEnd()})
        prices.push({id:"Ask", value: $("#security-price .row span[data-field='ask']").first().text().trimStart().trimEnd()})
        prices.push({id:"Chg.£", value: $("#security-price .row span[data-field='change']").first().text().trimStart().trimEnd()})
        prices.push({id:"Chg %", value:$("#security-price .row span[data-field='perc']").first().text().trimStart().trimEnd()})
        // prices.push({id:"Dir", value: $("#stock_change_arrow").attr("src")})
        details.prices = prices

        // Secrurity Details
        // const secStatDetails = $('#security-detail .row div')
        // console.log("sStatDetails:",secStatDetails.length)
        //secStatDetails.each((i,e) => {
        //    console.log(i,$(e).find("span").text().trim(),$(e).find("strong").text().trim())
        //})

        // Costs Table
        let costs = []
        const h2Costs = $('h2.tab-divide:contains("COSTS")');
        const trE = h2Costs.next('div.grey-gradient').find('table.factsheet-table tbody tr');
        trE.each((i, e) => {
            let cat = ""
            let cost = ""
            let desc = ""
            switch(i) {
                case 0: cat = "onc"; break;
                case 1: cat = "mfee"; break;
                case 2: cat = "ispd"; break;
            }
            desc = $(e).find("th").text().trim().replace(":","")
            cost = $(e).find("td").text().trim().replace(":","")
            costs.push({cat: cat, desc: desc, cost: cost})
        });
        details.costs = costs

        // Fund Performance Returns
        let table = $('#calendar-table-wrapper .factsheet-table');
        let perf = []
        table.find('tr').each((i, row) => {
            let colsH = $(row).find('th');
            let colsD = $(row).find('td');

            colsH.each((j, col) => {
                let pd = {}
                pd.period = $(col).text().replace(/[\n|\t]/gm, '')
                pd.retn = ""
                perf.push(pd)
            });

            colsD.each((j, col) => {
                perf[j].retn = $(col).text().replace(/[\n|\t]/gm, '') 
            });
        });
        perf.shift()
        details.performance = perf

        // top-top_10_exposures_data
        let holdings = [];
        let holdingsTable = $('#top_10_exposures_data .factsheet-table tbody');
        holdingsTable.find('tr').each((i, row) => {
            let cD = $(row).find('td');          
            
            let holding = {}
            cD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '').trimEnd().trimStart();
                switch(j) {
                    case 0: { holding.security = entity;} break;
                    case 1: { holding.weight = entity; holdings.push(holding);} break;
                }                
            });
        })
        details.holdings = holdings

        // top_10_sectors_data
        let sectors = [];
        let sectorsTable = $('#top_10_sectors_data .factsheet-table tbody');        
        sectorsTable.find('tr').each((i, row) => {
            let cD = $(row).find('td');          
            
            let sector = {}
            cD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '').trimEnd().trimStart();
                switch(j) {
                    case 0: { sector.sector = entity;} break;
                    case 1: { sector.weight = entity; sectors.push(sector);} break;
                }                
            });
        })
        details.sectors = sectors

        // top_10_countries_data
        let countries = [];
        let countriesTable = $('#top_10_countries_data .factsheet-table tbody');
        countriesTable.find('tr').each((i, row) => {
            let cD = $(row).find('td');          
            
            let country = {}
            cD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '').trimEnd().trimStart();
                switch(j) {
                    case 0: { country.country = entity;} break;
                    case 1: { country.weight = entity; countries.push(country);} break;
                }                
            });
        })
        details.countries = countries
    }
    catch(e) {
        console.log("etfDetails:",e)
    }

    return details
}
const etfDetails = async (sedol) => {
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE_24HRS
    const live = false
    const cacheResource = `${HL.ETFS_CACHE_DETAILS_PATH}/${sedol}.json`; 
    const cacheTag = `etf-details-${sedol}`

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
                    return (await CCM.updateResource(await etfDetailsImpl(sedol),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.RE_CACHE))                    
                }
            } break;
            case CCM.NOT_FOUND: { 
                console.log("CCM.NOT_FOUND",cacheResource)
                return (await CCM.updateResource(await etfDetailsImpl(sedol),cacheBucket,cacheResource,cacheAge,cacheTag,CCM.INIT_CACHE))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
            }
        }    
    } catch(e) {
        console.log("EtfCompaniesFundsList",e)    
    }
    return null
}


module.exports = {
    fundAnalysis,
    etfStats,
    etfCompaniesList,
    etfCompaniesFundsList,
    etfs,
    etfDetails
}

