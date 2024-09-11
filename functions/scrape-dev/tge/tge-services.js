const c = require('../common/c');
const axios = require('axios')
const cheerio = require('cheerio');

const TGE_COMMODITIES_HOST = "https://www.theglobaleconomy.com"
const TGE_COMMODITIES_LIST = TGE_COMMODITIES_HOST + "/world/"

const COMMODITY_MAP = new Map()
COMMODITY_MAP.set("Energy",["oil","coal","gas",])
COMMODITY_MAP.set("Staples",["oil","coal","gas",])

async function getContent(url) {
    // const { data } = await c.getContent(TGE_COMMODITIES_LIST)
    try {
        const {data} = await axios.get(url)
        return await cheerio.load(data)
    } catch(e) {
        console.log("getCommodities",e.message)
    }
    return null
}

/*
 HoldingsTable.find('tr').each((i, row) => {
            let colsD = $(row).find('td');   
            
            
https://www.theglobaleconomy.com/graph_country.php?p=0&m=1&c=world&i=brent_oil_prices

*/
async function getCommodities() {
    let indicatorList = []
    const $ = await getContent(TGE_COMMODITIES_LIST)
    const indicators = $('#indicatorsList .indicatorRow')

    let iObj = {}
    indicators.each((i,row) => {
        let indicatorName = $(row).find('.indicatorsName').text().trimStart().trimEnd()
        let indicatorHref = $(row).find('a').attr('href')
        let indicatorsMeasure = $(row).find('.indicatorsMeasure').text().trimStart().trimEnd()
        let indicatorsLastValue = $(row).find('.indicatorsLastValue').text().trimStart().trimEnd()
        let indicatorsCoverage = $(row).find('.indicatorsCoverage').text().trimStart().trimEnd()
        
        iObj.name = indicatorName
        iObj.href = indicatorHref
        iObj.measure = indicatorsMeasure
        iObj.lastValue = indicatorsLastValue
        iObj.period = indicatorsCoverage

        let IndicatorHrefTokens = indicatorHref.split("/")
        let territory =  IndicatorHrefTokens[1]
        let indicator =  IndicatorHrefTokens[2]

        iObj.chartUrl = `${TGE_COMMODITIES_HOST}/graph_country.php?p=0&m=1&c=${territory}&i=${indicator}`

        indicatorList.push(iObj)
    })
    console.log(indicatorList)
}
    const {data} = await axios.get(LTT_WILTSHIRE_5000)
    console.log(data.length)

    //  base64Encoded = btoa(originalString);

    for(let i=0; i < data.length; i++) {
        console.log(atob(data[i][0]),atob(data[i][1]))
    }
}

module.exports = {
    getCommodities,
    
}
