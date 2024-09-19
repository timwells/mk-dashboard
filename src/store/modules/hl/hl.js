import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    // Funds
    fundsStats: null,
    fundsRefreshProgress: 0,
    fundsRefreshComplete: true,
    fundsCacheList: [],
    fundsObj: null,
    fundDetails: [],
    fundAnalysis: [],

    // Etfs
    etfsStats: null,
    etfsCompanies: [],
    etfsRefreshProgress: 0,
    etfsRefreshComplete: true,
    etfsObj: null,
};

const getters = {
  fundsDetailFilter: (state) => (sedol) => state.fundDetails.find((f) => (f.data.sedol === sedol)),
  fundsAnalysisFilter: (state) => (sedol) => state.fundAnalysis.find((f) => (f.data.sedol === sedol))
}

const mutations = {
    SET_FUNDS_STATS: (state, payload) => (state.fundsStats = payload),
    SET_FUNDS_REFRESH_PROGRESS: (state, payload) => (state.fundsRefreshProgress = payload),
    SET_FUNDS_REFRESH_COMPLETE: (state, payload) => (state.fundsRefreshComplete = payload),

    SET_FUNDS_CACHE_LIST: (state, payload) => (state.fundsCacheList = payload),
    SET_FUNDS_OBJ: (state, payload) => (state.fundsObj = payload),    

    SET_FUND_DETAILS: (state, payload) => (state.fundDetails = payload),
    ADD_FUND_DETAILS: (state, payload) => (state.fundDetails = [...state.fundDetails, payload]),
    
    SET_FUND_ANALYSIS: (state, payload) => (state.fundDetails = payload),
    ADD_FUND_ANALYSIS: (state, payload) => (state.fundAnalysis = [...state.fundAnalysis, payload]),

    SET_ETFS_STATS: (state, payload) => (state.etfsStats = payload),
    SET_ETFS_COMPANIES: (state, payload) => (state.etfsCompanies = payload),
    SET_ETFS_REFRESH_PROGRESS: (state, payload) => (state.etfsRefreshProgress = payload),
    SET_ETFS_REFRESH_COMPLETE: (state, payload) => (state.etfsRefreshComplete = payload),
    SET_ETFS_OBJ: (state, payload) => (state.etfsObj = payload),    

  };

const actions = {
  async getFundsStats({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/funds/stats`, 
                                        { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_STATS", data)
  },

  async refreshFunds({ commit }, {count}) {
    commit("SET_FUNDS_REFRESH_PROGRESS", 0)
    commit("SET_FUNDS_REFRESH_COMPLETE", false)
    commit("SET_FUND_DETAILS", [])
    commit("SET_FUND_ANALYSIS", [])
    commit("SET_FUNDS_OBJ", null)

    const totalFunds = count
    const REQ_PAGE_SIZE = 50
    let start = 0
    let rpp = REQ_PAGE_SIZE

    while(start < totalFunds) {
        rpp = ((start + REQ_PAGE_SIZE) < totalFunds) ? REQ_PAGE_SIZE : totalFunds - start;
        const resource = `${APP_CLOUD_FUNCTION_URL}/hl/funds/page?start=${start}&rpp=${rpp}`
        const { data } = await axios.get(resource,{headers: APP_FINTECH_HEADERS})
        start += rpp
        commit("SET_FUNDS_REFRESH_PROGRESS",+(100*((start)/totalFunds)).toFixed(0))
        await new Promise((s) => setTimeout(s, 50));
    }
    commit("SET_FUNDS_REFRESH_COMPLETE", true)
  },

  async listCacheFiles({commit}) {
    const {data} = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/funds/pages/list-objs`, 
            { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_CACHE_LIST", data)
  },

  async getFunds({commit}) {
    commit("SET_FUNDS_OBJ", null)
    const {data} = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/funds`, 
            { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_OBJ", data)
  },

  async getFundDetails({commit},{companyid,sectorid,sedol}) {
    const { data } = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/fund/details?companyid=${companyid}&sectorid=${sectorid}&sedol=${sedol}`, 
            { headers: APP_FINTECH_HEADERS })
    commit("ADD_FUND_DETAILS", data)
  },

  async getFundAnalysis({commit},{sedol}) {
    const { data } = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/fund/analysis?sedol=${sedol}`, 
            { headers: APP_FINTECH_HEADERS })
    commit("ADD_FUND_ANALYSIS", data)
  },

  async getEtfsStats({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/funds/stats`, 
                                        { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_STATS", data)
  },

  async getEtfsCompanies({commit}) {
    commit("SET_ETFS_COMPANIES", [])
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/etfs/compaines/list`,{ headers: APP_FINTECH_HEADERS })
    commit("SET_ETFS_COMPANIES", data)
  },

  async refreshEtfs({ commit }) {
    commit("SET_ETFS_REFRESH_PROGRESS", 0)
    commit("SET_ETFS_REFRESH_COMPLETE", false)
    commit("SET_ETFS_OBJ", null)

    // Request Number of Companies
    let totalCompanies = 0
    const resp = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/etfs/compaines/list`,{ headers: APP_FINTECH_HEADERS })
    totalCompanies = resp.data.length

    for(let company = 0; company < totalCompanies; company++) {
      const resource = `${APP_CLOUD_FUNCTION_URL}/hl/etfs/compaines/funds/list?companyid=${resp.data[company].id}`  // /etfs/compaines/funds/list'
      console.log(resource)
      const { data } = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      console.log(data)
      commit("SET_ETFS_REFRESH_PROGRESS",Math.ceil(+(100*((company)/totalCompanies)).toFixed(0)))
      // await new Promise((s) => setTimeout(s, 1000));
    }
    commit("SET_ETFS_REFRESH_COMPLETE", true)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}