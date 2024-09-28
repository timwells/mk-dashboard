// https://www.gold.co.uk/charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces
const axios = require('axios');
const PM = require('./pm-constants.js');

const gold = async () => {
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_GOLD_SERIES_PATH}`)
        return data
    } catch(e) {
        console.log(e)
    }
    return []
}

const silver = async () => {
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_SILVER_SERIES_PATH}`)
        return data
    } catch(e) {
        console.log(e)
    }
    return []
}

const platinum = async () => {
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_PLATINUM_SERIES_PATH}`)
        return data
    } catch(e) {
        console.log(e)
    }
    return []
}

const palladium = async () => {
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_PALLADIUM_SERIES_PATH}`)
        return data
    } catch(e) {
        console.log(e)
    }
    return []
}

module.exports = {
    gold,
    silver,
    platinum,
    palladium
}
