import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  indicators: [],
  news: []
}

const getters = {
}

const mutations = {
    SET_INDICATORS: (state, payload) => (state.indicators = payload),
    SET_NEWS: (state, payload) => (state.news = payload),
}

const actions = {
  async getIndicators({ commit }) {
    commit("SET_INDICATORS", []);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/cyca/indicators`,{ headers: APP_FINTECH_HEADERS })
    commit("SET_INDICATORS", data)
  },
  async getNews({ commit }) {
    commit("SET_NEWS", []);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/cyca/news`,{ headers: APP_FINTECH_HEADERS })
    commit("SET_NEWS", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}