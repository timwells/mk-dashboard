import axios from "axios";
import { getUserSecrets } from '@/firebase'

const CLOUD_EMULATION_FUNCTION_URL = process.env.VUE_APP_FIREBASE_EMULATION_FUNCTION_URL;

// const CLOUD_FUNCTION_URL = CLOUD_EMULATION_FUNCTION_URL
const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;

const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  mtplData: [],
  fundDetails: [],
  nakedTrades: null,
  nakedArchives: [],
  nakedArchiveContent: "",

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

  premiumBondsData: null,

  qqData:[],

  hlIndexData:[]
};

const getters = {
  holdings: (state) => (key) => state.dataromaHoldingsMap.find((holding) => (holding.key === key)),
  fundDetail: (state) => (sedol) => state.fundDetails.find((fd) => (fd.sedol === sedol)),
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
  SET_MTPL_DATA: (state, payload) => state.mtplData.push(payload),

  SET_FUND_DETAILS: (state, payload) => state.fundDetails.push(payload),

  SET_NAKED_TRADES: (state, payload) => (state.nakedTrades = payload),
  SET_NAKED_ARCHIVES: (state, payload) => (state.nakedArchives = payload),
  SET_NAKED_ARCHIVE_CONTENT: (state, payload) => (state.nakedArchiveContent = payload),
    
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

  SET_QQ_MODELS: (state,payload) => (state.qqData = payload),

  SET_HLINDEX_MODELS: (state,payload) => (state.hlIndexData = payload)
};

async function genericGet(subPath,service,init,{commit}) {
  let secrets = await getUserSecrets();
  commit(service, init);
  let response = await axios.get(`${secrets.fintech_host}${subPath}`,{ headers: { 'x-api-key' : secrets.fintech_apikey} })
  commit(service, response.data)
}

const actions = {
  async getMtplData({ commit },{ ds }) {

    // Look up
    console.log(state.mtplData.length)

    const index = state.mtplData.findIndex(obj => obj[ds] === ds);
    // return index >= 0 ? [ ...array.slice(0, index), ...array.slice(index + 1)] : array;
  
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/mtpl/dataset?ds=${ds}`, { headers: HEADERS })
      .then(response => { commit("SET_MTPL_DATA", response.data) })
  },
  async getFundDetail({ commit }, { fund }) {
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/hlfund/details?fund=${fund}`, { headers: HEADERS })
      .then(response => { commit("SET_FUND_DETAILS", response.data) })
  },

  async getNakedTrades({ commit }) {
    await genericGet(`/fintech/v1/scrape/nt/trades`,"SET_NAKED_TRADES",null,{commit})
  },
  async getNakedArchives({ commit }) {
    await genericGet(`/fintech/v1/scrape/nt/archives`,"SET_NAKED_ARCHIVES",[],{commit})
  },
  async getNakedArchiveContent({ commit },{ content }) {
    await genericGet(`/fintech/v1/scrape/nt/archiveContent?a=${content}`,"SET_NAKED_ARCHIVE_CONTENT","",{commit})
  },
  async getDividendData({ commit }) {
    await genericGet(`/fintech/v1/scrape/dividenddata/exdividenddate`,"SET_DIVIDEND_DATA",[],{commit})
  },
  async getDataroma({ commit }) {
    await genericGet(`/fintech/v1/scrape/dataroma`,"SET_DATAROMA",[],{commit})
  },
  async getDataromaHoldings({ commit }, { q }) {
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/dataroma?q=${q}`,{ headers: HEADERS })
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
  async getPremiumBondsHolders({ commit }, { holders }) {
    await genericGet(`/fintech/v1/scrape/pb/results?holders=${holders}`,"SET_PREMIUM_BONDS",[],{commit})
  },
  async getPremiumBondsData({ commit }, { holders }) {
    await genericGet(`/fintech/v1/scrape/pb/results2?holders=${holders}`,"SET_PREMIUM_BONDS",null,{commit})
  },
  async getQQData({ commit }) {
    await genericGet(`/fintech/v1/scrape/qq/fearandgreed`,"SET_QQ_MODELS",[],{commit})
  },
  async getHLIndexData({ commit }) {
    await genericGet(`/fintech/v1/scrape/hlindex/indexes`,"SET_HLINDEX_MODELS",[],{commit})
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
