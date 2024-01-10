import axios from "axios";

const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;

//const CLOUD_EMULATION_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;
const CLOUD_EMULATION_FUNCTION_URL = process.env.VUE_APP_FIREBASE_EMULATION_FUNCTION_URL;

const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  nakedTrades: null,
  nakedArchives: [],

  dataroma: [],
  dataromaHoldingsMap: [],

  dividendData: [],
  boeIRates: [],

  cmvBuffettIndicatorModels: [],
  cmvPriceEarningsModels: [],
  cmvVixModels: [],
  cmvSp500MeanReversionModels: [],
  cmv10YInterestRatesModels: [],
  cmvYieldCurveModels: [],

  cnnSentimentModels:[],

  mmSmartDumbMoneyModels: [],

  dgnPriceModels: [],

  premiumBondsData: null

};

const getters = {
  holdings: (state) => (key) => state.dataromaHoldingsMap.find((holding) => (holding.key === key))
}

const mutations = {
  SET_NAKED_TRADES: (state, payload) => (state.nakedTrades = payload),
  SET_NAKED_ARCHIVES: (state, payload) => (state.nakedArchives = payload),
  SET_DIVIDEND_DATA: (state, payload) => (state.dividendData = payload),
  SET_DATAROMA: (state, payload) => (state.dataroma = payload),
  SET_DATAROMA_HOLDINGS_MAP: (state, payload) => (state.dataromaHoldingsMap.push(payload)),
  SET_BOE_IRATES: (state, payload) => (state.boeIRates = payload),
  SET_CMV_BUFFETT_INDICATOR_MODELS: (state, payload) => (state.cmvBuffettIndicatorModels = payload),
  SET_CMV_PRICE_EARNINGS_MODELS: (state, payload) => (state.cmvPriceEarningsModels = payload),
  SET_CMV_VIX_MODELS: (state, payload) => (state.cmvVixModels = payload),
  SET_CMV_SP500_MEAN_REVERSION_MODELS: (state, payload) => (state.cmvSp500MeanReversionModels = payload),
  SET_CMV_10Y_INTEREST_RATE_MODELS: (state, payload) => (state.cmv10YInterestRatesModels = payload),
  SET_CMV_YIELD_CURVE_MODELS: (state, payload) => (state.cmvYieldCurveModels = payload),

  SET_CNN_SENTIMENT_MODELS: (state, payload) => (state.cnnSentimentModels = payload),

  SET_MM_SMART_DUMB_MONEY_MODELS: (state, payload) => (state.mmSmartDumbMoneyModels = payload),

  SET_DGN_PRICE_MODELS: (state, payload) => (state.dgnPriceModels = payload),

  SET_PREMIUM_BONDS: (state, payload) => (state.premiumBondsData = payload),

};

const actions = {
  getNakedTrades({ commit }) {
    commit("SET_NAKED_TRADES", null);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/nt/trades4`,{ headers: HEADERS })
        .then(res => { /*console.log(res.data);*/ commit("SET_NAKED_TRADES", res.data) })
  },
  getNakedArchives({ commit }) {
    commit("SET_NAKED_ARCHIVES", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/nt/archives`,{ headers: HEADERS })
        .then(response => { commit("SET_NAKED_ARCHIVES", response.data) })
  },
  getDividendData({ commit }) {
    commit("SET_DIVIDEND_DATA", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/dividenddata/exdividenddate`,{ headers: HEADERS })
        .then(response => { commit("SET_DIVIDEND_DATA", response.data) })
  },
  getDataroma({ commit }) {
    commit("SET_DATAROMA", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/dataroma`,{ headers: HEADERS })
        .then(response => { commit("SET_DATAROMA", response.data) })
  },
  getDataromaHoldings({ commit }, { q }) {
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/dataroma?q=${q}`,{ headers: HEADERS })
        .then(response => { commit("SET_DATAROMA_HOLDINGS_MAP", { key: q, data: response.data }) })
  },
  getBoEIRates({ commit }) {
    commit("SET_BOE_IRATES", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/boe`,{ headers: HEADERS })
        .then(response => { commit("SET_BOE_IRATES", response.data) })
  },
  getCmvBuffettIndicatorModels({ commit }) {
    commit("SET_CMV_BUFFETT_INDICATOR_MODELS", []);
  axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cmv/buffettindicators`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_BUFFETT_INDICATOR_MODELS", response.data) })
  },
  getCmvPriceEarningsModels({ commit }) {
    commit("SET_CMV_PRICE_EARNINGS_MODELS", []);
  axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cmv/priceearnings`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_PRICE_EARNINGS_MODELS", response.data) })
  },
  getCmvVixModels({ commit }) {
    commit("SET_CMV_VIX_MODELS", []);
  axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cmv/vix`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_VIX_MODELS", response.data) })
  },
  getCmvSp500MeanReversionModels({ commit }) {
    commit("SET_CMV_SP500_MEAN_REVERSION_MODELS", []);
  axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cmv/sp500meanreversion`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_SP500_MEAN_REVERSION_MODELS", response.data) })
  },
  getCmv10yInterestRateModels({ commit }) {
    commit("SET_CMV_10Y_INTEREST_RATE_MODELS", []);
  axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cmv/y10interestrates`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_10Y_INTEREST_RATES_MODELS", response.data) })
  },
  getCmvYieldCurveModels({ commit }) {
    commit("SET_CMV_YIELD_CURVE_MODELS", []);
  axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cmv/yieldcurve`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_YIELD_CURVE_MODELS", response.data) })
  },
  getCnnSenitmentModels({ commit }) {
    commit("SET_CNN_SENTIMENT_MODELS", []);
    axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/cnn/fearandgreedindicators`,{ headers: HEADERS })
        .then(response => { commit("SET_CNN_SENTIMENT_MODLES", response.data) })
  },
  getMmSmartDumbMoneyModels({ commit }) {
    commit("SET_MM_SMART_DUMB_MONEY_MODELS", []);
    axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/mm/smartdumbmoney`,{ headers: HEADERS })
        .then(response => { commit("SET_MM_SMART_DUMB_MONEY_MODLES", response.data) })
  },
  getDgnPriceModels({ commit },{epic}) {
    commit("SET_DGN_PRICE_MODELS", []);
    axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/digrin/price?epic=${epic}`,{ headers: HEADERS })
        .then(response => { commit("SET_DGN_PRICE_MODELS", response.data) })
  },
  getPremiumBondsData({ commit }, { holder }) {
    commit("SET_PREMIUM_BONDS", []);
    axios.get(`${CLOUD_EMULATION_FUNCTION_URL}/fintech/v1/scrape/pb/results?holder=${holder}`,{ headers: HEADERS })
        .then(response => { commit("SET_PREMIUM_BONDS", response.data) })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
