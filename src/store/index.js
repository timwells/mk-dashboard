import Vue from "vue";
import Vuex from "vuex";

// Store Modules
import app from "./modules/app/app";
import auth from "./modules/auth/auth";
import markets from "./modules/markets/markets";
import funds from "./modules/funds/funds";
import quote from "./modules/quote/quote";
import trends from "./modules/trends/trends";
import indicators from "./modules/indicators/indicators";
import newsfeed from "./modules/newsfeed/newsfeed";
import sa from "./modules/seekalpha/sa";
import tradeview from "./modules/tradeview/tradeview";
import wscrape from "./modules/wscrape/wscrape";
import crypto from "./modules/crypto/crypto"
import stockwatch from "./modules/stockwatch/stockwatch"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app, auth,
    funds, markets, quote,
    trends, indicators, newsfeed,
    sa, tradeview, wscrape,
    crypto, stockwatch
  }
});
