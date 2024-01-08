const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const DGN_PRICE_SITE_URL1 = "https://www.digrin.com/stocks/detail/PLUS.L/price"
const DGN_PRICE_SITE_URL = "https://www.digrin.com"

let startTime = 0
function initStopWatch() { startTime = new Date().getTime(); }
function watchTimeNow(tag,reset) {
    console.log(`${tag} : ${new Date().getTime() - startTime}`)
    if(reset) initStopWatch()
}

let gPuppetInstance = null
async function getPuppetInstance() {
    if(!gPuppetInstance) { gPuppetInstance = await puppeteer.launch({headless: 'new'}) }
    return gPuppetInstance
}

async function processRequest(url,timeout) {
    initStopWatch()
    console.log(url)
    const _puppetInstance = await getPuppetInstance();
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    await page.waitForSelector('#price_chart');
    watchTimeNow('#price_chart',true);
    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });
    const viewSvg = []
    let svgContainer = $('#price_chart');
    
    svgContainer.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);
        const svgCleansed = svgMatch[0].replaceAll("\"","'")
        // const buffer = Buffer.from(svgCleansed, 'utf-8');
        // viewSvg.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
        viewSvg.push(svgCleansed)
    });

    watchTimeNow('viewSvg',true);
    return viewSvg
}

const price = async (req, res) => {
    // https://www.digrin.com/stocks/detail/PLUS.L/price
    res.status(200).json(await processRequest(`${DGN_PRICE_SITE_URL}/stocks/detail/${req.query.epic}/price`,60000))
}

module.exports = {
    price,
}
