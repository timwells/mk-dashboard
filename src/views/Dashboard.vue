<template>
	<div>
		<!-- Markets -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="(market, index) in markets" :key="index">
				<CardChartFundInfo 
					v-if="market.type=='fund'" 
					:title="market.title" 
					:ticker="market.ticker"/>

				<CardChartEquityInfo v-if="market.type=='equity'" 
					:title="market.title" 
					:ticker="market.ticker"/>
			</a-col>
		</a-row>
	</div>
</template>

<script>
// Card Chart Info.
import CardChartFundInfo from '../components/Cards/CardChartFundInfo' ;
import CardChartEquityInfo from '../components/Cards/CardChartEquityInfo';
import { mapState } from "vuex";

export default ({
	components: {
		CardChartFundInfo,
		CardChartEquityInfo
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