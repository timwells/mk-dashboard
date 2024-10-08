const cheerio = require('cheerio');
const axios = require('axios');
const c = require('./common/c');
const HL_SHARES_HOST = 'https://www.hl.co.uk/shares/stock-market-summary'
const HL_HOST = 'https://www.hl.co.uk'

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/
// search-results/j/jupiter-india-select-class-d-gbp-accumulation

/*
https://www.hl.co.uk/ajax/funds/fund-search/search?investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=60&lo=0&sort=fd.full_description&sort_dir=asc&
*/

async function _fundDetail(path) {
    let details = null
    try {
        details = {}        
        let { data } = await axios.get(path)
        const $ = await cheerio.load(data)
        details.name = $("head meta[name='Fund_Title']").attr("content");
        
        details.href = path;

        // Fund Type
        details.type = $("head meta[name='Fund_Unit_Type']").attr("content");

        // SEDOL
        details.sedol = $("head meta[name='Fund_Sedol']").attr("content");

        // Fund_Citicode
        details.citicode = $("head meta[name='Fund_Citicode']").attr("content");

        // Bid | Ask
        let bidPrice = $("#security-price .row .row .bid").html();
        let askPrice = $("#security-price .row .row .ask").html();
        details.bidPrice = (bidPrice != null) ? parseFloat(bidPrice.replace(",","").replace("p","")) : null;
        details.askPrice = (askPrice != null) ? parseFloat(askPrice.replace(",","").replace("p","")) : null;

        // Change
        details.changeArrow = $("#stock_change_arrow").attr("src")
        let changeAmount = $("#security-price .price .row .row .change-divide .change").html()
        details.changeAmount = changeAmount.trimStart().trimEnd()

        // Charges
        details.netIC = null
        details.netAC = null

        // Initial Charges
        const chargeTables = $(".factsheet-table");
        let icRows = $(chargeTables[0]).children("tbody").children("tr")
        for(let r = 0; r < icRows.length; r++) {
            let rH = $(icRows[r]).children("th").text().trimStart().trimEnd();
            let rD = $(icRows[r]).children("td").text().trimStart().trimEnd();
            
            if(rH.localeCompare("Net initial charge:") == 0) { details.netIC = (rD != null) ? parseFloat(rD.replace("%","")) : null;}
        }

        // Annual Charges
        let acRows = $(chargeTables[1]).children("tbody").children("tr")
        for(let r = 0; r < acRows.length; r++) {
            let rH = $(acRows[r]).children("th").text().trimStart().trimEnd();
            let rD = $(acRows[r]).children("td").text().trimStart().trimEnd();
            if(rH.localeCompare("Net ongoing charge:") == 0) {                
                details.netAC = (rD != null) ? parseFloat(rD.replace("%","")) : null;
            }
        }

        // Fund Returns
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

        // top-holdings
        let holdings = [];
        let HoldingsTable = $('#top-holdings .factsheet-table');
        
        HoldingsTable.find('tr').each((i, row) => {
            let colsD = $(row).find('td');          
            
            colsD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                if(j === 0) {
                    let holding = {}
                    holding.security = entity
                    holding.weight = ""
                    holdings.push(holding)
                } else {
                    holdings[i-1].weight = entity
                }
            });
        })

        details.holdings = holdings
        // details.holdingsSumm = 0.0

        // top-sectors
        let sectors = [];
        let SectorsTable = $('#top-sectors .factsheet-table');
        SectorsTable.find('tr').each((i, row) => {
            let colsD = $(row).find('td');          
            
            colsD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                if(j === 0) {
                    let sector = {}
                    sector.sector = entity
                    sector.weight = ""
                    sectors.push(sector)
                } else {
                    sectors[i-1].weight = entity
                }
            });
        })

        details.sectors = sectors
    
        // top-countries
        let countries = [];
        let CountriesTable = $('#top-countries .factsheet-table');
        CountriesTable.find('tr').each((i, row) => {
            let colsD = $(row).find('td');          
            
            colsD.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                if(j === 0) {
                    let country = {}
                    country.country = entity
                    country.weight = ""
                    countries.push(country)
                } else {
                    countries[i-1].weight = entity
                }
            });
        })

        details.countries = countries
    }
    catch (e) {
        console.log("ERROR GetFundDetail",e.message,i,name,path);
        details = null
    }

    return details
}

const test = async (req, res) => {
    res.status(200).send("Hello: HL Fund");
}

const test2 = async (req, res) => {
    res.status(200).send("Hello: HL Fund 2");
}

// https://www.hl.co.uk/
// funds/fund-discounts,-prices--and--factsheets/search-results/j/jupiter-india-select-class-d-gbp-accumulation
const test3 = async (req, res) => {
    res.status(200).send(`Hello: HL Fund 3 - ${req.query.fund}`);
}

const details = async (req, res) => {
    let fd = await _fundDetail(`${HL_HOST}/${req.query.fund}`)
    res.status(200).json(fd)
}
  
module.exports = {
    test,
    test2,
    test3,
    details,
}