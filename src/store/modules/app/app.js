import axios from "axios";

const _version = "v74";
const state = {
  version: _version,
  cfversion: "",
};

const getters = {
}

const mutations = {
  SET_CF_VERSION: (state, payload) => { state.cfversion = payload },
};

const actions = {
  async getCFVersion({commit},) {  
    let response = await axios.get("https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/version")
    commit("SET_CF_VERSION", response.data);
  } 
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
