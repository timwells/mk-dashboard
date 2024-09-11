const axios = require('axios');
const cheerio = require('cheerio');

// https://www.nsandi.com/premium-bonds-have-i-won-ajax
const PB_SITE_HOST = "https://www.nsandi.com"
const PB_RESULTS_PATH = PB_SITE_HOST + "/premium-bonds-have-i-won-ajax"
const PB_NEXT_DRAW_DATE_PATH = PB_SITE_HOST + "/prize-checker"

async function lookUpResults(url,nh) {
  try {
    // Get form data
    const fD1 = new FormData();
    fD1.append('field_premium_bond_period', 'this_month');
    fD1.append('field_premium_bond_number', nh.holder);

    // Make a POST request using Axios
    const thisMonth = await axios.post(url, fD1);

    const fD2 = new FormData();
    fD2.append('field_premium_bond_period', 'last_six_month');
    fD2.append('field_premium_bond_number', nh.holder);

    // Make a POST request using Axios
    const lastSixMonth = await axios.post(url, fD2);
    let results = []
    thisMonth.data.history.forEach(e => { if(e.prize !== "0") results.push(e) });
    lastSixMonth.data.history.forEach(e => { if(e.prize !== "0") results.push(e) });

    return results
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
    return {error: error.message}    
  }
}

async function processResultsRequest(url,holders) {
  let aggregateResults = []
  try {
      let nhs = holders.split(",")
      for(let i = 0; i < nhs.length; i++) {
        let nhx = nhs[i].split(":")
        let nh = { name: nhx[0], holder: nhx[1] }
        let results = await lookUpResults(url,nh)
        let resultsSum = results.reduce((acc, cVal) => { return acc + parseInt(cVal.prize);}, 0);
        let holder = { 
          name: nh.name,
          holder: nh.holder, 
          sum: resultsSum, 
          results: results
        }
        aggregateResults.push(holder)
      }
      return aggregateResults
  }
  catch(error) {
    // Handle errors
    console.error('Error:', error.message);
    return {error: error.message}    
  }
}

const prizeResults = async (holders) => {
    let results = await processResultsRequest(PB_RESULTS_PATH,holders)
    return results;
}

const nextPrizeDraw = async (req, res) => {
  const { data } = await axios.get(PB_NEXT_DRAW_DATE_PATH);
  const $ = cheerio.load(data);

  const _nextPrizeDraw = $('#pc-container .pb-countdown-caption').text().replaceAll("\t","").replaceAll("\n","")
  return _nextPrizeDraw;
}

module.exports = {
    prizeResults,
    nextPrizeDraw,
}
