const axios = require('axios');
const cheerio = require('cheerio');
const JSON_FORMAT = "application/json"

const BOE_BANK_RATE = "https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp"

const scrapedata = (req, res) => {
    axios.get(BOE_BANK_RATE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            let ratesData = []
            $('#stats-table > tbody > tr').each((i, el) => {
                const rowCols = $(el).children("td")
                const dateStr = rowCols[0].children[0].data.replaceAll(' ','-');
                const rateStr = rowCols[1].children[0].data.trimStart();
                ratesData.push({"date":dateStr, "rate":rateStr});
            })
            res.status(200).json(ratesData.reverse());
        });
}

module.exports = {
    scrapedata
}