const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

const DGN_PRICE_SITE_URL = "https://www.digrin.com/stocks/detail/PLUS.L/price"

let startTime = 0
function initStopWatch() {
    startTime = new Date().getTime();
}
function watchTimeNow(tag,reset) {
    console.log(`${tag} : ${new Date().getTime() - startTime}`)
    if(reset) initStopWatch()
}

async function dgbPirce(tag,url) {
    initStopWatch()
    const browser = await puppeteer.launch({headless: 'new'})   
    const page = await browser.newPage()
    watchTimeNow("launched",true)
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded'});
    watchTimeNow("goto",true)

    await page.waitForSelector('#price_chart');
    watchTimeNow('waitForSelector',true)
    const htmlContent = await page.content(); 
    await browser.close();

    const $ = cheerio.load(htmlContent, { xmlMode: true });
    let chartContainers = $('#price_chart');
    chartContainers.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);

        console.log(svgMatch[0]);
    // await writeFileAsync(`./${tag}-chart-${i}.svg`,svgCleansed);
  })
}

async function dgbPirce1(tag,url){
    console.log(tag,url);
}

async function dgbTest() {
    await dgbPirce("tag",DGN_PRICE_SITE_URL)
}

module.exports = {
    dgbTest
}
