import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  fedInfo: [],
  sahmrealtime : null,
  unrate : null,
  sahmrealtimeunrate:[],
  indicators: [],
  apiunrate: []
};

const getters = {}

const mutations = {
  SET_FED_INFO: (state, payload) => (state.fedInfo = payload),
  SET_SAHMREALTIME: (state, payload) => (state.sahmrealtime = payload),
  SET_UNRATE: (state, payload) => (state.unrate = payload),
  SET_SAHMUNRATE: (state, payload) => (state.sahmrealtimeunrate = payload),
  SET_INDICATORS: (state, payload) => (state.indicators = payload),

  SET_API_UNRATE: (state, payload) => (state.apiunrate = [payload]),
};

const actions = {
  getFedInfo({ commit }) {
    get(child(ref(getDatabase()), `root/fedinfo`))
      .then((snapshot) => {
        if (snapshot.exists()) { 
          commit("SET_FED_INFO", snapshot.val())
        }
      }).catch((error) => { console.error(error); });
  },
  async getSahmRealTime({ commit }) {
    commit("SET_SAHMREALTIME", null);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/sahmrealtime`, 
                                                                    { headers: APP_FINTECH_HEADERS })
    commit("SET_SAHMREALTIME", data)
  },
  async getUnRate({ commit }) {
    commit("SET_UNRATE", null);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/unrate`, 
                                                                    { headers: APP_FINTECH_HEADERS })
    commit("SET_UNRATE", data)
  },
  async getSahmRealTimeUnRate({ commit }) {
    commit("SET_SAHMUNRATE", []);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/sahmrealtimeunrate`, 
                                                                    { headers: APP_FINTECH_HEADERS })                                                         
    commit("SET_SAHMUNRATE", data)
  },
  async getIndicators({ commit }) {
    commit("SET_INDICATORS", []);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/indicators`, 
                                                                    { headers: APP_FINTECH_HEADERS })                                                                    
    commit("SET_INDICATORS", data)
  },
  async getApiUnRate({ commit }) {
    commit("SET_API_UNRATE", null);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/observations?seriesId=UNRATE&frequency=m&units=pc1`, { headers: APP_FINTECH_HEADERS })
    commit("SET_API_UNRATE", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
