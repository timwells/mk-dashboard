import axios from "axios";
const LIMIT = 600
const MARKET_COUNT = 20

const state = {
  values : [],
  categories: []
};

const getters = {}

const mutations = {
  SET_DATA: (state, payload) => {
        state.values = payload.map((e) => parseInt(e.value)).reverse()
        let markCount = MARKET_COUNT
        state.categories = payload.map((e) => { 
            markCount++
            if(markCount > MARKET_COUNT) {
              markCount = 0
              return (new Date(parseInt(e.timestamp)*1000)).toLocaleDateString('en-GB')
            } else return ""
        }).reverse() 
    }
}

const actions = {
  getIndex({ commit }) {
    axios.get(`https://api.alternative.me/fng/?limit=${LIMIT}`)
        .then(response => { commit("SET_DATA", response.data.data) })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
