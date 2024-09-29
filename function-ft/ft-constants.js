const HOST = "https://markets.ft.com"
const TEAR_SHEET_PATH = "/data/funds/tearsheet/charts"
const SERIES_PATH = "/data/chartapi/series"
const PAYLOAD_BODY = {
    "days": 3650,
    "dataNormalized": false,
    "dataPeriod": "Day",
    "dataInterval": 1,
    "realtime": false,
    "yFormat": "0.###",
    "timeServiceFormat": "JSON",
    "rulerIntradayStart": 26,
    "rulerIntradayStop": 3,
    "rulerInterdayStart": 10957,
    "rulerInterdayStop": 365,
    "returnDateType": "ISO8601",
    "elements": [
        {
            "Label": "c2aae3b9",
            "Type": "price",
            "Symbol": "543012729",
            "OverlayIndicators": [],
            "Params": {}
        },
    ]
}

module.exports = {
    HOST,
    TEAR_SHEET_PATH,
    SERIES_PATH,
    PAYLOAD_BODY,
}
