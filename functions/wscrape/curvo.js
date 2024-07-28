const axios = require('axios');

const CURVO_HOST = "https://curvo.eu"
const CURVO_ASSET_MAP =  CURVO_HOST + "/backtest/data/asset-map.json"

//const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
//const SECTOR_PERFORMANCE_RESOURCE = 'lse-cache/sector-peformance.json';
//const CONSTITUENT_PERFORMANCE_FOLDER = 'lse-cache/constituents/'
//const BROKER_RATINGS_FOLDER = 'lse-cache/broker-ratings/'
//const BROKER_RATINGS_STATS_FOLDER = 'lse-cache/broker-ratings/stats/'

const assetmap = async (req, res) => {
    try {
        const { data } = await axios.get(CURVO_ASSET_MAP);
        return res.status(200).json(data)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

const assetmap2 = async (req, res) => {
    try {
        const { data } = await axios.get(CURVO_ASSET_MAP);
        let d2 = []
        for (const [key, value] of Object.entries(data)) {
            d2.push({"name" : key.split("/")[2].replace(".json",""), data: key})
        }
        return res.status(200).json(d2)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

/*
        [1486684800000, 34], 
        [1486771200000, 43], 
        [1486857600000, 31] , 
        [1486944000000, 43], 
        [1487030400000, 33], 
        [1487116800000, 52]
*/
const asset = async (req, res) => {
    try {
        let resource = `${CURVO_HOST}/backtest/data/${req.query.dataset}.json`
        const { data } = await axios.get(resource);
        const dataset = {
            name:req.query.dataset,
            data: data.map((o) => {return [(new Date(o.date).getTime()), +(o.value).toFixed(2)]})
        }
        return res.status(200).json(dataset)
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

const test = async (req, res) => {
    console.log("Curvo-assetmap")
    
    try {
        return res.status(200).send("OK")
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}


// /data/ftse-100.json
module.exports = {
    test,
    assetmap,
    asset,
    assetmap2,
}
