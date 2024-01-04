const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const JSON_FORMAT = "application/json"

const CMV_SITE = "https://www.currentmarketvaluation.com/models/buffett-indicator.php";
const CMV_BUFFET_INDICATOR_SITE_URL = "https://www.currentmarketvaluation.com/models/buffett-indicator.php"
const CMV_PRICE_EARNINGS_SITE_URL = "https://www.currentmarketvaluation.com/models/price-earnings.php"
const CMV_10Y_INTEREST_RATES_SITE_URL = "https://www.currentmarketvaluation.com/models/10y-interest-rates.php"
const CMV_SP500_MEAN_REVERSION_SITE_URL = "https://www.currentmarketvaluation.com/models/s&p500-mean-reversion.php"
const CMV_YIELD_CURVE_SITE_URL = "https://www.currentmarketvaluation.com/models/yield-curve.php"
const CMV_STATE_COINCIDENCE_SITE_URL = "https://www.currentmarketvaluation.com/models/state-coincidence.php"
const CMV_MARGIN_DEBT_SITE_URL = "https://www.currentmarketvaluation.com/models/margin-debt.php"
const CMV_VIX_FEAR_INDEX_SITE_URL = "https://www.currentmarketvaluation.com/models/vix-fear-index.php"

const LOAD_TIMEOUT = 15000
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
    await sleep(LOAD_TIMEOUT);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });
    const chartsSvgs = []
    let chartContainers = $('.model-chart-wide');
    
    chartContainers.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);

        const svgCleansed = svgMatch[0].
                            replaceAll("www.currentmarketvaluation.com","").
                            replaceAll('&amp;ZeroWidthSpace;','&#8203;').
                            replaceAll("\"","'")

        const buffer = Buffer.from(svgCleansed, 'utf-8');
        chartsSvgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
    });
    return chartsSvgs
}
const buffettindicators = async (req, res) => {
    res.status(200).json(await processRequest(CMV_BUFFET_INDICATOR_SITE_URL,60000))
}
const priceearnings = async (req, res) => {
    res.status(200).json(await processRequest(CMV_PRICE_EARNINGS_SITE_URL,60000))
}
const vix = async (req, res) => {
    res.status(200).json(await processRequest(CMV_VIX_FEAR_INDEX_SITE_URL,60000))
}
const sp500meanreversion = async (req, res) => {
    res.status(200).json(await processRequest(CMV_SP500_MEAN_REVERSION_SITE_URL,60000))
}

const y10interestrates = async (req, res) => {
    res.status(200).json(await processRequest(CMV_10Y_INTEREST_RATES_SITE_URL,60000))
}
const yieldcurve = async (req, res) => {
    res.status(200).json(await processRequest(CMV_YIELD_CURVE_SITE_URL,60000))
}

module.exports = {
    buffettindicators,
    priceearnings,
    vix,
    sp500meanreversion,
    y10interestrates,
    yieldcurve
}
