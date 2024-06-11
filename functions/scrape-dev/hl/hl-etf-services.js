const cheerio = require('cheerio');
const axios = require('axios')
const c = require('../common/c.js');
const LTIME = 1080
const HTIME = 60200
const ETF_PROVIDERS_PATH = "https://www.hl.co.uk/shares/exchange-traded-funds-etfs"
const ETF_PROVIDER_FUNDS_PATH = "https://www.hl.co.uk/shares/exchange-traded-funds-etfs/list-of-etfs"

// Local functions
const sText = (text, maxLength) => (text.length > maxLength) ? (text.substring(0, maxLength - 3) + '...') : text;

async function getContent(url) {
    console.log(url)

    try {
      const { data } = await axios.get(url)

      // console.log(data)
      const $ = await cheerio.load(data)
      return $
    }
    catch(e) {
        console.log("getContent:",e.message)
    }
    return null
}

async function findById($,id) {
    const findResults = $(`#${id}`)
    return findResults
}

async function getProviderFundDetails(url) {
    let fee = "0.0"

    try {
        let $ = await getContent(url);
        if($ !== null) {
            let r = await findById($,"managementFee")
            if(r!=null) {
                fee = $(r).next().text().trimEnd().trimStart().replace("%","").replace("n/a","0.0");
                if(fee.length == 0) fee = "0.0"
                console.log(fee)
            }
        }
    } catch(e) {
        console.log("getProviderFundDetails:",e.message)
    }
    return fee;
}
async function processProviderFundListing($) {
    const tableRows = $(`table[summary="ETF search results"] tbody tr`);
    
    let ProviderFundListing = [];
    tableRows.each((i,row) => {
        let c = $(row).find('td');                        
        const skipEntities = ["&nbsp;", "Page:"," ",""];
        let ProviderFund = {}
        c.each((j, col) => {
            let html = $(col).html()
            let bSkip = html.includes("&nbsp;") || html.includes("Page")
            if(!bSkip) {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                if((entity.length !== 0)) {
                    switch(j) {
                        case 1: {
                            ProviderFund.provider = entity;
                            ProviderFund.href = $(col).find('a').attr("href")
                            ProviderFund.sedol = ProviderFund.href.substring(ProviderFund.href.lastIndexOf('/') + 1);
                        }
                        break;
                        case 4: {
                            ProviderFund.name = entity
                        } break;
                        case 5: { 
                            ProviderFund.nonLSE = $(col).find('a').attr("data-nonlse")
                        } 
                        break;
                    }
                }
            }
        })
        
        if(Object.keys(ProviderFund).length > 0) {
            ProviderFundListing.push(ProviderFund)
        }
    })
    return ProviderFundListing
}

async function getProviderFundPages($) {
    // Has more than 1 page
    const additionalPages = $(`table[summary="ETF search results"] > tbody > tr:nth-child(1) > td > table > tbody > tr`)
    let pageQueries = []
    $(additionalPages).find('a').each((i,e) => { pageQueries.push($(e).attr("href")) })
    return pageQueries;
}

async function listProviderFunds(providers) {
    console.log("listProviderFunds:")
    let offset = 0
    for(let i=0; i < providers.length; i++) {
        const path = `${ETF_PROVIDER_FUNDS_PATH}?offset=${offset}&etf_search_input=&companyid=${providers[i].id}&sectorid=`     

        // Query First Fund Listing Page
        let $ = await getContent(path)

        // Check results exist
        if($(`#no_results`).html() !== null) {
            console.log(`no_results for: ${providers[i].name} (${providers[i].id})`)
        } else {
            console.log(`Has Funds: ${providers[i].name} (${providers[i].id})`)

            // Determine further Pages from first query.
            let pageQueries = await getProviderFundPages($)
            let MasterProviderFundList = []
            // Process current, then query next page till done.
            for(let pidx = 0; pidx < pageQueries.length; pidx++) {
                let ProviderFundList = await processProviderFundListing($)

                MasterProviderFundList.push(...ProviderFundList)
                $ = await getContent(pageQueries[pidx])
            }

            for(let m=0; m < MasterProviderFundList.length; m++) {
                let d = c.randomInt(LTIME,HTIME); 
                console.log("Delay:",d); 
                c.sleep(d) 
                
                MasterProviderFundList[m].mfee = await getProviderFundDetails(MasterProviderFundList[m].href)
            }
            await c.writeFileAsync(`./ETFs/${providers[i].id}.json`,JSON.stringify(MasterProviderFundList));
        }
        console.log("===========================")
    }
}

async function listProviders() {
    console.log("listProviders")

    let { data } = await axios.get(ETF_PROVIDERS_PATH)
    const $ = await cheerio.load(data)
    const tableRows = $('#companyid option');

    let providers = [];
    tableRows.each((i,e) => {
        let providerName = $(e).text();
        let providerId = $(e).attr("value");
        if (providerId.length > 0) {
            providers.push({name:providerName,id:providerId});
        }
    })
    await listProviderFunds(providers)
}

async function testDetail() {
    await getProviderFundDetails()
}

module.exports = {

    listProviders,
    testDetail,
}
