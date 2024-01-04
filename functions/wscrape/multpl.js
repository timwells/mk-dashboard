const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const MPL_SP500_EARNINGS_GROWTH = "https://www.multpl.com/s-p-500-earnings-growth"

const LOAD_TIMEOUT = 5000
const sleep = ms => new Promise(res => setTimeout(res, ms));

let gPuppetInstance = null

async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    }
    return gPuppetInstance
}

async function processRequest(url,timeout) {
    const _puppetInstance = await getPuppetInstance();
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    await sleep(3000);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });
    const chartsSvgs = []
    let chartContainers = $('.market-fng-gauge__dial');
    
    chartContainers.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);

        const svgCleansed = svgMatch[0].
                            // replaceAll("www.currentmarketvaluation.com","").
                            // replaceAll('&amp;ZeroWidthSpace;','&#8203;').
                            replaceAll("\"","'")

        const buffer = Buffer.from(svgCleansed, 'utf-8');
        chartsSvgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
    });
    return chartsSvgs
}

const fearandgreedindicators = async (req, res) => {
    res.status(200).json(await processRequest(CNN_FEAR_AND_GREED,60000))
}

module.exports = {
    fearandgreedindicators,
}
