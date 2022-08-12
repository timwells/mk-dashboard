import axios from "axios";
const LIMIT = 400

const state = {
  values : [],
  categories: []
};

const getters = {}

const mutations = {
  SET_DATA: (state, payload) => {
        state.values = payload.map((e) => parseInt(e.value)).reverse()
        let  mark = false
        state.categories = payload.map((e) => { 
            if(mark = !mark) return (new Date(parseInt(e.timestamp)*1000)).toLocaleDateString('en-GB')           
            return ""
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
