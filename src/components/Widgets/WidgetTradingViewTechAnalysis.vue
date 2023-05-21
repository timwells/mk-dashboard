<template>
  <div class="tradingview-widget-container">
    <div :id="id"></div>
  </div>
</template>

<script>
// https://www.tradingview.com/widget/advanced-chart/
const preFix = 'tradingviewtechanalysis_'

export default {
  props: {
    symbol: { type: String, default: ''},
    height: { type: String, default: "720"},
    showToolbar: { type: Boolean, default: false },
    watchList: { type: Array, default: () => [] }
  },
  computed: {
    stockComputed () {
      return this.stock
    }
  },
  data: () => ({
    id: ''
  }),

  methods: {
  },

  beforeCreate () {
    //this.id = `${preFix}_${Math.random().toString(36)}`
    //console.log("beforeCreate:",this.id);  
  },
  created () {
    // this.id = `${preFix}_${Math.random().toString(36)}`
    // console.log("created:",this.id);  
  },

  beforeMount () {
    this.id = `${preFix}_${Math.random().toString(36)}`
    // console.log("beforeMount:",this.id);
  },

  // https://stackoverflow.com/questions/67294294/passing-own-data-to-trading-view
  mounted () {
    // https://uk.tradingview.com/widget/advanced-chart/

    const options = {
      'container_id': this.id,
      'width': '99%',
      'height': this.height,
      'symbol': this.symbol,
      'interval': 'W',
      'timezone': 'Europe/London',
      'theme': 'light',
      'style': '8',
      'locale': 'en',
      'toolbar_bg': '#f1f3f6',
      'enable_publishing': false,
      'allow_symbol_change': true,
      "withdateranges": true,
      "hide_top_toolbar": false,
      "hide_side_toolbar": false,
      'watchlist': this.watchList,
      "calendar": true,
      "details": true,
      "calendar": true,
      "save_image": false,
      // https://stackoverflow.com/questions/65940103/how-to-override-the-studies-of-the-tradingview-widget
      'studies': [
        { id: "MASimple@tv-basicstudies", inputs: { length: 200 }},
        { id: "MASimple@tv-basicstudies", inputs: { length: 100 }},
        { id: "MASimple@tv-basicstudies", inputs: { length: 50 }},
        { id: 'StochasticRSI@tv-basicstudies'}
      ],
    }
    // console.log(options)
    // eslint-disable-next-line no-new
    const TradingViewWidget = window.TradingView.widget
    // eslint-disable-next-line no-new
    new TradingViewWidget(options)
  }
}
</script>

<style>
</style>
