const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

const CMV_BUFFET_INDICATOR_SITE_URL = "https://www.currentmarketvaluation.com/models/buffett-indicator.php"
const CMV_PRICE_EARNINGS_SITE_URL = "https://www.currentmarketvaluation.com/models/price-earnings.php"
const CMV_10Y_INTEREST_RATES_SITE_URL = "https://www.currentmarketvaluation.com/models/10y-interest-rates.php"
const CMV_SP500_MEAN_REVERSION_SITE_URL = "https://www.currentmarketvaluation.com/models/s&p500-mean-reversion.php"
const CMV_YIELD_CURVE_SITE_URL = "https://www.currentmarketvaluation.com/models/yield-curve.php"
const CMV_STATE_COINCIDENCE_SITE_URL = "https://www.currentmarketvaluation.com/models/state-coincidence.php"
const CMV_MARGIN_DEBT_SITE_URL = "https://www.currentmarketvaluation.com/models/margin-debt.php"
const CMV_VIX_FEAR_INDEX_SITE_URL = "https://www.currentmarketvaluation.com/models/vix-fear-index.php"

async function scrapeWebsite(url) {
  console.log("-> scrapeWebsite")
  const browser = await puppeteer.launch();
  console.log("-> scrapeWebsite.1")
  const page = await browser.newPage();

  console.log("-> scrapeWebsite.2")
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Get the HTML content after the page has loaded
  console.log("-> scrapeWebsite.3")
  const htmlContent = await page.content();
  console.log(htmlContent)

  // Close the browser
  console.log("-> scrapeWebsite.4")
  await browser.close();

  // Use Cheerio to parse the HTML content
  console.log("-> scrapeWebsite.5")
  const $ = cheerio.load(htmlContent);

  // Now you can use Cheerio selectors to extract data from the loaded content
  console.log("-> scrapeWebsite.6")
  const mainDiv = $('#JSON-HC-BI-0')

  console.log(mainDiv)
  // Get all elements below the selected div
  const elementsBelowMain = mainDiv.find('*');
  
  // Print the HTML of all elements below the selected div
  elementsBelowMain.each((i, e) => {
    console.log($.html(e));
  });

  console.log("<- scrapeWebsite")
}

const sleep = ms => new Promise(res => setTimeout(res, ms));
async function scrapeWebsite2(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, {timeout: 60000, waitUntil: 'domcontentloaded'});
    // page.waitForSelector('.html5-video-container')

    await sleep(16000);
    const htmlContent = await page.content();
    await browser.close();

    // #highcharts-6770ojr-0 > svg
    const $ = cheerio.load(htmlContent);
    // const mainDiv = $('#JSON-HC-BI-0 > .highcharts-root')
    //const mainDiv = $('#JSON-HC-BI-0')
    //const mainDiv = $('.highcharts-root
    // const mainDiv = $('.highcharts-container')
    // const mainDiv = $('#highcharts-6770ojr-0 > svg')
    
/*
const rowCols = $(el).children("td")        
let daysToGo = 
    Math.ceil(
        (new Date(Date.parse(rowCols[7].children[0].data+(new Date()).getFullYear()+" 01:00")).getTime() - 
            (new Date()).getTime())/(1000 * 3600 * 24))

if(daysToGo < 0) {    
    daysToGo = Math.ceil(
        (new Date(Date.parse(rowCols[7].children[0].data+((new Date()).getFullYear() + 1) + " 01:00")).getTime() - 
        (new Date()).getTime())/(1000 * 3600 * 24))
}

if (daysToGo > 0) {
    let dividendObj = {
        epic: rowCols[0].children[0].data,

*/

    let charts = $('.model-chart-wide');       
    charts.each((i, e) => {
        console.log(i,$(e).children.length,$(e).name)
        
        //let ch = $(e).children;
        //ch.each((ih,eh) => {
        //    console.log(ih,$(eh).children.length)
        //})
        //console.log(i,e.children[0].attr('id'))
    });

    //const eBelowMain = mainDiv.find('*');
    // Print the HTML of all elements below the selected div
    //console.log(eBelowMain.length)
    //let htmlx = ""
    //eBelowMain.each((i, e) => {
    //    htmlx += ($.html(e));
    //});
    //await writeFileAsync("./ploy.svg",htmlx)
    //console.log(htmlx);
}

const html = 
'<html><body><div id="main"><p>Paragraph 1</p><p>Paragraph 2</p><div class="nested"><span>Span 1</span><span>Span 2</span><ul><li>List item 1</li><li>List item 2</li></ul></div></div></body></html>'

