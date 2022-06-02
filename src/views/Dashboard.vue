<template>
	<div>
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

/*
const _markets = [
	{
		title: "BLACKROCK MYMAP 6 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQM"
	},
	{
		title: "BLACKROCK MYMAP 5 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQK"
	},
	{
		title: "BLACKROCK MYMAP 4 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQI"
	},
	{
		title: "BLACKROCK MYMAP 3 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQG"
	},
	{
		title: "BLACKROCK MYMAP 5 SELECT ESG CLASS D - ACCUMULATION (GBP)",
		ticker: "FR2QB"
	},
	{
		title: "LF LINDSELL TRAIN UK EQUITY CLASS D - ACCUMULATION (GBP)",
		ticker: "FK4VD"		
	},
	{
		title: "LINDSELL TRAIN GLOBAL EQUITY - DISTRIBUTING CLASS D - INCOME (GBP)",
		ticker: "FK6WV"
	},
	{
		title:"LEGAL & GENERAL ACTIVE GLOBAL HIGH YIELD CLASS I - ACCUMULATION (GBP)",
		ticker: "FLGITA"
	},
	{
		title: "BAILLIE GIFFORD AMERICAN CLASS B - ACCUMULATION (GBP)",
		ticker: "FBGAMAB"
	}
]
*/

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
	}
})

</script>

<style lang="scss">
</style>