import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"


const state = {
  etfs: null,  
  etfsDetails: [],
}

const getters = {
  gEtfDetail: (state) => (sedol) => state.etfsDetails.find((fd) => (fd.sedol === sedol)),
  gEtfHoldingsSum: (state) => (sedol) => {
    let etf = state.etfsDetails.find((fd) => (fd.sedol === sedol))
    let sum = 0.0    
    for(let i = 0; i < etf.holdings.length; i++) {
      let wgt = parseFloat(etf.holdings[i].weight.replace("%",""))
      sum += wgt;
    }
    return +sum.toFixed(2);
  }
}


const mutations = {
    SET_ETFS: (state, payload) => (state.etfs = payload),
    SET_ETF_DETAILS: (state, payload) => state.etfsDetails.push(payload),
};

const actions = {
  async getETFs({ commit }) {
    commit("SET_ETFS", null);
    const { data } = await axios.get(`./data/allETFs.json`)
    commit("SET_ETFS",  data)
  },

  async getEtfDetail({ commit }, { sedol }) {  
    // Check if Cached
    if(state.etfsDetails.find((fd) => (fd.sedol === sedol)) === undefined) {
        const { data } = await 
          axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/hletf/testdetails2?etf=shares/shares-search-results/${sedol}`, 
                                    { headers: APP_FINTECH_HEADERS })
      commit("SET_ETF_DETAILS", data)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}