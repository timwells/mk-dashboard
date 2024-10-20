const HOST = "https://www.revolut.com"
const SERIES_PRICE_PATH = "/crypto/price"
const HEADERS = {
    'accept': '*/*',
    'accept-encoding':'gzip, deflate, br, zstd',
    'accept-language': 'en',
    'cookie':'rev_cid=ca112bb7-3739-4bed-a17e-8a41fab448a2; rev_geo_country_code=GB; rev_cookie_consent={%22preferences%22:true%2C%22analytics%22:true%2C%22advertising%22:true}; rev_language=en; rev_careers_analytics={%22referrer%22:%22https://www.google.com/%22}; __cf_bm=S6sAfptsqh8Lw4IRin4557BmjugXTa0trqJaDtBgZz0-1728848928-1.0.1.1-53mEMnkw4I5EmfLw63Us1NyfLeCufpJ16Lk9mzN8A7YsQdbKQpjZbVjWv4_V1EcDFHE6AAiZSjbaNxGUB3jBEQ',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache'
}
module.exports = {
    HEADERS,
    HOST,
    SERIES_PRICE_PATH,
}
