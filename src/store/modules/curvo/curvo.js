import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  dataset: null,
  datasets: [],
  assetmap: []
}

const getters = {
}

const mutations = {
    SET_ASSETMAP: (state, payload) => (state.assetmap = payload),
    SET_DATASET: (state, payload) => (state.dataset = payload),
    SET_DATASET2: (state, payload) => (state.datasets.push(payload))
}
const actions = {
  async getAssetMap({ commit }) {
    console.log('getAssetMap')
    commit("SET_ASSETMAP", []);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/curvo/assetmap2`, 
                                                                    { headers: APP_FINTECH_HEADERS })
    commit("SET_ASSETMAP", data)
  },
  async getAsset({ commit },{ dataset }) {
    commit("SET_DATASET", null);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/curvo/asset?dataset=${dataset}`, 
                                                                    { headers: APP_FINTECH_HEADERS })
    commit("SET_DATASET", data)
  },
  async getAsset2({ commit },{ dataset }) {
    // console.log("getAsset2:",state.datasets.find(({ name }) => name === dataset))
    if(state.datasets.find(({ name }) => name === dataset) == undefined) {
      const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/curvo/asset?dataset=${dataset}`, 
                                                                                  { headers: APP_FINTECH_HEADERS })
      commit("SET_DATASET2", data)
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