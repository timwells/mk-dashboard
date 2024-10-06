import {
  genericGet
} from "../common/c.js"
import axios from "axios";
const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;
const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  dividendData: [],
};

const getters = {
}

const mutations = {
  SET_DIVIDEND_DATA: (state, payload) => (state.dividendData = payload),
};

const actions = {
  async getDividendData({ commit }) {
    commit("SET_DIVIDEND_DATA", [])
    const resource = `${CLOUD_FUNCTION_URL}/dd/exdividenddate`
    const {data} = await axios.get(resource, { headers: HEADERS })
    commit("SET_DIVIDEND_DATA", data)
  },
  async getDividendData2({ commit }) {
    console.log("-> getDividendData2")
    commit("SET_DIVIDEND_DATA", [])
    const resource = `${CLOUD_FUNCTION_URL}/dd/exdividenddate`
    console.log(resource)
    const {data} = await axios.get(resource, { headers: HEADERS })
    console.log(data)
    console.log("<- getDividendData2")
    commit("SET_DIVIDEND_DATA", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
