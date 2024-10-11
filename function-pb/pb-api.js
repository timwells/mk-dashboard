const axios = require('axios');
const cheerio = require('cheerio');

// https://www.nsandi.com/premium-bonds-have-i-won-ajax
const PB_SITE_HOST = "https://www.nsandi.com"
const PB_RESULTS_PATH = PB_SITE_HOST + "/premium-bonds-have-i-won-ajax"
const PB_NEXT_DRAW_DATE_PATH = PB_SITE_HOST + "/prize-checker"
const PB_WINNERS_PATH = PB_SITE_HOST + "/prize-checker/winners"
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
    return await processResultsRequest(PB_RESULTS_PATH,holders)
}

const nextPrizeDrawDate = async (req, res) => {
  const { data } = await axios.get(PB_NEXT_DRAW_DATE_PATH);
  const $ = cheerio.load(data);

  return $('#pc-container .pb-countdown-caption').text().replaceAll("\t","").replaceAll("\n","")
}


/*
<tr>
  <td class="" data-sort='1,000,000'><span>&pound;</span>1,000,000<br /><span class="table-subtext hidden-l">535MK963637</small></td>
  <td class="hidden-s">535MK963637</td>
  <td class="" data-sort='50,000'><span>&pound;</span>50,000<br /><span class="table-subtext hidden-l">Derbyshire</small></td>
  <td class="hidden-s">Derbyshire</td>
  <td class="hidden-s"><span>&pound;</span>40,000</td>
  <td class="th-odd" data-sort='202303'>Mar-23<br />
    <span class="table-subtext hidden-l">Value: &pound;40,000</span>
  </td>
</tr>

Prize value	, Winning Bond, Holding,	Area,	      Bond Value,	Purchased
£1,000,000    535MK963637	  £50,000   Derbyshire	£40,000	    Mar-23


  0 £5,000131VB339496
>  1 131VB339496
>  2 £36,550Hampshire And Isle Of Wight
>  3 Hampshire And Isle Of Wight
>  4 £2,000
*/
function fmtDate(dateString) {
  if (dateString.length !== 6) {
      return "?"
  }

  // Extract the year (first 4 characters) and the month (last 2 characters)
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  return `${year}-${month}` 
}
const winners = async () => {
  const { data } = await axios.get(PB_WINNERS_PATH);  
  const $ = cheerio.load(data);
  const rows = $("#table-prizewinner tr")
  let winners = [];
  rows.each((i, e) => {
    if (i>0) {
      let winObj={}
      $(e).find("td").each((i, t) => {
        switch(i) {
          case 0: winObj.prize = parseInt($(t).attr('data-sort').replaceAll(",","")); break;
          case 1: winObj.bondNumber = $(t).text().trim(); break;
          case 2: winObj.holdings = parseInt($(t).attr('data-sort').replaceAll(",","")); break;
          case 3: winObj.area = $(t).text().trim(); break;
          case 5: winObj.purchaseDate = fmtDate($(t).attr('data-sort').trim()); break;
        }      
      })
      winners.push(winObj)
    }
  })
  return winners
}

const winProbability = async (holding) => {

    console.log(holding)
    const bondCost = 1; // Each bond costs £1
    const totalBonds = holding / bondCost;

    // General odds of winning any prize
    const generalOdds = 24000; // 1 in 24,000 for each £1 bond

    // Odds of winning £1 million (approximate)
    const millionPrizeOdds = 37000000000; // 1 in 37 billion

    // Calculate probabilities
    const probabilityAnyPrize = (totalBonds / generalOdds) / totalBonds; // Probability of winning any prize
    const probabilityMillionPrize = (totalBonds / millionPrizeOdds) / totalBonds; // Probability of winning £1 million

    // Probability of not winning any prize
    const probabilityNotWinningAnyPrize = 1 - probabilityAnyPrize;

    return {
        anyPrize: (probabilityAnyPrize * 100).toFixed(6) + '%',
        millionPrize: (probabilityMillionPrize * 100).toFixed(10) + '%',
        notWinningAnyPrize: (probabilityNotWinningAnyPrize * 100).toFixed(6) + '%',
    };
}


module.exports = {
    prizeResults,
    nextPrizeDrawDate,
    winners,
    winProbability
}
