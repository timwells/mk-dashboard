const axios = require('axios')

const LTT_HOST = "https://www.longtermtrends.net"

/*
https://www.longtermtrends.net/data-wilshire-gdp-ratio/
https://www.longtermtrends.net/data-equities-gdp-ratio/
https://www.longtermtrends.net/data-gdp/
https://www.longtermtrends.net/data-dow-gdp-ratio/
*/

const MOVING_AVERAGE_125 = 125
const MOVING_AVERAGE_200 = 200
const MOVING_AVERAGE_500 = 500
const MOVING_AVERAGE_1000 = 1000

function calMA(data, period) {
    const mAD = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            mAD.push([data[i][0], null ]);
        } else {
            let sum = 0;
            for (let j = i; j > i - period; j--) { 
                sum += data[j][1] 
            }
            const average = sum / period;
            mAD.push([data[i][0], parseFloat(average.toFixed(2))]);
        }
    }
    return mAD;
}

const longtermtrends = async (req,res) => {
    const datasetname = req.query.dataset;
    const url = `${LTT_HOST}/${datasetname}`
    const {data} = await axios.get(url)
    
    const rdata = data.map((e) => [
        new Date(Buffer.from(e[0],'base64').toString('ascii')).getTime(),
        parseFloat(Buffer.from(e[1],'base64').toString('ascii')).toFixed(3)]
    )
    const ma125 = calMA(rdata,MOVING_AVERAGE_125)
    const ma200 = calMA(rdata,MOVING_AVERAGE_200)
    const ma500 = calMA(rdata,MOVING_AVERAGE_500)
    const ma1000 = calMA(rdata,MOVING_AVERAGE_1000)

    let obj = {
        name: datasetname,
        data: rdata,
        ma125: ma125,
        ma200: ma200,
        ma500: ma500,
        ma1000: ma1000,
    }

    res.status(200).json(obj);
}
const test = async (req, res) => {
    res.status(200).send("longtermtrends");
}
module.exports = {
    test,
    longtermtrends,
}
