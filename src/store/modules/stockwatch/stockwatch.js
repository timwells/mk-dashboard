import axios from "axios";
import { getDatabase, ref, child, get} from "firebase/database";

const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;
const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  stockWatches: null
};

const getters = {}
const mutations = {
  SET_STOCK_WATCHES: (state, payload) => (state.stockWatches = payload)
};

const actions = {
  jobinfo({commit}) {
    axios.get(`${CLOUD_FUNCTION_URL}/jobadmin/jobinfo`,{ headers: HEADERS })
      .then(response => {console.log(response.data)})
  },
  jobrun({ commit }) {
    axios.get(`${CLOUD_FUNCTION_URL}/jobadmin/jobrun`,{ headers: HEADERS })
      .then(response => {console.log(response.data)})
  },
  getStockWatches({ commit }) {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `stocks/watch`))
      .then((snapshot) => {
        commit("SET_STOCK_WATCHES", null);
        if (snapshot.exists()) {
          commit("SET_STOCK_WATCHES", snapshot.val().map(
            (v,i) => { return {...v, key:i}})
              .sort((a, b) => b.tp - a.tp))  
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