function testExtractor() {
    console.log("testExtractor")
    const $ = cheerio.load(html);

    // Select the div with the ID "main"
    const mainDiv = $('#main');

    // Get all elements below the selected div
    const elementsBelowMain = mainDiv.find('*');

    // Print the HTML of all elements below the selected div
    elementsBelowMain.each((index, element) => {
      console.log($.html(element));
    });
}

function buffettIndicator2() {
    console.log("buffettIndicator2")

    const $ = cheerio.load(html);

    // Select the div with the ID "main"
    const mainDiv = $('#main');

    // Get all elements below the selected div
    const elementsBelowMain = mainDiv.find('*');

    // Print the HTML of all elements below the selected div
    elementsBelowMain.each((index, element) => {
    console.log($.html(element));
    });
}

function buffettIndicator() {
    console.log("buffetIndicator")
    scrapeWebsite2(CMV_SITE_URL).then(response => {})
}

async function scrapeWebsite3() {
    let html = await readFileAsync("./website.html",{ encoding: 'utf8', flag: 'r' })    
    const $ = cheerio.load(html, { xmlMode: true });

    let chartContainers = $('.model-chart-wide');

    //let chartContainers = $('.model-chart-wide .highcharts-container > svg')
    chartContainers.each(async (i, e) => {
      let chartHtml = $(e).html();
      const svgRegex = /<svg[\s\S]*?<\/svg>/;
      const svgMatch = chartHtml.match(svgRegex);
      const svgCleansed = svgMatch[0].
                            replaceAll("www.currentmarketvaluation.com","").
                            //replaceAll('ZeroWidthSpace;','')
                            replaceAll('&amp;ZeroWidthSpace;','&#8203;')

      // await writeFileAsync(`./chart-${i}-base.svg`,chartHtml);
      await writeFileAsync(`./chart-${i}.svg`,svgCleansed);

      // const $$ = cheerio.load(chartHtml,{ xmlMode: true })
      // await writeFileAsync(`./chart-${i}-base.svg`,chartHtml);

      //let chartNode = $$('.highcharts-container > svg');
      // let chartNode = $$('.highcharts-a11y-proxy-container-before')
      //sibNode = chartNode.nextSibling();
      // console.log(chartNode.)
      //await writeFileAsync(`./chart-${i}.svg`,$$(sibNode).html());
      //await writeFileAsync(`./chart-${i}.svg`,$$(chartNode).html());

      //await writeFileAsync(`./chart-${i}.svg`,$(e).html());
        
        //let chartSvg = ""
        //console.log(i,e.name,e.attributes[1].value);

        //const chartSvgNodes = chartContainers.find('*');
        
        // chartSvg = $.html(e)
        //chartSvgNodes.each(async (ii, ee) => {
        //    chartSvg += $.html(ee)
        //});
        
        //await writeFileAsync(`./chart-${i}.svg`,chartSvg)

        //console.log(i, chartSvg);

        //console.log(i,e.childNodes.length);
        //console.log(i,e.childNodes[0].childNodes/length);

        //let sib = charts.siblings();
        //console.log("->", sib.length)
        //for(let j=0; j < sib.length; j++) {
        //    console.log("-->",j,sib[j].attributes);
        //}
        //for(let j=0; j < e.childNodes.length; j++) {
            // console.log("->",j,e.childNodes[j].attributes.length,e.childNodes[j].attributes);
            //if(e.childNodes[j].attributes != undefined) {
                //console.log("->",e.childNodes[j].attribs);
                //console.log("->",e.childNodes[j].attribs['id']);
                //console.log("-->",e.childNodes[j].html);
                //console.log("-->",e.childNodes[j]);
                //console.log("->",j,e.childNodes[j].attributes.length);
                //for(let k=0;k<e.childNodes[j].attributes.length;k++) {
                //    console.log("-->",j,e.childNodes[j].attributes[k].value);                    
                //}
            //}
            //else {
                //console.log(j,"undefined")
            //}
            //for(let k=0; k < e.childNodes[j].attributes.length; k++) {
            //    console.log("-->",j,e.childNodes[j].attributes[k].value);            
            //}
            //console.log("->",j,e.childNodes[j].attribs[]);
            // console.log("->",j,e.childNodes[j].type);
        //}        
    })
    //charts.each((i, e) => {
    //    console.log(i,$(e).children.length,$(e).name)
    //}
}

