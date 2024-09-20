const HOST = "https://www.hl.co.uk"
const FUNDS_SEARCH_PATH = "ajax/funds/fund-search/search"
const FUND_FACTSHEET_PATH ="funds/fund-discounts,-prices--and--factsheets/search-results"

const ETFS_SEARCH_PATH = "shares/exchange-traded-funds-etfs/list-of-etfs"

const FUNDS_CACHE_FOLDER = 'hl-cache';
const FUNDS_FOLDER = "funds";
const FUNDS_PAGES_FOLDER = "pages";
const FUNDS_DETIALS_FOLDER = "details";
const FUNDS_ANALYSIS_FOLDER = "analysis";
const FUNDS_SEDOLS_FOLDER = "sedols";
const FUNDS_CONSOLIDATED_FOLDER = "consolidated";

// FUNDS...
const FUNDS_CACHE_PATH =              "hl-cache/funds";
const FUNDS_CACHE_CONSOLIDATED_PATH = "hl-cache/funds/consolidated";
const FUNDS_CACHE_PAGES_PATH =        "hl-cache/funds/pages";
const FUNDS_CACHE_DETAILS_PATH =      "hl-cache/funds/details/sedols";
const FUNDS_CACHE_ANALYSIS_PATH =     "hl-cache/funds/analysis/sedols";

// ETFS...
const ETFS_CACHE_PATH =              "hl-cache/etfs";
const ETFS_CACHE_CONSOLIDATED_PATH = "hl-cache/etfs/consolidated";
const ETFS_CACHE_COMPANIES_PATH =    "hl-cache/etfs/companies";
const ETFS_CACHE_DETAILS_PATH =      "hl-cache/etfs/details/sedols";

const REQ_HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
    'referer': "https://www.hl.co.uk"
}

module.exports = {
    HOST, REQ_HEADERS,

    FUNDS_SEARCH_PATH,
    FUND_FACTSHEET_PATH,

    FUNDS_CACHE_PATH,
    FUNDS_CACHE_CONSOLIDATED_PATH,    
    FUNDS_CACHE_PAGES_PATH,    
    FUNDS_CACHE_DETAILS_PATH,
    FUNDS_CACHE_ANALYSIS_PATH,


    ETFS_SEARCH_PATH,
    ETFS_CACHE_PATH,
    ETFS_CACHE_CONSOLIDATED_PATH,
    ETFS_CACHE_COMPANIES_PATH,
    ETFS_CACHE_DETAILS_PATH
}
