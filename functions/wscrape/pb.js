const axios = require('axios');

// https://www.nsandi.com/premium-bonds-have-i-won-ajax
const PB_SITE_HOST = "https://www.nsandi.com"
const PB_RESULTS = PB_SITE_HOST + "/premium-bonds-have-i-won-ajax"

async function processRequest(url,req,timeout) {
    try {
        let holder = req.query.holder

        // Get form data
        const fD1 = new FormData();
        fD1.append('field_premium_bond_period', 'this_month');
        fD1.append('field_premium_bond_number', holder);
  
        // Make a POST request using Axios
        const thisMonth = await axios.post(url, fD1);

        const fD2 = new FormData();
        fD2.append('field_premium_bond_period', 'last_six_month');
        fD2.append('field_premium_bond_number', holder);

        // Make a POST request using Axios
        const lastSixMonth = await axios.post(url, fD2);
  
        // Handle the response
        return {
            thisMonth:thisMonth.data,
            lastSixMonth: lastSixMonth.data
        }
      } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
        return {error: error.message}    
      }
}

const results = async (req, res) => {
    // let holder = req.query.
    res.status(200).json(await processRequest(`${PB_RESULTS}`,req,60000))
}

module.exports = {
    results,
}
