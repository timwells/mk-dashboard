import axios from "axios";
import { getDatabase, ref, child, get } from "firebase/database";

const _version = "v66";
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