async function scrapeWebsite4() {
  let html = await readFileAsync("./website.html",{ encoding: 'utf8', flag: 'r' })    
  const $ = cheerio.load(html, { xmlMode: true });

  let chartContainers = $('.model-chart-wide');
  chartContainers.each(async (i, e) => {
    let chartHtml = $(e).html();
    const svgRegex = /<svg[\s\S]*?<\/svg>/;
    const svgMatch = chartHtml.match(svgRegex);
    const svgCleansed = svgMatch[0].
                          replaceAll("www.currentmarketvaluation.com","").
                          replaceAll('&amp;ZeroWidthSpace;','&#8203;')

    await writeFileAsync(`./chart-${i}-n.svg`,svgCleansed);

  })
}

async function scrapeWebsite5(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {timeout: 60000, waitUntil: 'domcontentloaded'});
  await sleep(16000);
  const htmlContent = await page.content();
  await browser.close();

  const $ = cheerio.load(htmlContent, { xmlMode: true });

  let chartContainers = $('.model-chart-wide');
  chartContainers.each(async (i, e) => {
    let chartHtml = $(e).html();
    const svgRegex = /<svg[\s\S]*?<\/svg>/;
    const svgMatch = chartHtml.match(svgRegex);
    const svgCleansed = svgMatch[0].
                          replaceAll("www.currentmarketvaluation.com","").
                          replaceAll('&amp;ZeroWidthSpace;','&#8203;')

    await writeFileAsync(`./chart-${i}-x.svg`,svgCleansed);
  })
}

async function scrapeWebsite6(tag,url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {timeout: 60000, waitUntil: 'domcontentloaded'});
  await sleep(16000);
  const htmlContent = await page.content();
  await browser.close();

  const $ = cheerio.load(htmlContent, { xmlMode: true });

  let chartContainers = $('.model-chart-wide');
  chartContainers.each(async (i, e) => {
    let chartHtml = $(e).html();
    const svgRegex = /<svg[\s\S]*?<\/svg>/;
    const svgMatch = chartHtml.match(svgRegex);
    const svgCleansed = svgMatch[0].
                          replaceAll("www.currentmarketvaluation.com","").
                          replaceAll('&amp;ZeroWidthSpace;','&#8203;')

    await writeFileAsync(`./${tag}-chart-${i}.svg`,svgCleansed);
  })
}

function buffettIndicator2() {
    console.log("buffetIndicator2")
    // scrapeWebsite5(CMV_SITE_URL);

    // scrapeWebsite6("BUFFET_INDICATOR",CMV_BUFFET_INDICATOR_SITE_URL);
    // scrapeWebsite6("PRICE_EARNINGS",CMV_PRICE_EARNINGS_SITE_URL);
    // scrapeWebsite6("10Y_INTEREST_RATES",CMV_10Y_INTEREST_RATES_SITE_URL);
    //scrapeWebsite6("SP500_MEAN_REVERSION",CMV_SP500_MEAN_REVERSION_SITE_URL);
    // -- scrapeWebsite6("YIELD_CURVE",CMV_YIELD_CURVE_SITE_URL);
    //scrapeWebsite6("MARGIN_DEBT",CMV_MARGIN_DEBT_SITE_URL);
    scrapeWebsite6("VIX_FEAR_INDEX",CMV_VIX_FEAR_INDEX_SITE_URL);
}

/*
const CMV_BUFFET_INDICATOR_SITE_URL = "https://www.currentmarketvaluation.com/models/buffett-indicator.php"
const CMV_PRICE_EARNINGS_SITE_URL = "https://www.currentmarketvaluation.com/models/price-earnings.php"
const CMV_10Y_INTEREST_RATES_SITE_URL = "https://www.currentmarketvaluation.com/models/10y-interest-rates.php"
const CMV_SP500_MEAN_REVERSION_SITE_URL = "https://www.currentmarketvaluation.com/models/s&p500-mean-reversion.php"
const CMV_YIELD_CURVE_SITE_URL = "https://www.currentmarketvaluation.com/models/yield-curve.php"
const CMV_STATE_COINCIDENCE_SITE_URL = "https://www.currentmarketvaluation.com/models/state-coincidence.php"
const CMV_MARGIN_DEBT_SITE_URL = "https://www.currentmarketvaluation.com/models/margin-debt.php"
const CMV_VIX_FEAR_INDEX_SITE_URL = "https://www.currentmarketvaluation.com/models/vix-fear-index.php"
*/


module.exports = {
    testExtractor,
    buffettIndicator,
    buffettIndicator2
}
