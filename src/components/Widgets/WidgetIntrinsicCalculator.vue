<template>
<!-- https://www.omnicalculator.com/finance/intrinsic-value -->
    <!--div :id="container"-->
        <div class="omni-calculator" 
            data-calculator="finance/intrinsic-value" 
            data-width="300" 
            data-config='{}' 
            data-currency="GBP" 
            data-show-row-controls="false" 
            data-version="3" 
            data-t="1667852887625">
            <iframe 
              class="omni-calculator-frame" 
              data-calculator-id="1" 
              src="https://www.omnicalculator.com/embed/finance/intrinsic-value#id=1&amp;hasLink=true&amp;version=3" 
              style="visibility: visible; opacity: 1; display: block; border: none; margin: 0px; padding: 0px; height: 362px;"></iframe>
        </div>
    <!--/div-->    
</template>

<script>
const containerPreFix = 'intrinsic-calculator'
const scriptPreFix = 'intrinsic-calculator-script'
const scriptSrc = 'https://cdn.omnicalculator.com/sdk.js'

export default {
  props: {
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
      document.getElementById(this.container).appendChild(script);
    }
  },

  beforeMount () {
    this.container = `${containerPreFix}_${Math.random().toString(36)}`
    this.scriptId = `${scriptPreFix}_${Math.random().toString(36)}`
  },

  mounted () {
    //setTimeout(() => {
    //  this.appendScript();
    //}, 300);
  }
}
</script>

<style>
</style>
