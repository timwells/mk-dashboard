import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  productsRefreshProgress: 0,
  productssRefreshComplete: true,
  categories:[]
};

const getters = {
}

const mutations = {
    SET_CATEGORIES: (state, payload) => (state.categories = payload),

    SET_PRODUCTS_REFRESH_PROGRESS: (state, payload) => (state.productsRefreshProgress = payload),
    SET_PRODUCTS_REFRESH_COMPLETE: (state, payload) => (state.productssRefreshComplete = payload),

};

const actions = {
  async getCategories({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/gbcc/categories`, { headers: APP_FINTECH_HEADERS })
    commit("SET_CATEGORIES", data)
  },

  async refreshProducts({ commit }) {
    commit("SET_PRODUCTS_REFRESH_PROGRESS", 0)
    commit("SET_PRODUCTS_REFRESH_COMPLETE", false)
    const resp = await axios.get(`${APP_CLOUD_FUNCTION_URL}/gbcc/categories`,{ headers: APP_FINTECH_HEADERS })
    const totalCategories = resp.data.data.length;

    console.log("totalCategories:",totalCategories)
    for(let category = 0; category < totalCategories; category++) {
      const resource = `${APP_CLOUD_FUNCTION_URL}/gbcc/products?id=${resp.data.data[category].category}` 
      const { data } = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      
      // console.log(category,totalCategories,(category+1)/totalCategories,(100*((category+1)/totalCategories)))

      commit("SET_PRODUCTS_REFRESH_PROGRESS",+(100*((category+1)/totalCategories)).toFixed(0))

    }
    commit("SET_PRODUCTS_REFRESH_COMPLETE", true)
  },

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