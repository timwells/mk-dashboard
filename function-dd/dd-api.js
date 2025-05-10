const axios = require('axios');
const cModule = require('./common/c.js');
const cheerio = require('cheerio');

//const DIVIDENDDATA_SITE = "https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends";
const DIVIDENDDATA_SITE = "https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends";
const DIVIDENDDATA_SITE2 = "https://www.dividenddata.co.uk";
const DIVIDENDDATA_SITE3 = "https://www.exdividenddate.co.uk"

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

const exdividenddates = async () => {
    let dividendData = []
    try {
        let { data } = await axios.get(DIVIDENDDATA_SITE3, HEADERS);
        const $ = cheerio.load(data)
        const tableRows = $("#ctl00_ContentPlaceHolder1_lvExDividendDate_itemPlaceholderContainer tr");        
        tableRows.each((idx, el) => {
            if(idx > 0) {
                let divObj = {}
                const cells = $(el).find('td');
                // Extract text from each <td>
                cells.each((idx2, el2) => {
                    const cellText = $(el2).text().trim();
                    // Assign to divObj based on column index using a case statement
                    switch (idx2) {
                        case 0: divObj.epic = cellText || '?'; break;
                        case 1: divObj.name = cellText || ''; break;
                        case 2: divObj.market = cellText || ''; break;
                        case 3: divObj.exDate = cellText || ''; break;
                        case 4: divObj.amount = +parseFloat(cellText.replace(/[^0-9.]/g, '')).toFixed(2) || 0.00; break;
                        case 5: divObj.payDate = cellText || ''; break;
                    }
                });

                const [day, month, year] = divObj.exDate.split('/').map(Number);
                const exDate = new Date(year, month - 1, day);
                divObj.daysToGo = Math.ceil((exDate -  new Date()) / (1000 * 3600 * 24));
                dividendData.push(divObj)
            }
        })
    }
    catch(e) {
    }
    return {data:dividendData}
}
module.exports = {
    exdividenddates,
}