<template>
  <div :id="container"></div>
</template>

<script>
const containerPreFix = 'tradingview-mini-chart'
const scriptPreFix = 'tradingview-mini-chart-script'
const scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'

export default {
  props: {
    symbol: {
      type: String,
      default: ''
    },
    dateRange: {
      type: String,
      default: "60M",
    },
    width: {
      type: String,
      default: "800"
    },
    height: {
      type: String,
      default: "40"
    },
  },
  data: () => ({
    id: '',
    container: '',
    scriptId : ''
  }),
  methods: {
    getScriptElement() {
      return document.getElementById(this.scriptId);
    },
    scriptExists() {
      return this.getScriptElement() !== null;
    },
    appendScript() {
      if (this.scriptExists()) return;
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.type = 'text/javascript';
      script.async = true;
      script.src = scriptSrc;

      // https://www.tradingview.com/widget/mini-chart/
      const options = {
        "symbol": this.symbol,
        "width": this.width,
        "height": this.height,
        "locale": "en",
        "dateRange": this.dateRange,
        "colorTheme": "light",
        "trendLineColor": "rgba(73, 133, 231, 1)",
        "underLineColor": "rgba(41, 98, 255, 0.3)",
        "underLineBottomColor": "rgba(41, 98, 255, 0)",
        "isTransparent": false,
        "autosize": false,
        "largeChartUrl": "",
        "chartOnly": true,
        "noTimeScale": false
      }      

      script.textContent = JSON.stringify(options);
      document.getElementById(this.container).appendChild(script);
    }
  },
  beforeMount () {
    this.container = `${containerPreFix}_${Math.random().toString(36)}`
    this.scriptId = `${scriptPreFix}_${Math.random().toString(36)}`
  },
  mounted () {
    setTimeout(() => {
      this.appendScript();
    }, 300);
  }
}
</script>

<style>
</style>

