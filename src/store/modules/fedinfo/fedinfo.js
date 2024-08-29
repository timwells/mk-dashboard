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
  y2y10maturity: null
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
      const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/observations?${seriesQuery[i]}`, { headers: APP_FINTECH_HEADERS })
      seriesData.push(data)
    }
    commit("SET_COMPOSITE", seriesData)
  },

  async get2Y10YTreasuryMaturity({ commit }) {
    let seriesQuery = [
      'seriesId=JHDUSRGDPBR&frequency=q&units=lin&scale=4.0',
      'seriesId=T10Y2Y&frequency=m&units=lin&scale=1.0',
      // 'seriesId=SAHMREALTIME&frequency=m&units=lin&scale=1.0',
      // 'seriesId=GVZCLS&frequency=m&units=lin&scale=0.1',
    ]
    commit("SET_2Y10Y", null);
    let seriesData = []
    for(let i = 0; i < seriesQuery.length; i++) {
      const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fed/observations?${seriesQuery[i]}`, { headers: APP_FINTECH_HEADERS })
      seriesData.push(data)
    }
    commit("SET_2Y10Y", seriesData)
  }
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
