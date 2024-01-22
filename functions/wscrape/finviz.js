const cheerio = require('cheerio');
const cModule = require('./common/c')

const FVZ_SITE_HOST = "https://finviz.com"
const FVZ_SITE_NEWS = FVZ_SITE_HOST + "/news.ashx"


async function processRequest(url,timeout) {
    const _puppetInstance = await cModule.getPuppetInstance();
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    await page.waitForSelector("#news")

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });

    const chartsSvgs = []

    return chartsSvgs
}
const news = async (req, res) => {
    res.status(200).json(await processRequest(FVZ_SITE_NEWS,60000))
}

module.exports = {
    news
}




// const tableRows = $("body > section:nth-child(1) > div:nth-child(3) > div > div.table-responsive > table > tbody > tr"); 
    
    /*
    const $ = cheerio.load(response.data)
    const tableRows = $(".news_time-table > tbody > tr");
    console.log(tableRows.length)
    */
    //tableRows.each((idx, el) => {
    //    const rowCols = $(el).children("td")
    //    console.log(rowCols)
    //})
