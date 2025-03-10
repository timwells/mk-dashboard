const {config} = require("../config")
const axios = require('axios')
const fetch = require('node-fetch')
const cheerio = require('cheerio');
const fs = require('fs');
const fsPromises = fs.promises;
const { promisify } = require('util');
const { log } = require("console");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/*
console.log(config);
console.log(config.apiKeys)
console.log(config.apiKeys.includes("cdb0f522-ed34-4374-9aa3-3c2c6eabba3d"))
console.log(config.apiKeys.includes("cdb0f522-ed34-4374-9aa3-3c2c6eabba3e"))
*/

function convertToCSV(arr,delim) {
    const array = [Object.keys(arr[0])].concat(arr)
    return array.map(it => {
      return Object.values(it).join(delim);
    }).join('\n')
  }

const fundDir = [
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

let fundList = [];
async function BuildFundList() {
    // for(let fd = 0; fd < fundDir.length; fd++ ) {
    for(let fd = 0; fd < 1; fd++ ) {
        console.log(fundDir[fd])
        let {data} = await axios.get(fundDir[fd])
        const $ = cheerio.load(data)
        const listItems = $("#mainContent .list-unstyled li"); 
        listItems.each((idx, el) => {
            const fund = {}
            fund.name = $(el).children("a").text();
            fund.link = $(el).children("a").attr("href");
            fundList.push(fund);
        })
    }
}

async function GetFundDetails() {
    console.log(fundList)
    console.log("GetFundDetails:",fundList.length);
    for(let i=0; i < fundList.length; i++) {
        await GetFundDetail(i,fundList[i].name,fundList[i].link)
    }
}

let fundSummary = [];
async function GetFundDetail(i,name,path) {
    let { data } = await axios.get(path)
    const $ = await cheerio.load(data)
    try {
        let details = {}        
        details.name = name;

        // Fund Type
        details.type = $("head meta[name='Fund_Unit_Type']").attr("content");

        // SEDOL
        details.sedol = $("head meta[name='Fund_Sedol']").attr("content");

        // Bid | Ask
        let bidPrice = $("#security-price .row .row .bid").html();
        let askPrice = $("#security-price .row .row .ask").html();
        details.bidPrice = (bidPrice != null) ? parseFloat(bidPrice.replace(",","").replace("p","")) : null;
        details.askPrice = (askPrice != null) ? parseFloat(askPrice.replace(",","").replace("p","")) : null;

        // Charges
        details.netIC = null
        details.netAC = null

        const chargeTables = $(".factsheet-table");

        // Initial Charges
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

        console.log(i,name,(details))

        fundSummary.push(details)
    }
    catch(e) {
        console.log("Exception:",i,name)
    }
}

async function SaveFundDetails() {
    await writeFileAsync(`./fundSummary2.csv`,convertToCSV(fundSummary,","));
}

async function convertFundDetailsToJson() {
    //await writeFileAsync(`./fundSummary.csv`,convertToCSV(fundSummary,","));
    const csvFilePath='./fundSummary.csv'
    const csv=require('csvtojson') 
    // Async / await usage
    const fundJson = await csv().fromFile(csvFilePath);
    
    await writeFileAsync(`./fundSummary.json`,JSON.stringify(fundJson));
}

// https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends
// Test Dividend Scan

const DIVIDENDDATA_SITE = "https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends";
async function ScanDividendData() {
    console.log("Scan Dividend Data");
    response = await axios.get(DIVIDENDDATA_SITE, { headers: { 
            Cookie: "cookieconsent_dismissed=yes",
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
            'Accept-Language': 'en-US,en;q=0.5', 
            'Sec-Fetch-Dest': 'document', 
            'Sec-Fetch-Mode': 'navigate', 
            'Sec-Fetch-Site': 'none', 
            'Sec-Fetch-User': '?1', 
            'Upgrade-Insecure-Requests': '1', 
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0'
    }});
    
// 0 EPIC 
// 1 Name 
// 2 Market	
// 3 Share Price	
// 4 Dividend 
// 5 Div Impact 
// 6 Declaration Date 
// 7 Ex-Dividend Date 
// 8 Payment Date        

    body = await response.data;
    const $ = cheerio.load(body)

    const tableRows = $("body > section:nth-child(1) > div:nth-child(3) > div > div.table-responsive > table > tbody > tr"); 
    let dividendData = []
    
    tableRows.each((idx, el) => {
        const rowCols = $(el).children("td")

        let daysToGo = 
            Math.ceil(
                (new Date(Date.parse(rowCols[7].children[0].data+(new Date()).getFullYear()+" 01:00")).getTime() - 
                    (new Date()).getTime())/(1000 * 3600 * 24))

            if(daysToGo < 0) {    
                daysToGo = Math.ceil(
                    (new Date(Date.parse(rowCols[7].children[0].data+((new Date()).getFullYear() + 1) + " 01:00")).getTime() - 
                    (new Date()).getTime())/(1000 * 3600 * 24))
        }

        let dividendObj = {
            epic: rowCols[0].children[0].data,
            name: rowCols[1].children[0].data,
            market: rowCols[2].children[0].data,
            price: rowCols[3].children[0].data,
            dividend: rowCols[4].children[0].data,
            impact: rowCols[5].children[0].data,
            declarationDate: rowCols[6].children[0].data,
            announcementUrl: rowCols[6].children[0].next.attribs.href,
            exDividendDate: rowCols[7].children[0].data,
            days: daysToGo
        }
        dividendData.push(dividendObj)
    })

    dividendData.forEach(d => console.log(d))
    // console.log(dividendData)
}

// https://www.londonstockexchange.com/indices/ftse-100/constituents/heatmap
const LONDONSTOCK_HEATMAP_SITE = "https://www.londonstockexchange.com/indices/ftse-100/constituents/heatmap"

async function ScanLondonStockHeatmapData() {
    console.log("Scan LondonStock Heatmap Data");
    const _CookieControl = {"necessaryCookies":["autologin","JSESSIONID","USER-TYPE","SPRING_SECURITY_REMEMBER_ME_COOKIE","lse_language","visitor_id*-hash","SecuritiesColPrefs","DerColPrefs","FundColPrefs","SummaryColPrefs"],"optionalCookies":{"analytics":"accepted","functional":"accepted"},"statement":{},"consentDate":1667130826052,"consentExpiry":730,"interactedWith":true,"user":"42D2E89C-8255-4F63-9DEC-68C9D93CD09D"}


    response = await axios.get(LONDONSTOCK_HEATMAP_SITE, 
        { 
            headers: { 
                at_check:true,
                CookieControl: _CookieControl  }
        });
    
    body = await response.data;
    const $ = cheerio.load(body)

    console.log(body)
    /*
    const tableRows = $("body > section:nth-child(1) > div:nth-child(3) > div > div.table-responsive > table > tbody > tr"); 
    let dividendData = []
    
    tableRows.each((idx, el) => {
        const rowCols = $(el).children("td")        
        let dividendObj = {
            epic : rowCols[0].children[0].data,
            name : rowCols[1].children[0].data,
            market : rowCols[2].children[0].data,
            price : rowCols[3].children[0].data,
            dividend : rowCols[4].children[0].data,
            impact : rowCols[5].children[0].data,
            declarationDate: rowCols[6].children[0].data,
            announcementUrl: rowCols[6].children[0].next.attribs.href,
            exDividendDate : rowCols[7].children[0].data,
            days : Math.ceil((new Date(Date.parse(rowCols[7].children[0].data+(new Date()).getFullYear()+" 01:00")).getTime()
                    - (new Date()).getTime())/(1000 * 3600 * 24))    
        }
        dividendData.push(dividendObj)
    })
    // console.log(dividendData)
    }
    */
}

async function calDateDifference(dateStr) {
    console.log("calDateDifference:")
    console.log(dateStr)
    parsedDate = Date.parse(dateStr);
    d = new Date(parsedDate)
    console.log(d.toISOString())
}

async function calDateDifference2(dateStr) {
    console.log("calDateDifference2:")
    timeNow = new Date()

    console.log("iso:",timeNow.toISOString())
    console.log(timeNow.getFullYear())
    
    console.log(dateStr)
    // var fullDateStr = dateStr +"-" + timeNow.getFullYear() + "T00:00:00.000Z"
    var fullDateStr = dateStr + timeNow.getFullYear() + " 01:00"
    console.log(fullDateStr)

    parsedDate = Date.parse(fullDateStr);
    exDividendDate = new Date(parsedDate)
    console.log(d.toISOString())
    var difference = exDividendDate.getTime() - timeNow.getTime()
    
    var days = Math.ceil(difference / (1000 * 3600 * 24));

    console.log(days,timeNow.toISOString(),exDividendDate.toISOString())
}

async function calDateDifference3(dateStr) {
    console.log("calDateDifference3:")
    let timeNow = new Date()
    let exDividendDate = new Date(Date.parse(dateStr + timeNow.getFullYear() + " 01:00"))
    let daysDiff = Math.ceil((exDividendDate.getTime() - timeNow.getTime())/(1000 * 3600 * 24))    
    console.log(daysDiff,timeNow.toISOString(),exDividendDate.toISOString())
}

async function calDateDifference4(dateStr) {
    console.log("calDateDifference4:")
    //let timeNow = new Date()
    //let exDividendDate = new Date(Date.parse(dateStr + (new Date()).getFullYear() + " 01:00"))
    let daysDiff = Math.ceil((new Date(Date.parse(dateStr+(new Date()).getFullYear()+" 01:00")).getTime() 
                                - (new Date()).getTime())/(1000 * 3600 * 24))    
    console.log(daysDiff)
}

const BOE_BANK_RATE = "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp"
async function boeInterestRate(){
    response = await axios.get(BOE_BANK_RATE);    
    const $ = cheerio.load(response.data)

    let ratesData = []
    $('#stats-table > tbody > tr').each((i, el) => {
        const rowCols = $(el).children("td")
        const dateStr = rowCols[0].children[0].data.replaceAll(' ','-');
        const rateStr = rowCols[1].children[0].data.trimStart();
        ratesData.push({"date":dateStr, "rate":rateStr});
        ratesData = ratesData.reverse();
    })

    console.log(ratesData)
}

const CMV = "https://www.currentmarketvaluation.com/models/buffett-indicator.php";

async function cmvModels(){
    response = await axios.get(CMV);    
    const $ = cheerio.load(response.data)

    let imgModels = [];
    $('img').each((i, el) => {
        const img = $(el).attr('src')
        if(img.includes("https")) {
            imgModels.push(img.split('?')[0])
        }
    });

    console.log(imgModels)
}

const DATAROMA = "https://www.dataroma.com"
const DATAROMA_HOME = "https://www.dataroma.com/m/home.php"

async function dataroma() {
    axios.get(DATAROMA_HOME)
        .then(async (resp) => {
            let sivs = []
            const $ = await cheerio.load(resp.data);
            const sel = '#port_body ul li a'
            $(sel).each((i, e) => {
              sivs.push({
                name: $(e)[0].children[0].data,
                lastUpdate: $(e)[0].children[1].children[0].data.trimStart(),
                detail: $(e).attr("href")
              })
            });

            sivs.sort((a, b) => a.name.localeCompare(b.name));
            console.log(sivs);
            // res.status(200).json(sivs);
        });
}

// isabelnet
const ISABELNET = "https://www.isabelnet.com/blog/"
// class
async function isabelnetblog() {
    axios.get(ISABELNET)
        .then(async (resp) => {
            let blog = []
            const $ = await cheerio.load(resp.data);
            const sel = '.news-item'
            $(sel).each((i, e) => {
                // console.log(i,$(e)[0].children[0])
                console.log(i,$(e)[0].children[0].children)
            });
            // res.status(200).json(sivs);
        });
}

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=4000&lo=0&sort=fd.full_description&sort_dir=asc
const HLFUNDS = "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=4000&lo=0&sort=fd.full_description&sort_dir=asc"
async function scanHLFunds() {
    axios.get(HLFUNDS)
        .then(async (resp) => {
            console.log(resp.data)
			await writeFileAsync(`./HLfunds.html`,resp.data);

			
			//let blog = []
            //const $ = await cheerio.load(resp.data);
            //const sel = '.news-item'
            //$(sel).each((i, e) => {
                // console.log(i,$(e)[0].children[0])
            //    console.log(i,$(e)[0].children[0].children)
            //});
            // res.status(200).json(sivs);
        });
}

// Shiller data
const SP500PE = "https://www.multpl.com/s-p-500-pe-ratio/table/by-month"
async function scanSP500PE() {
    let sp500pe = []
    axios.get(SP500PE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            $('#datatable > tbody > tr').each((i, el) => {
                if(i > 0) { // skip th
                    const rowCols = $(el).children("td")
                    const dateObj = new Date(rowCols[0].children[0].data)
                    const valStr = ($(rowCols[1]).text()).replace("†","").trimStart().trimEnd()
                    sp500pe.push({d: dateObj.toLocaleDateString(),v:valStr})
                }
            })
            // console.log(sp500pe.reverse())
            console.log("sp500pe:",sp500pe)
        });
}

