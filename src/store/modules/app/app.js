import { getDatabase, ref, child, get} from "firebase/database";

const _version = "1.0.1";
const state = {
  version: _version,
  secrets: null
};

const getters = {};
const mutations = {
  SET_SECRETS: (state, payload) => {state.secrets = payload }
};

const actions = {
  setSecrets({commit}, {secrets}) {
    commit("SET_SECRETS", secrets);
  }    
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
