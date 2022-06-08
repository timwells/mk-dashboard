<template>
	<div>
  		<google-trend id="google-trend1" keywords="[btc]" geo="US" search="2020-01-01 2022-06-01"/>
  		<google-trend id="google-trend2" keywords="[recession]" geo="GB" search="2015-01-01 2022-06-01"/>
  		<google-trend id="google-trend2" keywords="[bear market, bull market]" geo="US" search="2020-01-01 2022-06-01"/>
  		<google-trend id="google-trend3" keywords="[BJSS]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend4" keywords="[IoT]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend5" keywords="[ML,AI]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend6" keywords="[blockchain]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend7" keywords="[supply chain]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend8" keywords="[uipath]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend9" keywords="[Sheffield Digital]" geo="GB" search="2008-01-01 2022-06-01"/>
  		<google-trend id="google-trend10" keywords="[Sheffield Digital Festival]" geo="GB" search="2008-01-01 2022-06-01"/>



		<!-- Markets -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="(market, index) in markets" :key="index">
				<CardChartInfo :title="market.title" :ticker="market.ticker"></CardChartInfo>
			</a-col>
		</a-row>

	</div>
</template>

<script>
// Card Chart Info.
import CardChartInfo from '../components/Cards/CardChartInfo' ;
import { mapState } from "vuex";

export default ({
	components: {
		CardChartInfo,
	},
	computed: {
    	...mapState("markets", ["markets"])
	},
	data() {
		return {
		}
	},
	mounted() {
    	this.$store.dispatch("markets/getMarkets");
    	this.$store.dispatch("quote/getQuote");
	}
})

</script>

<style lang="scss">
</style>