const axios = require('axios');
const FT_HOST = "https://markets.ft.com"
const FT_SERIES_PATH = "/data/chartapi/series"
const FT_PAYLOAD_BODY = {
    "days": 3650,
    "dataNormalized": false,
    "dataPeriod": "Day",
    "dataInterval": 1,
    "realtime": false,
    "yFormat": "0.###",
    "timeServiceFormat": "JSON",
    "rulerIntradayStart": 26,
    "rulerIntradayStop": 3,
    "rulerInterdayStart": 10957,
    "rulerInterdayStop": 365,
    "returnDateType": "ISO8601",
    "elements": [
        {
            "Label": "c2aae3b9",
            "Type": "price",
            "Symbol": "543012729",
            "OverlayIndicators": [],
            "Params": {}
        },
    ]
}
const FT_MY_MAPX_FUND_SYMBOLS = [
    {name: "MyMap 3 Fund D Acc", symbol: "543012729", scale: 100.},
    {name: "MyMap 4 Fund D Acc", symbol: "542997798", scale: 100.0},
    {name: "MyMap 5 Select ESG Fund D Acc", symbol: "604977373", scale: 100.0},
    {name: "MyMap 6 Fund D Acc", symbol: "542990218", scale: 100.0},
    {name: "MyMap 7 Select ESG Fund D Acc", symbol: "722345773", scale: 100.0},
    {name: "Lindsell Train UK EqtyFund D Acc", symbol: "72625433", scale: 1.0}

]

// "https://markets.ft.com/data/chartapi/series"

/*
https://markets.ft.com/data/funds/tearsheet/summary?s=GB00BFBFYB71:GBP

{
    "days":3650,
    "dataNormalized":false,
    "dataPeriod":"Month",
    "dataInterval":1,
    "realtime":false,
    "yFormat":"0.###",
    "timeServiceFormat":"JSON",
    "rulerIntradayStart":26,
    "rulerIntradayStop":3,
    "rulerInterdayStart":10957,
    "rulerInterdayStop":365,
    "returnDateType":"ISO8601",
    "elements":[
        {
            "Label":"c2aae3b9",
            "Type":"price",
            "Symbol":"543012729",
            "OverlayIndicators":[],
            "Params":{}
        },
    ]
}

MyMap 6 Fund D GBP Acc
GB00BFBFZ140:GBP
{
    "days":3650,
    "dataNormalized":false,
    "dataPeriod":"Month",
    "dataInterval":1,
    "realtime":false,
    "yFormat":"0.###",
    "timeServiceFormat":"JSON",
    "rulerIntradayStart":26,
    "rulerIntradayStop":3,
    "rulerInterdayStart":10957,
    "rulerInterdayStop":365,
    "returnDateType":"ISO8601",
    "elements":[
        {
            "Label":"c8cf5782",
            "Type":"price",
            "Symbol":"542990218",
            "OverlayIndicators":[],"Params":{}
        }
    ]
}
*/

/*
{
    time: "2024-08-31",
    value 1.0
}
*/
const myMapFunds = async () => {
    let dataObj = []
    for(let fund = 0; fund < FT_MY_MAPX_FUND_SYMBOLS.length; fund++ ) {
        FT_PAYLOAD_BODY.elements[0].Symbol = FT_MY_MAPX_FUND_SYMBOLS[fund].symbol
        let scale = FT_MY_MAPX_FUND_SYMBOLS[fund].scale
        try {
            const { data } = await axios.post(`${FT_HOST}${FT_SERIES_PATH}`,FT_PAYLOAD_BODY)
            let dv = []
            for(let i=0; i < data.Dates.length; i++) {
                dv.push({
                    time: data.Dates[i].split('T')[0], 
                    value: scale * (data.Elements[0].ComponentSeries[data.Elements[0].ComponentSeries.length-1].Values[i])
                })
            }
            dataObj.push({name:data.Elements[0].CompanyName, data:dv })
        } catch(e) {
            console.log(e)
            return []
        }
    }
    return dataObj
}


module.exports = {
    myMapFunds
}
