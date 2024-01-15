<template>
  <div>
      <!--button @click="deleteElementInIframe">Delete Element</button-->
      <pre>{{ getUrl() }}</pre>
      <iframe 
        ref="myFrame"
        :src="src3"
        height='900px' 
        width='100%' 
        frameborder='0' 
        scrolling='YES'>
      </iframe>
</div>
</template>
  
<script>  
  //<!--button @click="deleteElementInIframe">Delete Element</button-->
  export default {
    props: {
      symbol: { type: String, default: ''},
    },
    data: () => ({
      src: 'https://www.londonstockexchange.com/stock/JD./jd-sports-fashion-plc/company-page',
      src1: 'https://uk.finance.yahoo.com/chart/BP?p=BP',
      src2: 'https://www.ii.co.uk/shares/bp/LSE:BP.',
      src3: 'https://www.barrons.com/market-data/stocks/cost?countrycode=uk'
    }),
  
    methods: {
      getUrl() {
        let _symbol = this.symbol.toLowerCase()
        //return `http://www.barrons.com/market-data/stocks/sqz?countrycode=uk`
        return `http://www.barrons.com/market-data/stocks/${_symbol}?countrycode=uk`
      },
      deleteElementInIframe() {
        // Access the iframe
        const iframe = this.$refs.myFrame;
        console.log(this.$refs)

        // Access the contentDocument of the iframe
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Find and delete the element in the iframe content
        const elementToDelete = iframeDocument.getElementById('company-hero');
        // console.log(elementToDelete)
        if (elementToDelete) {
          elementToDelete.parentNode.removeChild(elementToDelete);
        }
      }
    },
    mounted () {
    }
  }
</script>
  
<style>
</style>
  