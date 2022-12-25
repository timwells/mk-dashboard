const axios = require('axios');
const cheerio = require('cheerio');
const JSON_FORMAT = "application/json"

const CMV_SITE = "https://www.currentmarketvaluation.com/models/buffett-indicator.php";

const scrapedata = (req, res) => {
    axios.get(CMV_SITE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);

            let imgModels = [];
            $('img').each((i, el) => {
                const img = $(el).attr('src')
                if(img.includes("https") && !img.includes("books")) {
                    imgModels.push(img.split('?')[0])
                }
            });
            res.status(200).json(imgModels);
        });
}

module.exports = {
    scrapedata
}
