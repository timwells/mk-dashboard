const axios = require('axios');
const SMA = require('technicalindicators').SMA
const API_HOST = "https://webql-redesign.cnbcfm.com"
const API_PATH = "graphql"

// https://webql-redesign.cnbcfm.com/graphql?operationName=getQuoteChartData&variables={"symbol":"UK10Y-GB","timeRange":"ALL"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"61b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d"}}
// ?operationName=getQuoteChartData&variables={"symbol":"UK10Y-GB","timeRange":"ALL"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"61b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d"}}

//https://webql-redesign.cnbcfm.com/graphql?operationName=getQuoteChartData&variables=%7B%22symbol%22%3A%22UK10Y-GB%22%2C%22timeRange%22%3A%225Y%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2261b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d%22%7D%7D


const getHistoricalValuesImpl = async (symbol) => {
    const hostPath = `${API_HOST}/${API_PATH}`
    const variables = `{"symbol":"UK10Y-GB","timeRange":"ALL"}`
    const extensions = `{"persistedQuery":{"version":1,"sha256Hash":"61b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d"}}`
    let  resource = `${hostPath}?operationName=getQuoteChartData&variables=${variables}&extensions=${extensions}`

    // resource = `https://webql-redesign.cnbcfm.com/graphql?operationName=getQuoteChartData&variables=%7B%22symbol%22%3A%22UK10Y-GB%22%2C%22timeRange%22%3A%225Y%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2261b6376df0a948ce77f977c69531a4a8ed6788c5ebcdd5edd29dd878ce879c8d%22%7D%7D`

    try {
        const {data} = await axios.get(resource)
        
        return data.data.chartData
    } catch (err) {
        return {data: err}
    }
}


module.exports = {
    getHistoricalValuesImpl
}
