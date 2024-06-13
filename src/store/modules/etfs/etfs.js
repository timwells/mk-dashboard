import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"


const state = {
  etfs: null,  
  etfDetails: [],
}

const getters = {
  getEtfDetail: (state) => (sedol) => state.etfDetails.find((fd) => (fd.sedol === sedol)),
}


const mutations = {
    SET_ETFS: (state, payload) => (state.etfs = payload),
    SET_ETF_DETAILS: (state, payload) => state.etfDetails.push(payload),
};

const actions = {
  async getETFs({ commit }) {
    commit("SET_ETFS", null);
    const { data } = await axios.get(`./data/allETFs.json`)
    commit("SET_ETFS",  data)
  },

  async getEtfDetail({ commit }, { etf }) {
    const { data } = axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/hletf/testdetails2?etf=${etf}`, { headers: APP_FINTECH_HEADERS })
    commit(" SET_ETF_DETAILS", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}