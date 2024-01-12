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

async function processRequest(url,tag, timeout) {
    initStopWatch()
    console.log(url)
    const _puppetInstance = await getPuppetInstance();
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    await page.waitForSelector('#price_chart');
    watchTimeNow('#price_chart',true);
    const htmlContent = await page.content();

    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });
    const Svgs = []
    let svgContainer = $(`#${tag}`);
    
    const sampleSVG = `<svg version="1.1" height="250" width="250"><circle class="circle" cx="250" cy="250" r="250" stroke-width="1" fill="#3e8ed0" fill-opacity="0.8"/><circle class="circle" cx="250" cy="250" r="23" stroke-width="1" fill="black"/><circle class="circle" cx="250" cy="250" r="234" stroke-width="2" fill="#00d1b2"/></svg>`
    svgContainer.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);
        const svgCleansed = svgMatch[0].replaceAll("\"","'")

        //const buffer = Buffer.from(svgCleansed, 'utf-8');
        //Svgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))

        //const buffer = Buffer.from(sampleSVG.replaceAll("\"","'"), 'utf-8');
        //Svgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
        //chartsSvgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
        Svgs.push(svgCleansed)
    });

    watchTimeNow('viewSvg',true);
    return Svgs
}

const price = async (req, res) => {
    // https://www.digrin.com/stocks/detail/PLUS.L/price
    res.status(200).json(await processRequest(`${DGN_PRICE_SITE_URL}/stocks/detail/${req.query.epic}/price`,
        "price_chart",60000))
}

const earnings = async (req, res) => {
    // https://www.digrin.com/stocks/detail/KGH.L/earnings
    res.status(200).json(await processRequest(`${DGN_PRICE_SITE_URL}/stocks/detail/${req.query.epic}/earnings`,
        "quarterly_earnings",60000))
}

module.exports = {
    price,
    earnings
}
