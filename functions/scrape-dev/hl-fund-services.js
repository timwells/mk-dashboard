//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=1000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=2000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=3000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=4000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc

const cheerio = require('cheerio');
const axios = require('axios')
const c = require('./common/c');

const FUNDS_DIR = [
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/a",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/b",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/c",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/d",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/e",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/f",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/g",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/h",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/i",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/j",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/k",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/l",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/m",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/n",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/o",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/p",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/q",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/r",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/s",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/t",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/u",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/v",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/w",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/x",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/y",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/z",
    "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/0"
]

async function GetFundList(fundsDirectory) {
    // for(let fd = 0; fd < fundDir.length; fd++ ) {
    let fundList = [];
    for(let fd = 0; fd < 1; fd++ ) {
        let { data } = await axios.get(fundsDirectory[fd])
        const $ = cheerio.load(data)
        const listItems = $("#mainContent .list-unstyled li"); 
        listItems.each((idx, el) => {
            const fund = {}
            fund.name = $(el).children("a").text();
            fund.link = $(el).children("a").attr("href");
            fundList.push(fund);
        })
    }
    return fundList
}

async function GetFundDetails(fundList) {
    let fundDetails = [];
    console.log("GetFundDetails:",fundList.length);
    for(let i=0; i < fundList.length; i++) {
        let fundDetail = await GetFundDetail(i,fundList[i].name,fundList[i].link)
        if(fundDetail)
            fundDetails.push(fundDetail)
    }
    return fundDetails
}


// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?
// codes=FGWTB&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_
async function GetFundDetail(i,name,path) {
    let { data } = await axios.get(path)
    const $ = await cheerio.load(data)
    let details = {}        
    try {
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

        // Charges
        details.netIC = null
        details.netAC = null

        // Initial Charges
        const chargeTables = $(".factsheet-table");
        let icRows = $(chargeTables[0]).children("tbody").children("tr")
        for(let r = 0; r < icRows.length; r++) {
            let rH = $(icRows[r]).children("th").text().trimStart().trimEnd();
            let rD = $(icRows[r]).children("td").text().trimStart().trimEnd();
            if(rH.localeCompare("Net initial charge:") == 0) {
                details.netIC = (rD != null) ? parseFloat(rD.replace("%","")) : null;;
            }
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
        console.log(i,details.name,(details))
    }
    catch(e) {
        console.log("Exception:",i,name,path)
        details = null
    }
    return details
}

async function SaveFundDetails(funds) {
    await c.writeFileAsync(`./fundSummary2.json`,JSON.stringify(funds));
}

async function convertFundDetailsToJson() {
    //await writeFileAsync(`./fundSummary.csv`,convertToCSV(fundSummary,","));
    const csvFilePath='./fundSummary.csv'
    const csv=require('csvtojson') 
    // Async / await usage
    const fundJson = await csv().fromFile(csvFilePath);
    
    await writeFileAsync(`./fundSummary.json`,JSON.stringify(fundJson));
}

async function fundsQuery(url,qry,timeout) {
    c.initStopWatch()
    let browser = await c.getPuppetInstance()
    const page = await browser.newPage()
    c.watchTimeNow("launched",true)
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded'});
    c.watchTimeNow("goto",true)

    await page.waitForSelector(qry);
    c.watchTimeNow('waitForSelector',true)
    await c.sleep(timeout)

    const htmlContent = await page.content(); 
    await browser.close();

    return cheerio.load(htmlContent, { xmlMode: true });
}

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results
// ?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
// https://www.hl.co.uk/funds

const HL_SEARCH = "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results"

async function scanFunds() {
    //let $ = await fundsQuery(HL_FUNDS,"#fund-search-button-count",5000)    
    //let count = parseInt($("#fund-search-button-count").html())
    //console.log(count)

    /*
    for(let i = 0; i < count; i+=1000) {
        let q = `${HL_SEARCH}?start=${i}&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc`
        console.log(q)
    }
    */
    let i = 0;
    let page = 1;
    let q = `${HL_SEARCH}?start=${i}&rpp=${page}&lo=0&sort=fd.full_description&sort_dir=asc`
    $ = await fundsQuery(q,".results__table",4000)
    const sel = '.results__table > tbody > tr';

    // Select the table by its id
    const table = $('.results__table');

    // Iterate over each row in the table
    table.find('tr').each((i, row) => {
        const columns = $(row).find('td'); // Find all td elements within the current row

        // Iterate over each column in the row
        columns.each((j, column) => {
            // console.log(`Row ${i + 1}, Column ${j + 1}: ${$(column).text()}`);
            console.log(column.children.length,column.children[0].data);
            console.log(column.children[0]);
            console.log('--------------------------');

            //console.log(`${$(column).text()}`);
            //console.log(`${$(column).data}`);
        });
    });

    /*
    $(sel).each((i, e) => {         
        console.log(`row ${i} of ${e.children.length}`);
        for(let a=0; a < e.children.length; a++) {
            console.log(e.children[a].name)
            console.log(e.children[a].)
            // console.log(e.children[a].children[0].children.data)
        }
    })
    */
}

async function scanFunds1(){
    let fundsList = await GetFundList(FUNDS_DIR);
    //console.log(fundsList)
    let fundsDetails = await GetFundDetails(fundsList)
    //console.log(fundsDetails)
    await SaveFundDetails(fundsDetails)
}

module.exports = {
    scanFunds,
    scanFunds1
}
