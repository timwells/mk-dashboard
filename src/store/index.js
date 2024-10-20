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
import dd from "./modules/dd/dd"
import mtpl from "./modules/mtpl/mtpl"
import dcf from "./modules/dcf/dcf"
import san from "./modules/san/san"
import cnn from "./modules/cnn/cnn"
import lse from "./modules/lse/lse"
import tge from "./modules/tge/tge"
import ltt from "./modules/ltt/ltt"
import fviz from "./modules/fviz/fviz"
import curvo from "./modules/curvo/curvo"
import cyca from "./modules/cyca/cyca"
import ft from "./modules/ft/ft"
import fool from "./modules/fool/fool"
import drm from "./modules/drm/drm"
import hl from "./modules/hl/hl"
import pensions from "./modules/pensions/pensions"
import pm from "./modules/pm/pm"
import ons from "./modules/ons/ons"
import gbcc from "./modules/gbcc/gbcc"

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    app, 
    auth,
    
    funds, etfs, markets, quote,
    trends, indicators, newsfeed,
    sa, tradeview, lse, tge,ltt,
    wscrape, nt,cnn,
    dd,mtpl,
    crypto, stockwatch, pb,
    fedinfo,dcf,san,
    fviz,
    curvo,
    cyca,
    ft,
    fool,
    drm,
    hl,
    pensions,
    pm,
    ons,
    gbcc
  }
});
