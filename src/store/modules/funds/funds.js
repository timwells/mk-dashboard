import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,

  genericGet
} from "../common/c.js"

const FILTER_ACCUMULATION = "Accumulation"

const state = {
  funds: null,
  details: null,
  fundDetails: [],
  indexData: []
}

const getters = {
  gfundDetail: (state) => (sedol) => state.fundDetails.find((fd) => (fd.sedol === sedol)),
}

const mutations = {
    SET_FUNDS: (state, payload) => (state.funds = payload),
    SET_INDEX_MODELS: (state,payload) => (state.indexData = payload),
    SET_FUND_DETAILS: (state, payload) => state.fundDetails.push(payload),
};

const actions = {
  getFunds({ commit }) {
    commit("SET_FUNDS", null);
    axios.get(`./data/allFunds3.json`)
      .then(response => {
        commit("SET_FUNDS", response.data)
          //(response.data
          //  .filter(f => ((f.type === FILTER_ACCUMULATION) && (f.netAC > 0)))
          //    .map((f,i) => { f.key = i; return f}))
          //      .sort((a,b) => a.netAC - b.netAC)                
      })
  },
  async getIndexData({ commit }) {
    await genericGet(`/fintech/v1/scrape/hlindex/indexes`,"SET_INDEX_MODELS",[],{ commit })
  },
  async getFundDetail({ commit }, { fund }) {
    axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/hlfund/details?fund=${fund}`, { headers: APP_FINTECH_HEADERS })
      .then(response => { 
        console.log(response.data)  
        commit("SET_FUND_DETAILS", response.data)  
      })
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
