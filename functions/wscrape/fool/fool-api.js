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

const seriesTA = (ohlcSeries,values) => {
    return [...[...new Array(ohlcSeries.length - values.length)].map((d,i) => (ohlcSeries[i].close)), 
                ...values].map((e,i) => ({time: ohlcSeries[i].time, value: +e.toFixed(3)}))
}


const getDataImpl = async (
    exchange,
    symbol,
    precision,
    period
) => {
    const resource = `${API_HOST}/${API_HISTORICAL_PATH}/${exchange}:${symbol}?apikey=${API_KEY}&precision=${precision}&timeFrame=${period}`;
    try {
        const { data } = await axios.get(resource,{ headers: HEADERS});

        // Process and exclude ohlc close null data
        const ohlcSeries = data.ChartBars.reduce((arr,e) => {
            // Process and exclude ohlc close null data
            if(e.Close !== null) {
                arr.push({
                    // time:  new Date(e.PricingDate).getTime(),
                    time:  e.PricingDate,
                    open:  (e.Open != null) ? +e.Open.Amount.toFixed(2) : +e.Close.Amount.toFixed(2),
                    high:  (e.High != null) ? +e.High.Amount.toFixed(2) : +e.Close.Amount.toFixed(2),
                    close: +e.Close.Amount.toFixed(2),
                    low:   (e.Low != null) ? +e.Low.Amount.toFixed(2): +e.Close.Amount.toFixed(2),
                })
            } return arr;
        }, []);

        // Process and exclude VWAP null data
        const vwapSeries = data.ChartBars.reduce((arr,e) => {
            if(e.VWAP !== null) { arr.push({time: e.PricingDate, value: +e.VWAP.toFixed(3)}); } 
            return arr;
        }, []);

        // Process Volume
        const volSeries = data.ChartBars.reduce((arr,e) => {
            if(e.Volume !== null) { 
                if((e.Open != null) && (e.Close != null)) {
                    let direction = 0;
                    // console.log("O",e.Open.Amount, "C",e.Close.Amount)                
                    if (e.Close.Amount > e.Open.Amount) {direction = 1;}       // 'Up Day' - Green volume bar
                    else if (e.Close.Amount < e.Open.Amount) {direction = -1;} //'Down Day' Red volume bar
                    else {direction = 0;}                        // Gray or no specific color
                    
                    arr.push({
                        time: e.PricingDate, 
                        value: +e.Volume.toFixed(0),
                        direction: direction
                    });
                }
            } 
            return arr;
        }, []);

        const closeValues = ohlcSeries.map((e) => e.close)

        // Calculate SMA
        const sma50 = SMA.calculate({period:50, values: closeValues})
        const sma100 = SMA.calculate({period:100, values: closeValues})
        const sma200 = SMA.calculate({period:200, values: closeValues})

        // Calculate EMA
        const ema10 = EMA.calculate({period:10, values: closeValues})

        return { 
            ohcl: ohlcSeries,
            vwap: vwapSeries,
            vol: volSeries,
            ta : [
                    { name: "sma-50",  series: seriesTA(ohlcSeries, sma50)  },
                    { name: "sma-100", series: seriesTA(ohlcSeries, sma100) },
                    { name: "sma-200", series: seriesTA(ohlcSeries, sma200) },
                    { name: "ema-10",  series: seriesTA(ohlcSeries, ema10)  },
            ]       
        }
    } catch (err) { return err; }
}

module.exports = {
    getTestImpl,
    getDataImpl
}

