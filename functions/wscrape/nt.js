const axios = require('axios');
const cheerio = require('cheerio');
const JSON_FORMAT = "application/json"

const NT_SITE = "https://www.nakedtrader.co.uk/trades.htm";
const scrapedataversion = (req, res) => {
    res.status(200).send('scrapedataversion')       
}
// ["Stock","Epic","Qty","Price","Target","Stop","Buy Date","Sell","Sell","Date","P/L"]
const scrapedata = (req, res) => {
    axios.get(NT_SITE,{ headers: { Cookie: "nt=1;" } })
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            const rows = [];
            const sel= '.trades tbody tr';
            const headers = [];
            $(sel).each((i, e) => {
                let rowObj = {};
                $(e).find("th").each((i, e) => { 
                    headers.push($(e).text().trim().toLowerCase().replace("/","").replace(" ","")) 
                });
                $(e).find("td").each((i, e) => { rowObj[headers[i]] = $(e).text().trim(); });

                if(Object.keys(rowObj).length > 0) {
                    rows.push(rowObj)
                }
            });          
            res.status(200).json(rows);
        });
}

module.exports = {
    scrapedataversion,
    scrapedata
}