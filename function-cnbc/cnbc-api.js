const axios = require('axios');
const SMA = require('technicalindicators').SMA
const API_HOST = "https://webql-redesign.cnbcfm.com"
const API_PATH = "graphql"

// https://webql-redesign.cnbcfm.com/graphql?operationName=getQuoteChartData&variables={"symbol":"UK10Y-GB","timeRange":"ALL"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"61b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d"}}
// ?operationName=getQuoteChartData&variables={"symbol":"UK10Y-GB","timeRange":"ALL"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"61b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d"}}
// https://webql-redesign.cnbcfm.com/graphql?operationName=getQuoteChartData&variables=%7B%22symbol%22%3A%22UK10Y-GB%22%2C%22timeRange%22%3A%225Y%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2261b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d%22%7D%7D

const getHistoricalValuesImpl = async (symbol,period) => {
    const hostPath = `${API_HOST}/${API_PATH}`
    const variables = `{"symbol":"${symbol}","timeRange":"${period}"}`
    const extensions = `{"persistedQuery":{"version":1,"sha256Hash":"61b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d"}}`
    const  resource = `${hostPath}?operationName=getQuoteChartData&variables=${variables}&extensions=${extensions}`

/*
{
    "open": "7.5390",
    "high": "8.8980",
    "low": "7.4950",
    "close": "8.6350",
    "volume": null,
    "tradeTime": "19940401000000",
    "tradeTimeinMills": "765176400000",
    "__typename": "priceBarType"
}
*/   
    try {
        const {data} = await axios.get(resource)
        const valueSeries = data.data.chartData.priceBars.reduce((arr,e) => {
            // Process and exclude ohlc close null data
            if(e.close !== null && e.tradeTime !== null) {
                arr.push({
                    time:  e.tradeTime.replace(/^(\d{4})(\d{2})(\d{2}).*$/, '$1-$2-$3'),
                    value: +parseFloat(e.close).toFixed(2),
                })
            } return arr;
        }, []);

        return {
            name: data.data.chartData.allSymbols[0].name,
            data: valueSeries 
        }
    } catch (err) {
        return {data: err}
    }
}

module.exports = {
    getHistoricalValuesImpl
}
