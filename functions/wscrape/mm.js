const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const MM_SMART_DUMB_MONEY_SITE_URL = "https://en.macromicro.me/charts/87237/USSmart-Money-Dumb-Money-Confidence-vs-S-P-500";

const LOAD_TIMEOUT = 30000
const sleep = ms => new Promise(res => setTimeout(res, ms));

let gPuppetInstance = null

async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    } return gPuppetInstance
}

async function processRequest(url,timeout) {
    const _puppetInstance = await getPuppetInstance();
 
    console.log(url)
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});

    await page.waitForSelector(".highcharts-container")
    //await sleep(LOAD_TIMEOUT);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });
    const chartsSvgs = []
    // let chartContainers = $('.chart-wrapper');
    let chartContainers = $('.highcharts-container')
    
    console.log("chartContainers",chartContainers.length)

    chartContainers.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);

        const svgCleansed = svgMatch[0].replaceAll("\"","'")

        const buffer = Buffer.from(svgCleansed, 'utf-8');
        chartsSvgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
    });
    return chartsSvgs
}

const smartdumbmoney = async (req, res) => {
    res.status(200).json(await processRequest(MM_SMART_DUMB_MONEY_SITE_URL,60000))
}

module.exports = {
    smartdumbmoney
}
