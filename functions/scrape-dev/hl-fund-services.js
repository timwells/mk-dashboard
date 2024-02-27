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

function fundSearchGroup(fundSearch) {
    let fsr = fundSearch.split("/")
    return `${fsr[fsr.length - 1]}-fund`
}

async function GetFundList(fundsDirectory) {
    // for(let fd = 0; fd < fundDir.length; fd++ ) {
    let fundList = [];
    let totalFunds = 0;

    for(let fd = 0; fd < 1; fd++ ) {
        try {
            let { data } = await axios.get(fundsDirectory[fd])
            const $ = cheerio.load(data)
            const listItems = $("#mainContent .list-unstyled li"); 
            totalFunds += listItems.length;
            console.log("GetFundList:",totalFunds,listItems.length,fundsDirectory[fd]);
            
            listItems.each((idx, el) => {
                const fund = {}
                fund.name = $(el).children("a").text();
                fund.link = $(el).children("a").attr("href");
                fundList.push(fund);
            })
        } catch (e) {
            console.log("ERROR GetFundList",e.message,fundsDirectory[fd]);
        }
    }
    return fundList
}

async function GetFundList2(fundsDirectory) {
    let fundList = [];
    let totalFunds = 0;

    try {
        let { data } = await axios.get(fundsDirectory)
        const $ = cheerio.load(data)
        const listItems = $("#mainContent .list-unstyled li"); 
        totalFunds += listItems.length;
        console.log("GetFundList:",totalFunds,listItems.length,fundsDirectory);
        
        listItems.each((idx, el) => {
            const fund = {}
            fund.name = $(el).children("a").text();
            fund.link = $(el).children("a").attr("href");
            fundList.push(fund);
        })
    } catch (e) {
        console.log("ERROR GetFundList",e.message,fundsDirectory);
    }
    return fundList
}

async function GetFundDetails(fundList) {    
    let fundDetails = [];
    console.log("GetFundDetails:",fundList.length);
    for(let i=0; i < fundList.length; i++) {
        let fundDetail = await GetFundDetail(i,fundList[i].name,fundList[i].link)
        if(fundDetail) {
            fundDetails.push(fundDetail)
            let d = c.randomInt(480,910)
            console.log(`${i} of ${fundList.length} | ${fundDetail.name} - ${fundDetail.type}  / Delay ${d} ms`)   
            c.sleep(d) 
        }
    }

    return fundDetails
}

// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?
// codes=FGWTB&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_
async function GetFundDetail(i,name,path) {
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
    }
    catch (e) {
        console.log("ERROR GetFundDetail",e.message,i,name,path);
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

async function scanFunds() {
    let fundsList = await GetFundList(FUNDS_DIR);  
    let fundsDetails = await GetFundDetails(fundsList)
}

async function scanFunds1() {
    for(let i = 0; i < FUNDS_DIR.length; i++) {
        console.log("Scan: " + FUNDS_DIR[i])
        let fundsList = await GetFundList2(FUNDS_DIR[i]);
        let fundsDetails = await GetFundDetails(fundsList)
        let fsg = fundSearchGroup(FUNDS_DIR[i])
        await c.writeFileAsync(`./funds/${fsg}.json`,JSON.stringify(fundsDetails));
    }
}

async function mergeFunds() {
    let files = await c.getFilesByPattern("./funds","*")
    let allFunds = []
    for(let f in files) {
        console.log(files[f])
        let obj = JSON.parse(await c.readFileAsync(files[f]))
        allFunds.push(...obj)
    }
    await c.writeFileAsync(`./allFunds.json`,JSON.stringify(allFunds));

    console.log("allFunds",allFunds.length)
}

module.exports = {
    scanFunds1,
    mergeFunds
}
