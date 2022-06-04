import Vue from "vue";
import Vuex from "vuex";

// Store Modules
import app from "./modules/app/app";
import markets from "./modules/markets/markets";
import funds from "./modules/funds/funds";
import quote from "./modules/quote/quote";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    funds,
    markets,
    quote
  }
});
