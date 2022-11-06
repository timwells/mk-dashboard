<template>
    <div class="tradingview-widget-container">
      <div :id="container"></div>
    </div>
</template>

<script>
const containerPreFix = 'tradingview-tech-screener'
const scriptPreFix = 'tradingview-tech-screener-script'
const scriptSrc = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'

export default {
  props: {
    height: {
      type: String,
      default: "720"
    },
  },
  data: () => ({
    container: '',
    scriptId : ''
  }),

  methods: {
    getScriptElement() { return document.getElementById(this.scriptId) },
    scriptExists() { return this.getScriptElement() !== null },
    appendScript() {
      if (this.scriptExists()) return;
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.type = 'text/javascript';
      script.async = true;
      script.src = scriptSrc;
      const options = {
        "width": "100%",
        "height": "800",
        "defaultColumn": "overview",
        "defaultScreen": "most_capitalized",
        "market": "uk",
        "showToolbar": true,
        "colorTheme": "light",
        "locale": "en"
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
