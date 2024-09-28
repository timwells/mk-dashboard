// https://www.gold.co.uk/charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces
const axios = require('axios');
const PM = require('./pm-constants.js');
const SMA = require('technicalindicators').SMA
const EMA = require('technicalindicators').EMA

/*
[
    {
        "is_cms_locked": 0,
        "d": "1990-04-02",
        "v": [
            127.65,
            78.55,
            0
        ]
    },
    {
        "is_cms_locked": 0,
        "d": "1990-04-03",
        "v": [
            128.5,
            78.75,
            0
        ]
    },

   {
        "is_cms_locked": 0,
        "d": "2024-09-26",
        "v": [
            1052,
            787.72,
            944.34
        ]
    },
    {
        "is_cms_locked": 0,
        "d": "2024-09-27",
        "v": [
            1031,
            767.97,
            920.95
        ]
    }    
*/
/*
const seriesTA = (ohlcSeries,values) => {
    return [...[...new Array(ohlcSeries.length - values.length)].map((d,i) => (ohlcSeries[i].close)), 
                ...values].map((e,i) => ({time: ohlcSeries[i].time, value: +e.toFixed(3)}))
}
*/

const transformSeries = (data) => {
    let dv = []
    for(let i = 0; i < data.length; i++) {
        dv.push({
            time: data[i].d, 
            value: data[i].v[1]
        })
    }
    return dv
}

const gold = async () => {
    let dataObj = {name: 'gold', data:[]}
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_GOLD_SERIES_PATH}`)
        dataObj.data = transformSeries(data)
        return dataObj

    } catch(e) {
        console.log(e)
    }
    return dataObj
}

const silver = async () => {
    let dataObj = {name: 'silver', data:[]}
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_SILVER_SERIES_PATH}`)
        dataObj.data = transformSeries(data)
        return dataObj
    } catch(e) {
        console.log(e)
    }
    return dataObj
}

const platinum = async () => {
    let dataObj = {name: 'platinum', data:[]}
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_PLATINUM_SERIES_PATH}`)
        dataObj.data = transformSeries(data)
        return dataObj
    } catch(e) {
        console.log(e)
    }
    return dataObj
}

const palladium = async () => {
    let dataObj = {name: 'palladium', data:[]}
    try {
        const {data} = await axios.get(`${PM.LBMA_HOST}${PM.LBMA_PALLADIUM_SERIES_PATH}`)
        dataObj.data = transformSeries(data)
        return dataObj
    } catch(e) {
        console.log(e)
    }
    return dataObj
}

module.exports = {
    gold,
    silver,
    platinum,
    palladium
}
