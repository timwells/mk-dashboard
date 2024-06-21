const cheerio = require('cheerio');
const axios = require('axios')
const c = require('../common/c.js');
const LTIME = 2080
const HTIME = 8000
const LSE_SECTOR_PERFORMANCE = "https://www.lse.co.uk/share-prices/sectors/"
// "https://www.lse.co.uk/share-prices/sectors/"
const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',

    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Cache-Control' : 'max-age=0',
    'Accept-Language': 'en-GB,en;q=0.6',
    'Cookie':'PHPSESSID=fa99153dc486ec733353c6cbc5f002d4;session_key=e095a5fcd82b93d4e68c8fe756c283ca;ad_block=N',

    'Priority':'u=0, i',
    'Referer': 'https://www.lse.co.uk/share-prices/sectors/life-insurance/chat.html',

    'Sec-Ch-Ua':'"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform':'"Windows"',
    'Sec-Fetch-Dest':'document',
    'Sec-Fetch-Mode':'navigate',
    'Sec-Fetch-Site':'same-origin',
    'Sec-Fetch-User':'?1',
    'Sec-Gpc':'1',
    'Upgrade-Insecure-Requests':'1'
}

// Local functions
const sText = (text, maxLength) => (text.length > maxLength) ? (text.substring(0, maxLength - 3) + '...') : text;
async function getContent(url) {
    console.log(url)
    try {
        const { data } = await axios.get(url, { headers: HEADERS});

        console.log(data.statusCode)
        // console.log(data)
        const $ = await cheerio.load(data)
        return $
    }
    catch(e) {
        console.log("getContent:",e.message)
    }
    return null
}


async function listSectorPeformance() {
    c.initStopWatch()

    let browser = await c.getPuppetInstance()
    const page = await browser.newPage()
    c.watchTimeNow("launched",true)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');

    await page.goto(LSE_SECTOR_PERFORMANCE, { timeout: 60000, waitUntil: 'domcontentloaded'});
    c.watchTimeNow("goto",true)

    //await page.waitForSelector('#lsecouk_mobile_leaderboard > .sp-sectors__table > table > tbody');
    //c.watchTimeNow('waitForSelector',true)
    // await c.sleep(5000)

    const htmlContent = await page.content(); 
    await browser.close();

    let $ = cheerio.load(htmlContent);

    const tableRows = $('.sp-sectors__table > tbody > tr');

/*
<tr class="down">
    <td><a href="https://www.lse.co.uk/share-prices/sectors/aerospace/" 
        title="Aerospace Sector Value">Aerospace</a></td>
    <td class="hidden-xs">11,345.84</td>
    <td class="hidden-tiny">-162.82</td>
    <td>-1.41%</td>
</tr>
*/

/*
    tableRows.each((i,row) => {
        let c = $(row).find('td'); 
*/

    $(tableRows).each((i,row) => {
        let cols = $(row).find('td'); 
        cols.each((j,e) => {     
            switch(j) {
                case 0: {
                    console.log("Name.href",$(e).find('a').attr('href'))
                    console.log("Name.text",$(e).find('a').text())
                } break;
                case 1: {
                    console.log("Change (p)",$(e).text())
                } break;
                case 2: {
                    console.log("Change (%)",$(e).text())
                } break;
            }
        })
    })
}

async function listSectorPeformance2() {
    console.log("listSectorPeformance")
    const $ = await getContent(LSE_SECTOR_PERFORMANCE)

    // id = lsecouk_mobile_leaderboard
    // class: sp-sectors__table
/*
    let { data } = await axios.get(ETF_PROVIDERS_PATH)
    const $ = await cheerio.load(data)
    const tableRows = $('#companyid option');

*/
    const tableRows = $('#lsecouk_mobile_leaderboard .sp-sectors__table table tbody tr');

    console.log("tableRows Length",tableRows.length())
}

module.exports = {
    listSectorPeformance,
}
