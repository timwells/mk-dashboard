import Vue from "vue";
import Vuex from "vuex";

// Store Modules
import app from "./modules/app/app";
import auth from "./modules/auth/auth";
import markets from "./modules/markets/markets";
import funds from "./modules/funds/funds";
import etfs from "./modules/etfs/etfs";
import quote from "./modules/quote/quote";
import trends from "./modules/trends/trends";
import indicators from "./modules/indicators/indicators";
import newsfeed from "./modules/newsfeed/newsfeed";
import sa from "./modules/seekalpha/sa";
import tradeview from "./modules/tradeview/tradeview";
import wscrape from "./modules/wscrape/wscrape";
import crypto from "./modules/crypto/crypto"
import stockwatch from "./modules/stockwatch/stockwatch"
import pb from "./modules/pb/pb"
import fedinfo from "./modules/fedinfo/fedinfo"
import nt from "./modules/nt/nt"
import divd from "./modules/divd/divd"
import mtpl from "./modules/mtpl/mtpl"
import dcf from "./modules/dcf/dcf"
import san from "./modules/san/san"
import cnn from "./modules/cnn/cnn"
import lse from "./modules/lse/lse"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app, auth,
    funds, etfs, markets, quote,
    trends, indicators, newsfeed,
    sa, tradeview, lse,
    wscrape,
    nt,cnn,
    divd,
    mtpl,
    crypto, stockwatch, pb,
    fedinfo,
    dcf,
    san 
  }
});
