<template>
  <WidgetTradingViewTechAnalysis 
    stock="LSE:SQZ" 
    :watchList="watchList" 
    height="800" 
    :showToolbar="showToolbar">
  </WidgetTradingViewTechAnalysis>

</template>

<script>
import WidgetTradingViewTechAnalysis from '@/components/Widgets/WidgetTradingViewTechAnalysis.vue'

export default ({
  components: { WidgetTradingViewTechAnalysis },
  data() {
    return {
      watchList: [
        '###Indexes',
        'VANTAGE:SP500',
        //'LSE:UKX',
        // 'LSE:XUAGBP',
        '###Stock',
        'LSE:SQZ',
        'LSE:DIVI',
        'LSE:AV.',
        'LSE:RR.',
        'LSE:BP.',
        'LSE:WIX',
        '###Crypto',
        'COINBASE:BTCGBP',
        'COINBASE:ETHGBP',
        'KRAKEN:XRPGBP'
      ],
      showToolbar: true
    }
  }
})
</script>

<style>
</style>