import { getDatabase, ref, child, get} from "firebase/database";

const _version = "1.0.1";
const state = {
  version: _version,
  cfversion: "",
  secrets: null
};

const getters = {};
const mutations = {
  SET_SECRETS: (state, payload) => { state.secrets = payload },
  SET_CF_VERSION: (state, payload) => { state.cfversion = payload }
};

const actions = {
  setSecrets({commit}, {secrets}) {
    commit("SET_SECRETS", secrets);
  },
  setCFVersion({commit}, {versionInfo}) {  
    commit("SET_CF_VERSION", versionInfo);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
