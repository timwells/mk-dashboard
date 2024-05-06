<template>
	<div>
		<!-- Markets -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(market, index) in markets" :key="index">			
				<CardChartFundInfo v-if="market.type=='fund'" :title="market.title" :ticker="market.ticker"/>
				<CardChartEquityInfo v-if="market.type=='equity'" :title="market.title" :ticker="market.ticker"/>
				<CardChartIndexInfo v-if="market.type=='index'" :title="market.title" :ticker="market.ticker"/>
				<CardChartBondInfo v-if="market.type=='bond'" :title="market.title" />
			</a-col>
		</a-row>

	</div>
</template>

<script>
import { mapState } from "vuex";
import CardChartFundInfo from '../components/Cards/CardChartFundInfo' ;
import CardChartEquityInfo from '../components/Cards/CardChartEquityInfo';
import CardChartIndexInfo from '../components/Cards/CardChartIndexInfo';
import CardChartBondInfo from '../components/Cards/CardChartBondInfo';

export default ({
	components: {
		CardChartFundInfo,
		CardChartEquityInfo,
		CardChartIndexInfo,
		CardChartBondInfo
	},
	computed: {
    	...mapState("markets", ["markets"]),
    	...mapState("wscrape", ["qqData"]),
	},
	data() {
		return {
		}
	},
	mounted() {
	    this.$store.dispatch("markets/getMarkets1");
	    this.$store.dispatch("wscrape/getQQData");
	}
})

</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>