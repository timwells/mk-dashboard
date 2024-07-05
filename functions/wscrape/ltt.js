const axios = require('axios')

const LTT_HOST = "https://www.longtermtrends.net"
const LTT_WILTSHIRE_5000 = "https://www.longtermtrends.net/data-wilshire-5000/"

/*
https://www.longtermtrends.net/data-wilshire-gdp-ratio/
https://www.longtermtrends.net/data-equities-gdp-ratio/
https://www.longtermtrends.net/data-gdp/
https://www.longtermtrends.net/data-dow-gdp-ratio/
*/


const buffettindicator = async (req,res) => {
    const {data} = await axios.get(LTT_WILTSHIRE_5000)
    let cData = [];
    for(let i=0; i < data.length; i++) {
        cData.push([atob(data[i][0]),parseFloat(atob(data[i][1])).toFixed(3)])
    }
    res.status(200).json(cData);
}

const longtermtrends = async (req,res) => {
    const datasetname = req.query.dataset;
    const url = `${LTT_HOST}/${datasetname}`
    const {data} = await axios.get(url)
    let cData = data.map((e) => [atob(e[0]),parseFloat(atob(e[1]))])
    res.status(200).json(cData);
}
const test = async (req, res) => {
    res.status(200).send("longtermtrends");
}
module.exports = {
    test,
    buffettindicator,
    longtermtrends,
}
