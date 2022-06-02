import Vue from "vue";
import Vuex from "vuex";

// Store Modules
import app from "./modules/app/app";
import markets from "./modules/markets/markets";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    markets
  }
});
