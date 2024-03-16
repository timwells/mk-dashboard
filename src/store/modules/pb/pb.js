import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  holders: []
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
  }  
}
const setters = {

}
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
  setters,
  mutations,
  actions
}
