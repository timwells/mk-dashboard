import {
  genericGet
} from "../common/c.js"

import axios from "axios";
const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;
const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  dividendData: [],
  dividendHistory: []
};

const getters = {
  getDividendHistoryById: (state) => (id) => {
    return state.dividendHistory.find(item => item.id === id).data;
  }
}

const mutations = {
  SET_DIVIDEND_DATA: (state, payload) => (state.dividendData = payload),
  SET_DIVIDEND_HISTORY: (state, payload) => (state.dividendHistory = [...state.dividendHistory, payload]),
};

const actions = {
  async getDividendData({ commit }) {
    commit("SET_DIVIDEND_DATA", [])
    const resource = `${CLOUD_FUNCTION_URL}/dd/exdividenddates`
    const {data} = await axios.get(resource, { headers: HEADERS })
    commit("SET_DIVIDEND_DATA", data)
  },

  async getDividendHistory({ commit },{ divlink }) {

    // check dividendHistory does not contain divlink
    const exists = state.dividendHistory.findIndex(item => item.id === divlink) !== -1;
    if (exists) return;

    const resource = `${CLOUD_FUNCTION_URL}/dd/dividend-history?divlink=${divlink}`
    const {data} = await axios.get(resource, { headers: HEADERS })
    commit("SET_DIVIDEND_HISTORY", data )
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
