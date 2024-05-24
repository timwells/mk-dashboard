import axios from "axios";
// import { getUserSecrets } from '@/firebase'
const CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;

const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  mtplDataSets: [],
};

const getters = {
  gMtplDataSetExists: (state) => (dsName) => state.mtplDataSets.findIndex((d) => (d.ds === dsName)),
}

/*
const mutations = {
  updateItem(state, { index, item }) { Vue.set(state.items, index, item);},
  addItem(state, item) { state.items.push(item);},
  removeItem(state, index) { state.items.splice(index, 1);},
  replaceAllItems(state, newItems) { state.items = [...newItems];}
}
*/

const mutations = {
  SET_MTPL_DATA: (state, payload) => state.mtplDataSets.push(payload),
};

const actions = {
  async getMtplData({ commit },{ ds }) {
    // const index = state.mtplDataSets.findIndex(obj => {
    //    console.log(obj.ds);
    //    return (obj.ds === ds);
    //});

    // console.log('getMtplData',ds,index)
    // if(index === -1) {
      axios.get(`${CLOUD_FUNCTION_URL}/fintech/v1/scrape/mtpl/dataset?ds=${ds}`, { headers: HEADERS })
        .then(response => { 
          console.log(response.data)
          commit("SET_MTPL_DATA", response.data) })
    //}
  },
 }

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
