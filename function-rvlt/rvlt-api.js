const axios = require('axios')
const RVLT = require('./rvlt-constants.js')

// https://www.revolut.com/crypto/price/btc/
//const RVLT_HOST = "https://www.revolut.com"
//const RVLT_PRICE_PATH = "/crypto/price/btc"
//https://www.revolut.com/api/crypto/explore/BTC/chart?fiatCurrency=GBP&interval=1d&range=max

const getSeries = async () => {
  
  try {
      const { data } = await axios.get(
        `${RVLT.HOST}${RVLT.SERIES_PRICE_PATH}/BTC/chart?fiatCurrency=GBP&interval=1d&range=max`,
         { headers: RVLT.HEADERS });

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
      return null
      console.log(e)
  }        
  return null
}

module.exports = {
    getSeries,
}
