const axios = require('axios')
const RVLT = require('./tfl-constants.js')

// https://www.revolut.com/crypto/price/btc/
//const RVLT_HOST = "https://www.revolut.com"
//const RVLT_PRICE_PATH = "/crypto/price/btc"
//https://www.revolut.com/api/crypto/explore/BTC/chart?fiatCurrency=GBP&interval=1d&range=max

// https://dn4cyp2h2s-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(5.4.3)%3B%20Search%20(5.4.3)%3B%20Browser&x-algolia-api-key=3e7d0e9632e27556a80166b54cc4b5ce&x-algolia-application-id=DN4CYP2H2S



const getSeries = async () => {
  // https://api.truflation.com/api/v1/feed/truflation/aggregate-data/cpi_uk_yoy
  try {
      const { data } = await axios.get("https://api.truflation.com/api/v1/feed/truflation/aggregate-data/cpi_uk_yoy")
      /*
      let dv = []
      for(let i = 0; i < data.Dates.length; i++) {
          dv.push({
              time: data.Dates[i].split('T')[0], 
              value: (data.Elements[0].ComponentSeries[data.Elements[0].ComponentSeries.length-1].Values[i])
          })
      }
      dataObj = { name: data.Elements[0].CompanyName, data:dv };
      */
      return data
  } catch(e) {
    console.log(e)
    return null
  }        
  return null
}

// https://api.truflation.com/api/v1/feed/truflation/aggregate-data/cpi_uk_yoy
const getSeries2 = async (datasetname) => {
    try {
        const { data } = await axios.get(`https://api.truflation.com/api/v1/feed/truflation/aggregate-data/${datasetname}`)
        return data
    } catch(e) {
      console.log(e)
      return null
    }        
    return null
  }
  
// https://api.truflation.com/api/v1/feed/truflation/aggregate-data/from_20200130_uk

const getCatalogue = async () => {
// https://dn4cyp2h2s-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(5.4.3)%3B%20Search%20(5.4.3)%3B%20Browser&x-algolia-api-key=3e7d0e9632e27556a80166b54cc4b5ce&x-algolia-application-id=DN4CYP2H2S
try {
        const { data } = await axios.get("https://dn4cyp2h2s-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(5.4.3)%3B%20Search%20(5.4.3)%3B%20Browser&x-algolia-api-key=3e7d0e9632e27556a80166b54cc4b5ce&x-algolia-application-id=DN4CYP2H2S")           
        return data
    } catch(e) {
      console.log(e)
      return null
    }        
    return null
  }
  
module.exports = {
    getCatalogue,
    getSeries,
    getSeries2
}
