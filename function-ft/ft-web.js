const axios = require('axios');
const cheerio = require('cheerio');
const FT = require('./ft-constants.js');

const findSymbolId = async (ticker) => {
    const resource = `${FT.HOST}${FT.TEAR_SHEET_PATH}?s=${ticker}`
    try {
        console.log(resource)
        const {data} = await axios.get(resource)
        const $ = cheerio.load(data)
        const dataModConfig = $('section .mod-tearsheet-add-to-watchlist').attr('data-mod-config')

        let symObj = {}
        if(dataModConfig) {
            dObj = JSON.parse(dataModConfig)
            symObj.xid = dObj.xid
            symObj.symbol = dObj.symbol
        } else {
            symObj = null
        }
        return symObj
    }
    catch (e) {
        console.log(e)
    }
    return null
}

module.exports = {
    findSymbolId
}
