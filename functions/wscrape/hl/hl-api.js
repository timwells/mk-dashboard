const axios = require('axios');

const API_HOST = "https://www.hl.co.uk"
const API_FUNDS_PATH = "/ajax/funds/fund-search/search"
const API_FUNDS_QUERY = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=200&lo=0&sort=fd.full_description&sort_dir=asc&"
const API_FUNDS_QUERY2 = "investment=&companyid=&sectorid=&wealth=&unitTypePref=&tracker=&payment_frequency=&payment_type=&yield=&standard_ocf=&perf12m=&perf36m=&perf60m=&fund_size=&num_holdings=&start=0&rpp=200&lo=0&sort=fd.full_description&sort_dir=asc&"

const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.hl.co.uk"
}

// https://api.fool.com/quotes/v4/historical/charts/LSE:WTB?apiKey=fbe12de9-f56d-4d21-a955-daa0e7077bc4&timeFrame=Max
const testImpl = async () => {
    return {"name": "getTestImpl"}
}
const fundsListImpl = async () => {
    let offset = 0
    let funds = []
    const resource = `${API_HOST}${API_FUNDS_PATH}?${API_FUNDS_QUERY}`

    const {data} = await axios.get(resource,{ headers: HEADERS});
    return data
}

module.exports = {
    testImpl,
    fundsListImpl
}