const SHILLER_SITE = "https://www.multpl.com/shiller-pe/table/by-month"
const scanShillerPE = (req, res) => {
    let shillerpe = [] 
    axios.get(SHILLER_SITE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            $('#datatable > tbody > tr').each((i, el) => {
                if(i > 0) {
                    const rowCols = $(el).children("td")
                    const dateObj = new Date(rowCols[0].children[0].data)
                    const valStr = rowCols[1].children[0].data.trimStart().trimEnd()                    
                    shillerpe.push({d: dateObj.toLocaleDateString(),v:valStr})
                }
            })
            // console.log(shillerpe.reverse())
            // console.log(shillerpe)
            console.log(shillerpe)
        })
    }

const BUFFETT_INDICATOR_SITE = "https://www.currentmarketvaluation.com/models/buffett-indicator.php"
const buffettIndicator = (req, res) => {
    axios.get(BUFFETT_INDICATOR_SITE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            const c = $('#JSON-HC-BI-3').text();            
            console.log(c)
            
        })
    };



const DIVIDENDDATA_SITE2 = "https://www.dividenddata.co.uk";
const HEADERS = { headers: {
    //Cookie: "cookieconsent_dismissed=yes",
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
    'Accept-Language': 'en-US,en;q=0.5', 
    //'Sec-Fetch-Dest': 'document', 
    //'Sec-Fetch-Mode': 'navigate', 
    //'Sec-Fetch-Site': 'none', 
    //'Sec-Fetch-User': '?1', 
    //'Upgrade-Insecure-Requests': '1', 
    //'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0'
    // 'User-Agent': 'PostmanRuntime/7.42.0'
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
}}
        
const getDividendData = async () => {
    let { data } = await axios.get(DIVIDENDDATA_SITE2, HEADERS);
    const $ = cheerio.load(data)
    // const tableRows = $("body > section:nth-child(1) > div:nth-child(3) > div > div.table-responsive > table > tbody > tr"); 
    const tableRows = $("tbody tr"); 

    console.log("exdividenddate:",tableRows.length);

}

(async () => {
    //await BuildFundList();
    //await GetFundDetails();
    //await SaveFundDetails();
    //await convertFundDetailsToJson();

    // await GetFundDetail(0,"aberdeen-standard-global","https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/a/aberdeen-standard-global-innovation-equity-accumulation")
    // await ScanDividendData();
    // await ScanLondonStockHeatmapData();
    //calDateDifference("27-Oct")
    //calDateDifference("27-Oct-2022")
    //calDateDifference4("27-Oct")
    // boeInterestRate();
    //cmvModels();
    // await dataroma();

    // await isabelnetblog()
	// await scanHLFunds()
    
    // await scanSP500PE()
    // await scanShillerPE()
  
    //await buffettIndicator();

    await getDividendData()

    console.log("done");
})();
  