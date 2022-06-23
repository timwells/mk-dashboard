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
        '###Stock',
        'LSE:SQZ',
        'LSE:DIVI',
        'LSE:AV.',
        'LSE:RR.',
        'LSE:BP.',
        '###Crypto',
        'COINBASE:BTCGBP',
        'COINBASE:ETHGBP'

      ],
      showToolbar: true
    }
  }
})
</script>

<style>
</style>