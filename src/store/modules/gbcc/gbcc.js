import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
} from "../common/c.js"

const state = {
  productsRefreshProgress: 0,
  productssRefreshComplete: true,
  categories:[],
  products:[]
};

const getters = {
  gProducts: (state) => (id) => {
    let key = `products-${id}`
    return state.products.find((e) => (e.tag === key))
  },
}

const mutations = {
    SET_CATEGORIES: (state, payload) => (state.categories = payload),

    SET_PRODUCTS_REFRESH_PROGRESS: (state, payload) => (state.productsRefreshProgress = payload),
    SET_PRODUCTS_REFRESH_COMPLETE: (state, payload) => (state.productssRefreshComplete = payload),

    ADD_PRODUCTS_CACHE: (state, payload) => (state.products = [...state.products, payload]),
    SET_PRODUCTS_CACHE: (state, payload) => (state.products = payload),
};

const actions = {
  async getCategories({ commit }) {
    const { data } = await axios.get(`${APP_CLOUD_FUNCTION_URL}/gbcc/categories`, { headers: APP_FINTECH_HEADERS })
    commit("SET_CATEGORIES", data)
  },

  async refreshProducts({ commit }) {
    commit("SET_PRODUCTS_REFRESH_PROGRESS", 0)
    commit("SET_PRODUCTS_REFRESH_COMPLETE", false)
    const resp = await axios.get(`${APP_CLOUD_FUNCTION_URL}/gbcc/categories`,{ headers: APP_FINTECH_HEADERS })
    const totalCategories = resp.data.data.length;
    for(let category = 0; category < totalCategories; category++) {
      const resource = `${APP_CLOUD_FUNCTION_URL}/gbcc/products?id=${resp.data.data[category].category}` 
      const { data } = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      commit("SET_PRODUCTS_REFRESH_PROGRESS",+(100*((category+1)/totalCategories)).toFixed(0))
    }
    commit("SET_PRODUCTS_REFRESH_COMPLETE", true)
  },

  async getProducts({commit},{category}) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/gbcc/products?id=${category}`
    console.log(resource)
    const { data } = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
    console.log(data)

    commit("ADD_PRODUCTS_CACHE", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}