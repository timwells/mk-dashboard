const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cModule = require('./common/c')

const QQ_SITE = "https://www.quiverquant.com/";
const QQ_FEAR_AND_GREED = "fearandgreed"

async function processRequest(url,timeout) {
    const _puppetInstance = await cModule.getPuppetInstance();
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    await page.waitForSelector(".svg-container")

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });

    const chartsSvgs = []
    let chartContainers = $('#11dea102-7d86-4d82-8e96-d3f71c12246b')
    
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

const fearandgreed= async (req, res) => {
    res.status(200).json(await processRequest(QQ_SITE + QQ_FEAR_AND_GREED ,60000))
}

module.exports = {
    fearandgreed
}
