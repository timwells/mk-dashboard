const axios = require('axios');
const ONS = require('./ons-constants.js')
const moment = require('moment')


// //https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7bt/mm23/data
// seriesId = d7bt/mm23

// https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7bt/mm23/data

function toEoMIso(dateStr) {
    // Parse the input string (e.g., '1988 JAN')
    const parsedDate = moment(dateStr, 'YYYY MMM', true);  // 'true' for strict parsing
  
    // Check if the date is valid
    if (!parsedDate.isValid()) {
      return null;  // Return null or handle invalid dates as needed
    }
  
    // Get the last day of the month
    const endOfMonth = parsedDate.endOf('month');
  
    // Return the ISO formatted date (YYYY-MM-DD)
    return endOfMonth.format('YYYY-MM-DD');
  }

const getSeries = async (seriespath) => {
    let dataObj = {name:"?", data:[]}
    try {
        const { data } = await axios.get(`${ONS.HOST}/economy/${seriespath}`)

        if ('years' in data)  delete data.years;
        if ('quarters' in data)  delete data.quarters;
        if ('versions' in data)  delete data.versions;
        if ('relatedDocuments' in data)  delete data.relatedDocuments;
        if ('relatedData' in data)  delete data.relatedData;
        if ('sourceDatasets' in data)  delete data.sourceDatasets;
        if ('relatedDatasets' in data)  delete data.relatedDatasets;

        if ('months' in data) {            
            dataObj.name = data.description.title;
            dataObj.data = data.months.map((e) => {return {time: toEoMIso(e.date), value: parseFloat(e.value)}});
        }
        return dataObj 
    } catch(e) {
        console.log(e)
    }        
    return dataObj
}

module.exports = {
    getSeries,
}
