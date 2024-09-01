const axios = require('axios');
const API_HOST = "https://api.fool.com"
const API_HISTORICAL_PATH = "quotes/v4/historical/charts"
const API_KEY = "fbe12de9-f56d-4d21-a955-daa0e7077bc4"
const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.fool.co.uk/"
}

// https://api.fool.com/quotes/v4/historical/charts/LSE:WTB?apiKey=fbe12de9-f56d-4d21-a955-daa0e7077bc4&timeFrame=Max
const getTestImpl = async () => {
    return {"name": "getTestImpl"}
}
/*
{
    "PricingDate": "1992-04-02",
    "PricingTime": null,
    "Open": null,
    "Close": {
        "Amount": 988.1374,
        "Currency": 4,
        "CurrencyCode": "GBX"
    },
    "High": null,
    "Low": null,
    "Change": -1.228772000000001,
    "PercentChange": -11.059908663666535,
    "Volume": null,
    "VWAP": null,
    "AdjustmentFactor": 0.3906339265
},
{
    "PricingDate": "2011-04-04",
    "PricingTime": null,
    "Open": {
        "Amount": 1662,
        "Currency": 4,
        "CurrencyCode": "GBX"
    },
    "Close": {
        "Amount": 1671,
        "Currency": 4,
        "CurrencyCode": "GBX"
    },
    "High": {
        "Amount": 1679,
        "Currency": 4,
        "CurrencyCode": "GBX"
    },
    "Low": {
        "Amount": 1654,
        "Currency": 4,
        "CurrencyCode": "GBX"
    },
    "Change": 5.5998540000000006,
    "PercentChange": 50.40306401013992,
    "Volume": 340292,
    "VWAP": 16.6842,
    "AdjustmentFactor": 1
},
*/
const getDataImpl = async (exchange,symbol,period) => {
    const resource = `${API_HOST}/${API_HISTORICAL_PATH}/${exchange}:${symbol}?apikey=${API_KEY}&timeFrame=${period}`;
    try {
        const {data} = await axios.get(resource,{ headers: HEADERS});
        //format 
        const klinedata = data.ChartBars.map((e) => ({
            time:  new Date(e.PricingDate).getTime(),
            open:  e.Open == null ? null : +e.Open.Amount.toFixed(2),
            high:  e.High == null ? null : +e.High.Amount.toFixed(2),
            close: e.Close == null ? null : +e.Close.Amount.toFixed(2),
            low:   e.Close == null ? null : +e.Close.Amount.toFixed(2)
        }))

        return klinedata;
    } catch (err) {
        return err;
    }
}

module.exports = {
    getTestImpl,
    getDataImpl
}

/*
// const API_OBSERVATIONS_PATH = "fred/series/observations"
const observations = async (seriesId,frequency,units,scale) => {
    const resource = `${API_HOST}/${API_OBSERVATIONS_PATH}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&frequency=${frequency}&output_type=1&units=${units}`
    const {data} = await axios.get(resource);

    const jsonData = data.observations.reduce((array,el) => {
        if((el.value !== ".") && (new Date(el.date).getTime() > new Date("1990-01-01").getTime())) {
            array.push([new Date(el.date).getTime(), +((parseFloat(el.value))*scale).toFixed(2)])
        }
        return array;
    }, []);
    
    return { name: seriesId, src:"src", data: jsonData }
}
*/
