//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/B88N705
const axios = require('axios');
const cheerio = require('cheerio');
const HL = require('./hl-constants.js')

const HL_FUND_FACTSHEET_PATH ="funds/fund-discounts,-prices--and--factsheets/search-results"

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
async function fundAnalysis(sedol) {
    try {
        let analysis = {}

        // funds/fund-discounts,-prices--and--factsheets/search-results/B88N705
        const baseResource = `${HL.HL_HOST}/${HL_FUND_FACTSHEET_PATH}/${sedol}`;
        // console.log(baseResource)
        let $ = await getResource(baseResource)

        let canonicalhRef = $("head link[rel='canonical']").attr("href");
        // console.log(canonicalhRef)

        let analysisResource = `${canonicalhRef}/fund-analysis`
        // console.log(analysisResource)
        $ = await getResource(analysisResource)

        // top-10-holdings
        let holdings = [];
        let Top10HoldingsTable = $('#top-10-holdings tbody');
        Top10HoldingsTable.find('tr').each((i, row) => {
            let colsD = $(row).find('td');
            let holding = {}        
            colsD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                /*>  0 9, >  1 ICICI BANK LIMITED,>  2 2.30%,>  3 India,>  4 Banks */
                switch(j) {
                    case 0: break;
                    case 1: 
                        holding.name = entity;
                    break;
                    case 2: 
                        holding.weight = entity;
                    break;
                    case 3:
                        holding.country = entity;
                    break;
                    case 4:
                        holding.sector = entity;
                    break;
                }
            });
            holdings.push(holding);
        })

        analysis.holdings = holdings        
        return analysis

    } catch(e) {

    }
    return null

}
module.exports = {
    fundAnalysis,
}

