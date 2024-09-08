const axios = require('axios');
const cModule = require('../common/c.js');
const API_HOST = "https://www.hl.co.uk"
const API_FUNDS_PATH = "ajax/funds/fund-search/search"
const API_FUNDS_QUERY = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=200&lo=0&sort=fd.full_description&sort_dir=asc&"
const API_FUNDS_QUERY2 = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&lo=0&sort=fd.full_description&sort_dir=asc&"

const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.hl.co.uk"
}
const DownloadResource = async (resource) => {
    try {
        const {data} = await axios.get(resource,{ headers: HEADERS});
        return data
    } catch(e) {
        console.log(e)
        return null
    }
}
// https://api.fool.com/quotes/v4/historical/charts/LSE:WTB?apiKey=fbe12de9-f56d-4d21-a955-daa0e7077bc4&timeFrame=Max
const testImpl = async () => { return {"name": "getTestImpl"} }

const PAGE_SIZE = 60
const TOTAL_FUNDS = 60
const fundsListImpl = async () => {
    let funds = [];
    let start = 0
    let rpp = PAGE_SIZE

    try {
        // Query Number of Funds
        let resource = `${API_HOST}/${API_FUNDS_PATH}?start=${start}&rpp=1`
        let totalFunds = (await DownloadResource(resource)).TotalResults

        // totalFunds = TOTAL_FUNDS
        // Query Funds in 'rpp' page sizes
        while(start < totalFunds) {
            rpp = ((start + PAGE_SIZE) < totalFunds) ? PAGE_SIZE : totalFunds - start;
            resource = `${API_HOST}/${API_FUNDS_PATH}?start=${start}&rpp=${rpp}`
            console.log(resource)
            let data = await DownloadResource(resource)
            if(data != null) {
                console.log(data.Results.length)
                funds.push(...data.Results);
            }
            // console.log(resource)
            start += rpp

            await cModule.sleep(900)
        }
        // console.log("Finished...")
    } catch(e) {
        console.log(e)
    }

    return funds
}
const fundsCountImpl = async () => {
    let start = 0
    try {
        // Query Number of Funds
        let resource = `${API_HOST}/${API_FUNDS_PATH}?start=${start}&rpp=1`
        let totalFunds = (await DownloadResource(resource)).TotalResults
        return {fundsCount : totalFunds}
    } catch(e) {
        console.log(e)
        return {fundsCount : 0}
    }
}
const fundsPageImpl = async (start,rpp) => {
    try {
        // Query Number of Funds
        let resource = `${API_HOST}/${API_FUNDS_PATH}?start=${start}&rpp=${rpp}&sort_dir=asc`
        console.log("fundsPageImpl:",resource)
        return {funds : (await DownloadResource(resource)).Results}
    } catch(e) {
        console.log(e)
        return {funds : []}
    }
}

//https://www.hl.co.uk/ajax/funds/fund-search/search?investment=&companyid=1174&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&lo=0&sort=fd.full_description&sort_dir=asc&

module.exports = {
    testImpl,
    fundsListImpl,
    fundsCountImpl,
    fundsPageImpl
}