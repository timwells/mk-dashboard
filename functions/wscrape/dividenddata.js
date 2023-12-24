const axios = require('axios');
const cheerio = require('cheerio');

const DIVIDENDDATA_SITE = "https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends";
const HEADERS = { headers: {
    Cookie: "cookieconsent_dismissed=yes",
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
    'Accept-Language': 'en-US,en;q=0.5', 
    'Sec-Fetch-Dest': 'document', 
    'Sec-Fetch-Mode': 'navigate', 
    'Sec-Fetch-Site': 'none', 
    'Sec-Fetch-User': '?1', 
    'Upgrade-Insecure-Requests': '1', 
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0'
}}

const scrapedata = (req, res) => {
    axios.get(DIVIDENDDATA_SITE, HEADERS)
        .then((response) => {
            const $ = cheerio.load(response.data)
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

                if (daysToGo > 0) {
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
                }
            })
            res.status(200).json(dividendData);
        })
    }

const exdividenddate = (req, res) => {
    axios.get(DIVIDENDDATA_SITE, HEADERS)
        .then((response) => {
            const $ = cheerio.load(response.data)
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
                    dividendData.push(dividendObj)
                }
            })
            res.status(200).json(dividendData);
        })
}
    
module.exports = {
    scrapedata,
    exdividenddate
}