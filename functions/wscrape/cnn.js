const axios = require('axios');

const CNN_FEAR_AND_GREED = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
}

const marketsentiment = async (req, res) => {   
    try {
        const { data } = await axios.get(CNN_FEAR_AND_GREED, { headers: HEADERS});

        // Combine F&G date-time and values
        data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map(e => [e.x, e.y.toFixed(1)]);

        // Combine Vix date-time and values
        data.market_volatility_vix.data = data.market_volatility_vix.data.map(e => [e.x, e.y.toFixed(1)]);

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
