// https://www.gold.co.uk/charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces
const axios = require('axios');
const cheerio = require('cheerio');
const PM = require('./pm-constants.js');
const cModule = require('./common/c.js');

const USER_AGENT = "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"

// const PM_HOST = "https://www.gold.co.uk"
// const PM_SERIES_PATH = "charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces"
// const PM_PRICES_PATH = "ajax/update-header-metal-prices/142a2310618bd/"
// https://www.gold.co.uk/ajax/update-header-metal-prices/142a2310618bd/

async function getPageContent(
    url,
    timeout
) {
    const _pInstance = await cModule.getPuppetInstance();
    const page = await _pInstance.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});

    return await page.content();
}

const prices = async () => {
    try {
        // const { data } = await axios.get(`${PM.HOST}/${PM.PRICES_PATH}`, { headers: PM.HEADERS});
        const content = await getPageContent(`${PM.HOST}/${PM.PRICES_PATH}`)
        console.log(content)
        return ""
    } catch(e) {
        console.log(e)
    }
    return []
}

const gold = async () => {
    try {
        // const { data } = await axios.get(`${PM.HOST}/${PM.SERIES_PATH}`, { headers: PM.HEADERS});
        console.log(response)
        return []
    } catch(e) {
        console.log(e)
    }
    return []
}

module.exports = {
    prices,
    gold
}
