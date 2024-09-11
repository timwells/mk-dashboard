import axios from "axios";
// import { getUserSecrets } from '@/firebase'
const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;
const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const TREASURY_RATE_DATA = [
  '1-year-treasury-rate/table/by-month',
  '2-year-treasury-rate/table/by-month',
  '3-year-treasury-rate/table/by-month',
  '5-year-treasury-rate/table/by-month',
  '10-year-treasury-rate/table/by-month',
  '20-year-treasury-rate/table/by-month',
  'inflation/table/by-month'
]

const SHILLER_DATA = [
  'shiller-pe/table/by-month',
  //'10-year-treasury-rate/table/by-month',
  //'cpi/table/by-month'
]
const state = {
  treasuryRates: [],
  shillerData: []
};

const getters = {
  gMtplDataSetExists: (state) => (dsName) => state.mtplDataSets.findIndex((d) => (d.ds === dsName)),
  Series: (state) => (dsName) => state.mtplDataSets.find((e) => (e.ds === dsName)),


  
}

/*
const mutations = {
  updateItem(state, { index, item }) { Vue.set(state.items, index, item);},
  addItem(state, item) { state.items.push(item);},
  removeItem(state, index) { state.items.splice(index, 1);},
  replaceAllItems(state, newItems) { state.items = [...newItems];}
}
*/

const mutations = {
  SET_MTPL_DATA: (state, payload) => state.mtplDataSets.push(payload),
  SET_TREASURY_RATES: (state, payload) => (state.treasuryRates = payload),
  SET_SHILLER_DATA: (state, payload) => (state.shillerData = payload),
};

const actions = {
  /*
  async getMtplData({ commit },{ ds }) {
    axios.get(`${CLOUD_FUNCTION_URL}/mtpl/dataset?ds=${ds}`, { headers: HEADERS })
      .then(response => { 
        console.log(response.data)
        commit("SET_MTPL_DATA", response.data) })
  },
  */
  async getTreasuryRates({ commit }) {
    let results=[]
    for(let i=0; i < TREASURY_RATE_DATA.length; i++) {
      const {data} = await axios.get(`${CLOUD_FUNCTION_URL}/mtpl/dataset?ds=${TREASURY_RATE_DATA[i]}`, 
                                        { headers: HEADERS })
      results.push(data);
    }
    commit("SET_TREASURY_RATES", results) 
  },
  async getShiller({ commit }) {
    let results = []
    for(let i=0; i < SHILLER_DATA.length; i++) {
      const {data} = await axios.get(`${CLOUD_FUNCTION_URL}/mtpl/dataset?ds=${SHILLER_DATA[i]}`, 
                                        { headers: HEADERS })
      results.push(data);
    }
    commit("SET_SHILLER_DATA", results) 
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
