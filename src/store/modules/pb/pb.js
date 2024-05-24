import axios from "axios";
import { getUserSecrets } from '@/firebase'
import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  holders: [],
  premiumBondsData: null,
};

const getters = {
  getHoldersQry: state => {
    let hQry = ""
    for(let i=0; i<state.holders.length; i++) {
      if(hQry.length>0) hQry += ","
      hQry += `${state.holders[i].n}:${state.holders[i].h}`
    } return hQry
  },
  getHolderValue: (state) => (name) => {
      if(name.length>0) return (state.holders.find(h => h.n === name)).v;
      else return 0
  },
  getHolderWinRate: (state) => (name,winings) => {
    if(name.length>0) return (100*(winings/((state.holders.find(h => h.n === name)).v))).toFixed(1);
    else return 0
  },
}
const setters = {
}

const mutations = {
  SET_HOLDERS: (state, payload) => (state.holders = payload),
  SET_PREMIUM_BONDS: (state, payload) => (state.premiumBondsData = payload),
};

async function genericGet(subPath,service,init,{commit}) {
  let secrets = await getUserSecrets();
  commit(service, init);
  let response = await axios.get(`${secrets.fintech_host}${subPath}`,{ headers: { 'x-api-key' : secrets.fintech_apikey} })
  commit(service, response.data)
}

const actions = {
  async getHolders({ commit }) {
    commit("SET_HOLDERS", []);
    get(child(ref(getDatabase()), `root/pb/holders`))
      .then((snapshot) => {
        if (snapshot.exists()) { 
            commit("SET_HOLDERS", snapshot.val())
        }
      })
      .catch((error) => { console.error(error); });
  },
  async getPremiumBondsHolders({ commit }, { holders }) {
    await genericGet(`/fintech/v1/scrape/pb/results?holders=${holders}`,"SET_PREMIUM_BONDS",[],{commit})
  },
  async getPremiumBondsData({ commit }, { holders }) {
    await genericGet(`/fintech/v1/scrape/pb/results2?holders=${holders}`,"SET_PREMIUM_BONDS",null,{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  setters,
  mutations,
  actions
}
