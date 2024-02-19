//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=1000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=2000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=3000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=4000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc

const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

let startTime = 0
function initStopWatch() {
    startTime = new Date().getTime();
}
function watchTimeNow(tag,reset) {
    console.log(`${tag} : ${new Date().getTime() - startTime}`)
    if(reset) initStopWatch()
}

async function fundsQuery(url,qry) {
    initStopWatch()
    const browser = await puppeteer.launch({headless: 'new'})   
    const page = await browser.newPage()
    watchTimeNow("launched",true)
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded'});
    watchTimeNow("goto",true)

    await page.waitForSelector(qry);
    watchTimeNow('waitForSelector',true)
    const htmlContent = await page.content(); 
    await browser.close();

    const $ = cheerio.load(htmlContent, { xmlMode: true });

    // let count = $(qry);
    // return parseInt($(count).html())

    return $(qry);
}

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results
// ?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
// https://www.hl.co.uk/funds

const HL_FUNDS="https://www.hl.co.uk/funds"
const HL_SEARCH="https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results"

async function scanFunds() {
    let cQ = await fundsQuery(HL_FUNDS,"#fund-search-button-count")
    let count = parseInt($(cQ).html())
    console.log(count)

    for(let i = 0; i < count; i+=1000) {        
        let q = `${HL_SEARCH}?start=${i}&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc`
        console.log(q)
    }
}

async function serviceTest() {
    console.log("serviceTest")
}

module.exports = {
    serviceTest,
    scanFunds
}
