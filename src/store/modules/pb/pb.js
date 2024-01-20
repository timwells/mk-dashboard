import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  holders: []
};

const getters = {}

const mutations = {
  SET_HOLDERS: (state, payload) => (state.holders = payload)
};

const actions = {
  async getHolders({ commit }) {
    commit("SET_HOLDERS", []);
    get(child(ref(getDatabase()), `root/pb/holders`))
      .then((snapshot) => {
        if (snapshot.exists()) { 
            // console.log('getHolders:',snapshot.val())
            commit("SET_HOLDERS", snapshot.val())
        }
      })
      .catch((error) => { console.error(error); });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
