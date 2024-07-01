<template>
  <div :id="container"></div>
</template>

<script>
const containerPreFix = 'tradingview-tech-analysis'
const scriptPreFix = 'tradingview-tech-analysis-script'
const scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js'

export default {
  props: {
    symbol: {
      type: String,
      default: ''
    },
    interval: {
      type: String,
      default: "1m",
    },
    width: {
      type: String,
      default: "425"
    },
    height: {
      type: String,
      default: "450"
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
      const options = {
        "interval": "1M",
        "width": "100%",
        "isTransparent": false,
        "height": 480,
        "symbol": this.symbol,
        "showIntervalTabs": true,
        "locale": "en",
        "colorTheme": "light"
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

