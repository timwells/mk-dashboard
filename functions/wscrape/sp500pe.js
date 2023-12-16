const axios = require('axios');
const cheerio = require('cheerio');

const SP500PE_SITE = "https://www.multpl.com/s-p-500-pe-ratio/table/by-month"

const scrapedata = (req, res) => {
    let sp500pe = [] 
    axios.get(SP500PE_SITE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            $('#datatable > tbody > tr').each((i, el) => {
                if(i > 2) {
                    const rowCols = $(el).children("td")
                    const dateObj = new Date(rowCols[0].children[0].data)
                    const valStr = rowCols[1].children[0].data.trimStart().trimEnd()                    
                    sp500pe.push({d: dateObj.toLocaleDateString(),v:valStr})
                }
            })
            res.status(200).json(sp500pe.reverse());
        })
    }

module.exports = {
    scrapedata
}