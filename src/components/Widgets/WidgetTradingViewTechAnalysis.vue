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
    symbol: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: "720"
    },
    showToolbar: {
      type: Boolean,
      default: false
    },
    watchList: {
      type: Array,
      default: () => []
    }
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
  },
  created () {
  },
  beforeMount () {
    this.id = `${preFix}_${Math.random().toString(36)}`
  },

  // https://stackoverflow.com/questions/67294294/passing-own-data-to-trading-view

  mounted () {
    // https://uk.tradingview.com/widget/advanced-chart/

/*
  new TradingView.widget(
  {
  "autosize": true,
  "symbol": "NASDAQ:AAPL",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "light",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "hide_top_toolbar": true,
  "withdateranges": true,
  "hide_side_toolbar": false,
  "allow_symbol_change": true,
  "save_image": false,
  "details": true,
  "calendar": true,
  "container_id": "tradingview_3ac33"
}
*/

    const options = {
      'width': '100%',
      'height': this.height,
      'symbol': this.symbol,
      'interval': 'M',
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
      'container_id': this.id
    }
    // eslint-disable-next-line no-new
    const TradingViewWidget = window.TradingView.widget
    // eslint-disable-next-line no-new
    new TradingViewWidget(options)
  }
}
</script>

<style>
</style>
