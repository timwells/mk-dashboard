// https://www.section.io/engineering-education/firebase-vue-authentication/
import { auth } from '@/firebase'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { getDatabase, ref, child, get } from "firebase/database";

const state = {
  user: null,
  role: null,
  appSecrets: null,
  userSecrets: null
};

const getters = {
  user: state => state.user,
  uid: state => state.user.uid,
  isAuthenticated: state => !!state.user,
  appSecrets: state => state.appSecrets,
  userSecrets: state => state.userSecrets,
  role: state => state.role,
}

const mutations = {
  SET_USER: (state, payload) => (state.user = payload),
  SET_ROLE: (state, payload) => (state.role = payload),
  SET_APP_SECRETS: (state, payload) => (state.appSecrets = payload),
  SET_USER_SECRETS: (state, payload) => (state.userSecrets = payload),
};

const actions = {
  async fetchUser({ commit }) {
    await onAuthStateChanged(auth, user => {
      commit('SET_USER', user ? user : null);
    });
  },
  async fetchUserRole({ commit },{uid}) {
    const path = `root/users/${uid}/role`
    const role = await get(child(ref(getDatabase()), path))
    commit('SET_ROLE', role.val());
  },
  async fetchAppSecrets({ commit }) {
    const path = `root/secrets`
    const appSecrets = await get(child(ref(getDatabase()), path))
    commit("SET_APP_SECRETS", appSecrets.val());
  },
  async fetchUserSecrets({ commit },{uid}) {
    const path = `root/users/${uid}/secrets`
    const userSecrets = await get(child(ref(getDatabase()), path))
    commit('SET_USER_SECRETS', userSecrets.val());
  },
  async signIn({ commit }, { values }) {
    commit('SET_USER', null)    
    console.log('signIn',values);
    const res = await signInWithEmailAndPassword(auth,values.email,values.password)
    if (res) {
      commit('SET_USER', res.user)
    } else {
      throw new Error('sigin failed')
    }
  },
  async signOut({ commit }) {
    await signOut(auth)
    commit('SET_USER', null)
    commit('SET_ROLE', null)
    commit('SET_USER_SECRETS', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
