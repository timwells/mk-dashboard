const axios = require('axios');
const cheerio = require('cheerio');

// https://www.multpl.com/
const SHILLER_SITE = "https://www.multpl.com/shiller-pe/table/by-month"
const scrapedata = (req, res) => {
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
            res.status(200).json(shillerpe.reverse());
        })
    }

module.exports = {
    scrapedata
}