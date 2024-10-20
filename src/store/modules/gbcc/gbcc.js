import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  categories:[]
};

const getters = {
}

const mutations = {
    SET_CATEGORIES: (state, payload) => (state.categories = payload),
};

const actions = {
  async getCategories({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/gbcc/categories`, { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_STATS", data)
  },

  /*
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
  */
 /*
  async listCacheFiles({commit}) {
    const {data} = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/funds/pages/list-objs`, 
            { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_CACHE_LIST", data)
  },
*/
/*
  async getFunds({commit}) {
    commit("SET_FUNDS_OBJ", null)
    const {data} = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/funds`, 
            { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_OBJ", data)
  },
*/
/*
  async getFundDetails({commit},{companyid,sectorid,sedol}) {
    const { data } = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/fund/details?companyid=${companyid}&sectorid=${sectorid}&sedol=${sedol}`, 
            { headers: APP_FINTECH_HEADERS })
    commit("ADD_FUND_DETAILS", data)
  },
*/
/*
  async getFundAnalysis({commit},{sedol}) {
    const { data } = await axios.get(
        `${APP_CLOUD_FUNCTION_URL}/hl/fund/analysis?sedol=${sedol}`, 
            { headers: APP_FINTECH_HEADERS })
    commit("ADD_FUND_ANALYSIS", data)
  },
*/
/*
  async getEtfsStats({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/funds/stats`, 
                                        { headers: APP_FINTECH_HEADERS })
    commit("SET_FUNDS_STATS", data)
  },
*/
/*
  async getEtfsCompanies({commit}) {
    commit("SET_ETFS_COMPANIES", [])
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/etfs/compaines/list`,{ headers: APP_FINTECH_HEADERS })
    commit("SET_ETFS_COMPANIES", data)
  },
*/
/*
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
*/
/*
  async getEtfs({commit}) {
    commit("SET_ETFS_OBJ", {})
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/hl/etfs`,{ headers: APP_FINTECH_HEADERS })
    commit("SET_ETFS_OBJ", data)
  },
  async getEtfDetails({commit},{sedol}) {   
    const { data } = await axios.get(
                        `${APP_CLOUD_FUNCTION_URL}/hl/etf/details?sedol=${sedol}`, 
                             { headers: APP_FINTECH_HEADERS })
    console.log("getEtfDetails:",sedol,data)

    commit("ADD_ETF_DETAILS", data)
  },
*/
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}