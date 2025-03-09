const axios = require('axios');
const cheerio = require('cheerio');

//const DIVIDENDDATA_SITE = "https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends";
const DIVIDENDDATA_SITE = "https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends";
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

const HEADERS2 = { headers: {
    'Cookie': 'cookieconsent_dismissed=yes',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
    'Accept-Language': 'en-US,en;q=0.5' 
    //'Sec-Fetch-Dest': 'document', 
    //'Sec-Fetch-Mode': 'navigate', 
    //'Sec-Fetch-Site': 'none', 
    //'Sec-Fetch-User': '?1', 
    //'Upgrade-Insecure-Requests': '1', 
    //'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0'
    //'User-Agent': 'PostmanRuntime/7.42.0'
    //'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
}}

const exdividenddate = async () => {
    let dividendData = []
    
    try {
        let { data } = await axios.get(DIVIDENDDATA_SITE, HEADERS);
        // let { data } = await axios.get(DIVIDENDDATA_SITE);

        return data //.substring(0, 20);

        const $ = cheerio.load(data)
        // const tableRows = $("body > section:nth-child(1) > div:nth-child(3) > div > div.table-responsive > table > tbody > tr"); 
        const tableRows = $("tbody tr"); 
    
        console.log("exdividenddate:",tableRows.length);
        
        tableRows.each((idx, el) => {
            const rowCols = $(el).children("td")        
 
            // console.log(rowCols)

            let daysToGo = 
                Math.ceil(
                    (new Date(Date.parse(rowCols[7].children[0].data+(new Date()).getFullYear()+" 01:00")).getTime() - 
                        (new Date()).getTime())/(1000 * 3600 * 24))
            
            console.log("daysToGo:",daysToGo)

            if(daysToGo < 0) {    
                daysToGo = Math.ceil(
                    (new Date(Date.parse(rowCols[7].children[0].data+((new Date()).getFullYear() + 1) + " 01:00")).getTime() - 
                    (new Date()).getTime())/(1000 * 3600 * 24))
            }

            if ( daysToGo > 0) {
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

                dividendObj.price = dividendObj.price.replace("p","").replace("€",""),
                dividendObj.dividend = dividendObj.dividend.replace("p","").replace("€",""), 
                dividendObj.impact = dividendObj.impact.replace("%",""),
                
                dividendData.push(dividendObj)
            }
        })
    } catch (e) {
        console.log("exdividenddate:",e)
        dividendData = e
    }
    return dividendData;
}
    
const exdividenddate2 = async () => {
    let dividendData = []
    let { data } = await axios.get(DIVIDENDDATA_SITE, HEADERS)
    return data
}

const exdividenddate3 = async () => {
    let dividendData = {}

    try {
        // let { data } = await axios.get(DIVIDENDDATA_SITE2, HEADERS);
        let { data } = await axios.get(DIVIDENDDATA_SITE2,HEADERS2);
        const $ = cheerio.load(data)
        // const tableRows = $("body > section:nth-child(1) > div:nth-child(3) > div > div.table-responsive > table > tbody > tr"); 
        const tableRows = $("tbody tr"); 
    
        dividendData = {'data': data}
        // dividendData = {'tablerows': tableRows.length}
    } catch(e) {
        dividendData = e
    } 
    return dividendData
}

module.exports = {
    exdividenddate,
    exdividenddate2,
    exdividenddate3
}