import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  fedInfo: []
};

const getters = {}

const mutations = {
  SET_FED_INFO: (state, payload) => (state.fedInfo = payload)
};

const actions = {
  getFedInfo({ commit }) {
    get(child(ref(getDatabase()), `root/fedinfo`))
      .then((snapshot) => {
        if (snapshot.exists()) { 
          console.log(snapshot.val())
          commit("SET_FED_INFO", snapshot.val())
        }
      }).catch((error) => { console.error(error); });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
