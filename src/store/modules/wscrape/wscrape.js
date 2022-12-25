import axios from "axios";

const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;
const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  nakedTrades: [],
  dataroma: [],
  dataromaHoldingsMap: [],
  dividendData: [],
  boeIRates: [],
  cmvModels: []
};

const getters = {
  holdings: (state) => (key) => state.dataromaHoldingsMap.find((holding) => (holding.key === key))
}

const mutations = {
  SET_NAKED_TRADES: (state, payload) => (state.nakedTrades = payload),
  SET_DIVIDEND_DATA: (state, payload) => (state.dividendData = payload),
  SET_DATAROMA: (state, payload) => (state.dataroma = payload),
  SET_DATAROMA_HOLDINGS_MAP: (state, payload) => (state.dataromaHoldingsMap.push(payload)),
  SET_BOE_IRATES: (state, payload) => (state.boeIRates = payload),
  SET_CMV_MODELS: (state, payload) => (state.cmvModels = payload),

};

const actions = {
  getNakedTrades({ commit }) {
    commit("SET_NAKED_TRADES", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/nt`,{ headers: HEADERS })
        .then(response => { commit("SET_NAKED_TRADES", response.data) })
  },
  getDividendData({ commit }) {
    commit("SET_DIVIDEND_DATA", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/dividenddata`,{ headers: HEADERS })
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
  getCmvModels({ commit }) {
    commit("SET_CMV_MODELS", []);
    axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/cmv`,{ headers: HEADERS })
        .then(response => { commit("SET_CMV_MODELS", response.data) })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
