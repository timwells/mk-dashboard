import axios from "axios";
import { getDatabase, ref, child, get } from "firebase/database";

const _version = "v46";
const state = {
  version: _version,
  cfversion: "",
  secrets: null
};

const getters = {
  getSecrets: state => {
    return state.secrets;
  }
}

const mutations = {
  SET_SECRETS: (state, payload) => { state.secrets = payload },
  SET_CF_VERSION: (state, payload) => { state.cfversion = payload }
};

const actions = {
  setSecrets({commit}, {secrets}) {
    // commit("SET_SECRETS", secrets);
    // console.log("setSecrets");
  },
  async getSecrets({commit}) {
    if(state.secrets == null) {
      const snapshot = await get(child(ref(getDatabase()), `root/secrets`))
      if (snapshot.exists()) {
        commit("SET_SECRETS", snapshot.val());
        // console.log("getSecrets",snapshot.val())
      }
    }
  },
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
