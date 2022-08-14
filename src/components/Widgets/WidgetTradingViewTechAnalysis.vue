<template>
  <div class="tradingview-widget-container">
    <div :id="id"></div>
  </div>
</template>

<script>
// https://www.tradingview.com/widget/advanced-chart/
const preFix = 'tradingview_'

export default {
  props: {
    stock: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: "800"
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
    console.log('TradingView2:beforeCreate- Nothing gets called before me!')
  },
  created () {
    console.log('TradingView2:created', this.id, this.stock)
    // this.property = 'Example property update.'
    // console.log('propertyComputed will update, as this.property is now reactive.')
  },

  beforeMount () {
    this.id = `${preFix}_${Math.random().toString(36)}`
  },

  // https://stackoverflow.com/questions/67294294/passing-own-data-to-trading-view

  mounted () {
    // https://uk.tradingview.com/widget/advanced-chart/
    const options = {
      'width': '100%',
      'height': this.height,
      'symbol': this.stock,
      'interval': 'D',
      'timezone': 'Europe/London',
      'theme': 'light',
      'style': '8',
      'locale': 'en',
      'toolbar_bg': '#f1f3f6',
      'enable_publishing': false,
      'allow_symbol_change': false,
      'hide_side_toolbar': !this.showToolbar,
      'watchlist': this.watchList,
      'news': [ 'headlines' ],
      // https://stackoverflow.com/questions/65940103/how-to-override-the-studies-of-the-tradingview-widget
      'studies': [
        {
          id: "MASimple@tv-basicstudies",
          inputs: { length: 200 }
        },{
          id: "MASimple@tv-basicstudies",
          inputs: { length: 100 }
        },{
          id: "MASimple@tv-basicstudies",
          inputs: { length: 50 }
        },{
          id: 'StochasticRSI@tv-basicstudies',
        }
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
