const axios = require('axios');
const cheerio = require('cheerio');

// https://www.nsandi.com/premium-bonds-have-i-won-ajax
const PB_SITE_HOST = "https://www.nsandi.com"
const PB_RESULTS = PB_SITE_HOST + "/premium-bonds-have-i-won-ajax"
const PB_NEXT_DRAW_DATE = PB_SITE_HOST + "/prize-checker"

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
    
    lastSixMonth.data.history.forEach(e => { if(e.prize !=="0") results.push(e) });

    return results
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
    return {error: error.message}    
  }
}

async function processResultsRequest(url,req) {
  let aggregateResults = []
  try {
      let holders = req.query.holders
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
        // console.log(holder)
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

async function processNextPrizeDrawDate(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $('#pc-container .pb-countdown-caption').text().replaceAll("\t","").replaceAll("\n","")
}

async function processRequestDebug(url,req,timeout) {
  let agregateResults = []
  console.log("processRequestDebug:",url)
  return agregateResults
}

const results = async (req, res) => {
    res.status(200).json(await processResultsRequest(`${PB_RESULTS}`,req,60000))
}

const results2 = async (req, res) => {
  let resObj = {}  
  resObj.results = await processResultsRequest(`${PB_RESULTS}`,req)
  resObj.nextDrawDate = await processNextPrizeDrawDate(`${PB_NEXT_DRAW_DATE}`)

  res.status(200).json(resObj)
}

const nextprizedraw = async (req, res) => {
  res.status(200).json(await processNextPrizeDrawDate(`${PB_NEXT_DRAW_DATE}`))
}
const test = async (req, res) => {
  res.status(200).send("Hello: nextPrizeDraw");
}

module.exports = {
    results,
    results2,

    nextprizedraw,
    test,
}
