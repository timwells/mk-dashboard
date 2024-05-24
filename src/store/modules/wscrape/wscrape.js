import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,

  genericGet
} from "../common/c.js"

const state = {
  fundDetails: [],

  dataroma: [],
  dataromaHoldingsMap: [],

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

  qqData:[],
};

const getters = {
  holdings: (state) => (key) => state.dataromaHoldingsMap.find((holding) => (holding.key === key)),
}


/*
const mutations = {
  updateItem(state, { index, item }) { Vue.set(state.items, index, item);},
  addItem(state, item) { state.items.push(item);},
  removeItem(state, index) { state.items.splice(index, 1);},
  replaceAllItems(state, newItems) { state.items = [...newItems];}
}
*/

const mutations = {
  SET_FUND_DETAILS: (state, payload) => state.fundDetails.push(payload),

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

  SET_QQ_MODELS: (state,payload) => (state.qqData = payload),
};

const actions = {
  async getFundDetail({ commit }, { fund }) {
    axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/hlfund/details?fund=${fund}`, { headers: APP_FINTECH_HEADERS })
      .then(response => { commit("SET_FUND_DETAILS", response.data) })
  },
  async getDataroma({ commit }) {
    await genericGet(`/fintech/v1/scrape/dataroma`,"SET_DATAROMA",[],{commit})
  },
  async getDataromaHoldings({ commit }, { q }) {
    axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/dataroma?q=${q}`,{ headers: APP_FINTECH_HEADERS })
        .then(response => { commit("SET_DATAROMA_HOLDINGS_MAP", { key: q, data: response.data }) })
  },
  async getBoEIRates({ commit }) {
    await genericGet(`/fintech/v1/scrape/boe`,"SET_BOE_IRATES",[],{ commit })
  },
  async getCmvBuffettIndicatorModels({ commit }) { 
    await genericGet(`/fintech/v1/scrape/cmv/buffettindicators`,"SET_CMV_BUFFETT_INDICATOR_MODELS",[],{ commit })
  },
  async getCmvPriceEarningsModels({ commit }) { 
    await genericGet(`/fintech/v1/scrape/cmv/priceearnings`,"SET_CMV_PRICE_EARNINGS_MODELS",[],{ commit})
  },
  async getCmvVixModels({ commit }) {
    await genericGet(`/fintech/v1/scrape/cmv/vix`,"SET_CMV_VIX_MODELS",[],{commit});
  },
  async getCmvSp500MeanReversionModels({ commit }) {
    await genericGet(`/fintech/v1/scrape/cmv/sp500meanreversion`,"SET_CMV_SP500_MEAN_REVERSION_MODELS",[],{commit})
  },
  async getCmv10yInterestRateModels({ commit }) {
    await genericGet(`/fintech/v1/scrape/cmv/y10interestrates`,"SET_CMV_10Y_INTEREST_RATE_MODELS",[],{commit})
  },
  async getCmvYieldCurveModels({ commit }) {
    await genericGet(`/fintech/v1/scrape/cmv/yieldcurve`,"SET_CMV_YIELD_CURVE_MODELS",[],{commit})
  },
  async getCnnSenitmentModels({ commit }) {
    await genericGet(`/fintech/v1/scrape/cnn/fearandgreedindicators`,"SET_CNN_SENTIMENT_MODELS",[],{ commit })
  },
  async getMmSmartDumbMoneyModels({ commit }) {
    await genericGet(`/fintech/v1/scrape/mm/smartdumbmoney`,"SET_MM_SMART_DUMB_MONEY_MODELS",[],{ commit })
  },
  async getDgnPriceModels({ commit },{epic}) {
    await genericGet(`/fintech/v1/scrape/digrin/price?epic=${epic}`,"SET_DGN_PRICE_MODELS",[],{commit})
  },
  async getQQData({ commit }) {
    await genericGet(`/fintech/v1/scrape/qq/fearandgreed`,"SET_QQ_MODELS",[],{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
