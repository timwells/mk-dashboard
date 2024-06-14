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
        return res.status(200).json(data)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

module.exports = {
    marketsentiment
}
