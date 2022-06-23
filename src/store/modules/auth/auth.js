// https://www.section.io/engineering-education/firebase-vue-authentication/
import { auth } from '../../../firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'

const state = {
  user: null
};

const getters = {
}

const mutations = {
  SET_USER: (state, payload) => (state.user = payload)
};

const actions = {
    async login({ commit }) {
        console.log("login")
        const response = await
            // .then((response) => {
                if (response) {
                    console.log(response)
                    commit('SET_AUTH', response.user)
                } else {
                    throw new Error('sigin failed')
                }
            //})
    }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
