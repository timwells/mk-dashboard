const axios = require('axios');
const SMA = require('technicalindicators').SMA

const CNN_FEAR_AND_GREED = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
}
/*
const MOVING_AVERAGE = 125
// Function to calculate 50-day moving average
function calculateMovingAverage(data, period) {
    const movingAverageData = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            // Not enough data points to calculate moving average
            movingAverageData.push([data[i][0], null ]);
        } else {
            let sum = 0;
            for (let j = i; j > i - period; j--) { 
                sum += data[j][1] 
            }
            const average = sum / period;
            movingAverageData.push([data[i][0], parseFloat(average.toFixed(2))]);
        }
    }
    return movingAverageData;
}
*/

const seriesTA = (series,values) => {
    return [...[...new Array(series.length - values.length)].map((d,i) => (series[i].close)), 
                ...values].map((e,i) => ({time: series[i].time, value: +e.toFixed(3)}))
}

const buildTASeries = (series, sma) => {
    let start = series.length - sma.length
    let end = series.length
    let smaTimeValue = []
    let j=0
    for(let i = start; i < end; i++, j++) { smaTimeValue.push([series[i].x,+sma[j].toFixed(2)])}
    return smaTimeValue
}
const marketSentiment = async () => {   
    try {
        let { data } = await axios.get(CNN_FEAR_AND_GREED, { headers: HEADERS });

        data.fear_and_greed.score = +data.fear_and_greed.score.toFixed(2)
        data.fear_and_greed.previous_close = +data.fear_and_greed.previous_close.toFixed(2)
        data.fear_and_greed.previous_1_week = +data.fear_and_greed.previous_1_week.toFixed(2)
        data.fear_and_greed.previous_1_month = +data.fear_and_greed.previous_1_month.toFixed(2)
        data.fear_and_greed.previous_1_year = +data.fear_and_greed.previous_1_year.toFixed(2)
               
        // Combine F&G date-time and values
        // data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map(e => [e.x, parseFloat(e.y.toFixed(1))]);
        data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map(e => [e.x, +e.y.toFixed(2)]);

        // Combine Vix date-time and values
        data.market_volatility_vix.data = data.market_volatility_vix.data.map(e => [e.x, +e.y.toFixed(2)]);

        // Calculate 200 day moving average
        const series = data.market_momentum_sp500.data.map(e => +e.y.toFixed(0));
        
        data.market_momentum_sp500_MA200 = { 
            data: buildTASeries(data.market_momentum_sp500.data, SMA.calculate({period: 200, values: series}))}            
        data.market_momentum_sp500_MA100 = 
            { data: buildTASeries(data.market_momentum_sp500.data, SMA.calculate({period: 100, values: series}))}            
        data.market_momentum_sp500_MA50 = 
            { data: buildTASeries(data.market_momentum_sp500.data, SMA.calculate({period: 50, values: series}))}            

        // Combine momentum_sp500 date-time and values
        data.market_momentum_sp500.data = data.market_momentum_sp500.data.map(e => [e.x, +e.y.toFixed(0)]);
 
 
        // Combine stock_price_strength date-time and values
        data.stock_price_strength.data = data.stock_price_strength.data.map(e => [e.x, +e.y.toFixed(2)]);

        delete data.market_momentum_sp125
        delete data.safe_haven_demand
        delete data.junk_bond_demand
        delete data.stock_price_breadth
        delete data.put_call_options
        delete data.market_volatility_vix_50

        return data
    } catch(e) {
        console.log(e.message)
    }
    return null
}
 

/*
const marketsentiment2 = async (req, res) => {   
    try {
        const { data } = await axios.get(CNN_FEAR_AND_GREED, { headers: HEADERS});

        
        //data: [
        //    [1327359600000,30.95],
        //    [1327446000000,31.34],
        
        // Combine F&G date-time and value
        data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map(e => [e.x, e.y]);
        return res.status(200).json(data)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}
*/

module.exports = {
    marketSentiment,
    // marketsentiment2
}
