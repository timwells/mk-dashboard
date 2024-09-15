import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    fundsStats: null,
    progress: 0,
    fundsCacheList: [],
    fundsList: [],
    fundDetails: [],
};

const getters = {
  fundsDetailFilter: (state) => (sedol) => state.fundDetails.find((f) => (f.data.sedol === sedol))
}

const mutations = {
    SET_FUNDS_STATS: (state, payload) => (state.fundsStats = payload),
    SET_PROGRESS_RESET: (state, payload) => (state.progress = payload),
    SET_PROGRESS_INC: (state, payload) => (state.progress = payload),
    SET_FUNDS_CACHE_LIST: (state, payload) => (state.fundsCacheList = payload),
    SET_FUNDS_LIST: (state, payload) => (state.fundsList = payload),    

    // SET_FUND_DETAILS: (state, payload) => (state.fundDetails.push(payload)),

    ADD_FUND_DETAILS(state, payload) {
        state.fundDetails = [...state.fundDetails, payload];// Append to the array
        state.XfundDetails = payload;
    },

    /*
    UPDATE_FUND_DETAILS(state, updatedItem) {
        const index = state.fundDetails.findIndex(item => item.sedol === updatedItem.sedol);
        if (index !== -1) {
          // Update the specific object within the array
          Vue.set(state.fundDetails, index, updatedItem);
        }
    }
    */
};

const actions = {
  async getFundsStats({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/fundsstats`, 
                                        { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_STATS", data)
  },

  async refreshFunds({ commit }, {count}) {
    commit("SET_PROGRESS_RESET", 0)
    const totalFunds = count
    const REQ_PAGE_SIZE = 50
    let start = 0
    let rpp = REQ_PAGE_SIZE

    while(start < totalFunds) {
        rpp = ((start + REQ_PAGE_SIZE) < totalFunds) ? REQ_PAGE_SIZE : totalFunds - start;
        const resource = `${APP_CLOUD_FUNCTION_URL}/hl/fundspage?start=${start}&rpp=${rpp}`
        const { data } = await axios.get(resource,{headers: APP_FINTECH_HEADERS})
        start += rpp
        commit("SET_PROGRESS_INC",start)
    }
  },

  async listCacheFiles({commit}) {
    const {data} = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/listfundsobjs`, 
            { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_CACHE_LIST", data)
  },

  async getFunds({commit}) {
    console.log("getFunds:")
    const {data} = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/funds`, 
            { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_LIST", data)
  },

  async getFundDetails({commit},{companyid,sectorid,sedol}) {
    // console.log("getFundDetails:",searchTitle, sedol)
    const { data } = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/funddetails?companyid=${companyid}&sectorid=${sectorid}&sedol=${sedol}`, 
            { headers: APP_FINTECH_HEADERS })
    console.log(data)
    commit("ADD_FUND_DETAILS", data)
  }
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}