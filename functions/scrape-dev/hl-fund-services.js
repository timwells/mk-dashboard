//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=1000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=2000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=3000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
//https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=4000&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc

const c = require('./common/c');
const cheerio = require('cheerio');

async function fundsQuery(url,qry,timeout) {
    c.initStopWatch()
    let browser = await c.getPuppetInstance()
    const page = await browser.newPage()
    c.watchTimeNow("launched",true)
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded'});
    c.watchTimeNow("goto",true)

    await page.waitForSelector(qry);
    c.watchTimeNow('waitForSelector',true)
    await c.sleep(timeout)

    const htmlContent = await page.content(); 
    await browser.close();

    return cheerio.load(htmlContent, { xmlMode: true });
}

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results
// ?start=0&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc
// https://www.hl.co.uk/funds

const HL_FUNDS = "https://www.hl.co.uk/funds"
const HL_SEARCH = "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results"

async function scanFunds() {
    //let $ = await fundsQuery(HL_FUNDS,"#fund-search-button-count",5000)    
    //let count = parseInt($("#fund-search-button-count").html())
    //console.log(count)


    /*
    for(let i = 0; i < count; i+=1000) {
        let q = `${HL_SEARCH}?start=${i}&rpp=1000&lo=0&sort=fd.full_description&sort_dir=asc`
        console.log(q)
    }
    */
    let i = 0;
    let page=3;
    let q = `${HL_SEARCH}?start=${i}&rpp=${page}&lo=0&sort=fd.full_description&sort_dir=asc`
    $ = await fundsQuery(q,".results__table",5000)
    const sel = '.results__table > tbody > tr';
    $(sel).each((i, e) => {         
        console.log(e.children.length);
        //let archive = { yearMonth: e.children[0].data, archives:[] }
        for(let a=0; a < e.children.length; a++) {
            console.log(e.children[a].children[0].data)
            // console.log(e.children[a].children[0].children.data)
        }
        // if(i>3) process.exit(1);
        //records.push(archive)
    })

}

async function serviceTest() {
    console.log("serviceTest")
}

module.exports = {
    serviceTest,
    scanFunds
}
