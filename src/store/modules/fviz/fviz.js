import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
} from "../common/c.js"

const state = {
  news:[],
  industryforwardpe:[],
}

const getters = {
  // gConstituents: (state) => (tag) => state.constituentsPerformance.find((e) => (e.tag === tag)),
  // gConstituentDetails: (state) => (epic) => state.constituentsDetails.find((e) => (e.epic === epic)),
  // gBrokerRatings: (state) => (epic) => state.brokerRatings.find((e) => (e.tag === epic)) 
}

const mutations = {
    SET_NEWS: (state, payload) => (state.news = payload),
    SET_INDUSTRY_FORWARD_PE: (state, payload) => (state.industryforwardpe = payload),
};
const actions = {
  async getNews({ commit },{ live }) {
    commit("SET_NEWS", []);
    const {data} = await 
        axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fviz/news?live=${live}`, { headers: APP_FINTECH_HEADERS })
    commit("SET_NEWS", data)
  },
  async getIndustryForwardPE({ commit },{ live }) {
    commit("SET_INDUSTRY_FORWARD_PE", []);
    const {data} = await 
      axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fviz/industryforwardpe?live=${live}`, { headers: APP_FINTECH_HEADERS })
    commit("SET_INDUSTRY_FORWARD_PE", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}