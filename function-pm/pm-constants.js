const HOST = "https://www.gold.co.uk"
const SERIES_PATH = "charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces"
const PRICES_PATH = "ajax/update-header-metal-prices/142a2310618bd/"

const REQ_HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.gold.co.uk"
}

module.exports = {
    HOST, 
    REQ_HEADERS,
    SERIES_PATH,
    PRICES_PATH
}
