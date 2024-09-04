const axios = require('axios');

// https://github.com/anandanand84/technicalindicators#readme
const SMA = require('technicalindicators').SMA
const EMA = require('technicalindicators').EMA

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
// https://api.fool.com/quotes/v4/historical/charts/342412?timeFrame=OneWeek&precision=Day&apikey=6cbf5f34-ba40-4108-a1ab-d951c608955e
const getTestImpl = async () => {
    return {"name": "getTestImpl"}
}
/*{
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
const getDataImpl = async (
    exchange,
    symbol,
    precision,
    period
) => {
    const resource = `${API_HOST}/${API_HISTORICAL_PATH}/${exchange}:${symbol}?apikey=${API_KEY}&precision=${precision}&timeFrame=${period}`;
    try {
        const { data } = await axios.get(resource,{ headers: HEADERS});
        // eliminate nulls by reducing and re-formatting as ohlc
        const ohlcSeries = data.ChartBars.reduce((arr,e) => {
            // Process none null data
            if(e.Open !== null && e.Close !== null) {
                arr.push({
                    // time:  new Date(e.PricingDate).getTime(),
                    time:  e.PricingDate,
                    open:  +e.Open.Amount.toFixed(2),
                    high:  +e.High.Amount.toFixed(2),
                    close: +e.Close.Amount.toFixed(2),
                    low:   +e.Low.Amount.toFixed(2)
                })
            }
            return arr;
        }, []);

        // Calculate SMA
        const sma = SMA.calculate({period:50, values: ohlcSeries.map((e) => e.close)})
        const pSma = [...[...new Array(ohlcSeries.length - sma.length)].map((d,i) => (ohlcSeries[i].close)), ...sma];
        const smaSeries = pSma.map((e,i) => ({time: ohlcSeries[i].time, value: e}))

        // Calculate EMA
        const ema = EMA.calculate({period:10, values: ohlcSeries.map((e) => e.close)})
        const pEma = [...[...new Array(ohlcSeries.length - ema.length)].map((d,i) => (ohlcSeries[i].close)), ...ema];
        const emaSeries = pEma.map((e,i) => ({time: ohlcSeries[i].time, value: e}))

        return { 
            ohcl: ohlcSeries, 
            sma: smaSeries,
            ema: emaSeries
        }
    } catch (err) {
        return err;
    }
}

module.exports = {
    getTestImpl,
    getDataImpl
}

