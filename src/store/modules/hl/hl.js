import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    fundsStats: null,
    progress: 0,
    fundsCacheList: []
};

const getters = {}

const mutations = {
    SET_FUNDS_COUNT: (state, payload) => (state.fundsStats = payload),
    SET_PROGRESS_RESET: (state, payload) => (state.progress = payload),
    SET_PROGRESS_INC: (state, payload) => (state.progress = payload),
    SET_FUNDS_CACHE_LIST: (state, payload) => (state.fundsCacheList = payload),
};

const actions = {
  async getFundsCount({ commit }) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/fundscount`, { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_COUNT", data)
  },

  async refreshFunds({ commit }, {count}) {
    commit("SET_PROGRESS_RESET", 0)
    const totalFunds = count
    const REQ_PAGE_SIZE = 50
    // const nFullPages = Math.floor(totalFunds/PAGE_SIZE)
    // const nPartPage = Math.floor(totalFunds%PAGE_SIZE)
    // console.log("queryFunds:",totalFunds,nFullPages,nPartPage)

    let start = 0
    let rpp = REQ_PAGE_SIZE

    while(start < totalFunds) {
        rpp = ((start + REQ_PAGE_SIZE) < totalFunds) ? REQ_PAGE_SIZE : totalFunds - start;
        const resource = `${APP_CLOUD_FUNCTION_URL}/hl/fundspage?start=${start}&rpp=${rpp}`
        const { data } = await axios.get(resource,{headers: APP_FINTECH_HEADERS})
        // console.log(data)
        //if(data != null) {
        //    console.log(data.source,data.data.funds.length)
        //}
        start += rpp
        commit("SET_PROGRESS_INC",start)
    }
  },

  async listCacheFiles({commit}) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/listfundsobjs`, { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_CACHE_LIST", data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}