const axios = require('axios');

const CNN_FEAR_AND_GREED = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
}

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

const marketsentiment = async (req, res) => {   
    try {
        let { data } = await axios.get(CNN_FEAR_AND_GREED, { headers: HEADERS });

        // Combine F&G date-time and values
        data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map(e => [e.x, parseFloat(e.y.toFixed(1))]);

        // Combine Vix date-time and values
        data.market_volatility_vix.data = data.market_volatility_vix.data.map(e => [e.x, parseFloat(e.y.toFixed(1))]);

        // Combine momentum_sp500 date-time and values
        data.market_momentum_sp500.data = data.market_momentum_sp500.data.map(e => [e.x, parseFloat(e.y.toFixed(1))]);

        // Calculate 50 day moving average
        data.market_momentum_sp500_MA125 = { data: calculateMovingAverage(data.market_momentum_sp500.data,MOVING_AVERAGE) }

        // Combine stock_price_strength date-time and values
        data.stock_price_strength.data = data.stock_price_strength.data.map(e => [e.x, parseFloat(e.y.toFixed(2))]);

        return res.status(200).json(data)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

const marketsentiment2 = async (req, res) => {   
    try {
        const { data } = await axios.get(CNN_FEAR_AND_GREED, { headers: HEADERS});

        /*
        data: [
            [1327359600000,30.95],
            [1327446000000,31.34],
        */
        // Combine F&G date-time and value
        data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map(e => [e.x, e.y]);
        return res.status(200).json(data)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

module.exports = {
    marketsentiment,
    marketsentiment2
}
