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
  apiunrate: [],
  composite: null,
  y2y10maturity: null,

  chartCache: [],


};

const getters = {}

const mutations = {
  SET_FED_INFO: (state, payload) => (state.fedInfo = payload),
  SET_SAHMREALTIME: (state, payload) => (state.sahmrealtime = payload),
  SET_UNRATE: (state, payload) => (state.unrate = payload),
  SET_SAHMUNRATE: (state, payload) => (state.sahmrealtimeunrate = payload),
  SET_INDICATORS: (state, payload) => (state.indicators = payload),

  SET_API_UNRATE: (state, payload) => (state.apiunrate = [payload]),
  
  SET_COMPOSITE: (state, payload) => (state.composite = payload),

  SET_2Y10Y: (state, payload) => (state.y2y10maturity = payload),

  RESET_CHART_CACHE: (state, payload) => (state.chartCache = payload),
  ADD_CHART_CACHE: (state, payload) => (state.chartCache = [...state.chartCache, payload]),
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

  async getApiUnRate({ commit }) {
    commit("SET_API_UNRATE", null);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fed/observation?seriesId=UNRATE&frequency=m&units=pc1`, { headers: APP_FINTECH_HEADERS })
    commit("SET_API_UNRATE", data)
  },
  async getComposite({ commit }) {
    commit("SET_COMPOSITE", null);
    let seriesQuery = [
      'seriesId=UNRATE&frequency=m&units=pc1&scale=1.0',
      'seriesId=POILWTIUSDM&frequency=m&units=lin&scale=1.0',
      'seriesId=SAHMREALTIME&frequency=m&units=lin&scale=20.0',
      'seriesId=VIXCLS&frequency=m&units=lin&scale=1.0'
    ]
    let seriesData = []
    for(let i = 0; i < seriesQuery.length; i++) {
      const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fed/observation?${seriesQuery[i]}`, { headers: APP_FINTECH_HEADERS })
      seriesData.push(data)
    }
    commit("SET_COMPOSITE", seriesData)
  },

  async resetChartDataValues({ commit }) {
    commit("RESET_CHART_CACHE", [])
  },

  async getChartDataValues({ commit },{ dataset }) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/fed/observation2?${dataset}`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      //console.log(data)
      commit("ADD_CHART_CACHE", data)
    } catch(e) {
        console.log("getChartDataValues",e)
    }
  },
}

/*
units
A key that indicates a data value transformation.

string, optional, default: lin (No transformation)
One of the following values: 'lin', 'chg', 'ch1', 'pch', 'pc1', 'pca', 'cch', 'cca', 'log'
lin = Levels (No transformation)
chg = Change
ch1 = Change from Year Ago
pch = Percent Change
pc1 = Percent Change from Year Ago
pca = Compounded Annual Rate of Change
cch = Continuously Compounded Rate of Change
cca = Continuously Compounded Annual Rate of Change
log = Natural Log
*/


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
