<template>
  <div>
    <WidgetTradingViewTechAnalysis v-if="watchlist.tickers"
      stock="LSE:SQZ" 
      :watchList="watchlist.tickers" 
      height="700" 
      :showToolbar="showToolbar">
    </WidgetTradingViewTechAnalysis>
  </div>
</template>

<script>
import { mapState } from "vuex";
import WidgetTradingViewTechAnalysis from '@/components/Widgets/WidgetTradingViewTechAnalysis.vue'

export default ({
  components: { WidgetTradingViewTechAnalysis },
  computed: { ...mapState("tradeview", ["watchlist"]) },
  data() {
    return {
      showToolbar: true
    }
  },
  mounted() {
    this.$store.dispatch("tradeview/getWatchList")
  }
})
</script>

<style>
</style>