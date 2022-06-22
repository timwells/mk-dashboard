<template>
  <!--p>Trading View</p-->

  <WidgetTradingView 
    stock="LSE:SQZ" 
    :watchList="watchList" 
    height="800" 
    :showToolbar="showToolbar">
  </WidgetTradingView>

</template>

<script>
import WidgetTradingView from '@/components/Widgets/WidgetTradingView.vue'

export default ({
  components: { WidgetTradingView },
  data() {
    return {
      watchList: [
        '###Stock',
        'LSE:SQZ',
        'LSE:DIVI',
        'LSE:AV.',
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