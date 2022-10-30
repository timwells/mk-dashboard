import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  stockWatches: null
};

const getters = {}
const mutations = {
  SET_STOCK_WATCHES: (state, payload) => (state.stockWatches = payload)
};

const actions = {
  getStockWatches({ commit }) {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `stocks/watch`))
      .then((snapshot) => {
        commit("SET_STOCK_WATCHES", null);
        if (snapshot.exists()) {          
          commit("SET_STOCK_WATCHES", 
            snapshot.val().map((v,i) => { return {...v, key:i}}) ) 
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
