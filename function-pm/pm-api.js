// https://www.gold.co.uk/charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces
const axios = require('axios');
const PM = require('./pm-constants.js')
const cModule = require('./common/c.js')

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


        return data.data
    } catch(e) {
        console.log(e)
    }
    return []

}
const gold = async () => {
    try {
        // const { data } = await axios.get(`${PM.HOST}/${PM.SERIES_PATH}`, { headers: PM.HEADERS});
        const response = await fetch("https://www.gold.co.uk/charts/data/142a2310618bd/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces", {
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "en-GB,en;q=0.7",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Brave\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-requested-with": "XMLHttpRequest",
              "cookie": "cookie_banner_shown=True; csrftoken=Emgz9ovNDUWAHCok96yQWfkS35HUb6gd; hid=61a39bda-a261-42c1-b210-91646d5e04fb; gold=rgvkjwy19vit6xwu96aypooz043m2swt; __cf_bm=PD8gLk8N3tMHg.gTiAzSLVpsN_jMjOSUQfNznEnXs.A-1727276431-1.0.1.1-RlCs7SLqeuvaW8OMbdOmSXeRLU9eN_zK2XHYKYNlZVGbXzeD8tjEXDOG6KjuAjNlAKeRRtBcglVqXRkJlJMFIw; cf_clearance=Ws4jhJk.D0LdHSTsbP9riP_hOKZmGwy2ywVl4OsQrTc-1727276431-1.2.1.1-1GqFekI0iQ.hqJfJMlUjiBItF9Fr4xRDbcYWO_UCV.mUAF75A45uS6qzoqNk3LUbp2zz5zmsuAXg7xNte15LOqbf251FJuXi1lnx4UUgCEbo_O1xR.SGst92IyxSgNTgqe3re7YRT7u6c.lw62dQ1sEpvQY1fYgsIygNMMTBcGKdt._Kf5jnaDhikBB5IzwgtN3jxZX8nMscYJjZ7ZTemTMvq35yYsijF_JUltTSWbCvOTrhYBPF_2DKNB0sLlZA5n_JqbTNcB8ExBbUJYMcZISbbZa2WgBj.A459UJmFN2kKvq7XqzKSXpoG_GbRARMD0gUa32r5AGG3sfToud5KEDMurauTkpGrzDcoMSMrYxQX_pYb9.35ZxGntz6lrPk",
              "Referer": "https://www.gold.co.uk/gold-price/3-year-gold-price/",
              "Referrer-Policy": "no-referrer-when-downgrade"
            },
            "body": null,
            "method": "GET"
          });
        console.log(response)
        return response
    } catch(e) {
        console.log(e)
    }
    return []
}

module.exports = {
    prices,
    gold
}
