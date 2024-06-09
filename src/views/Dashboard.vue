<template>
	<a-tabs v-if="markets" default-active-key="1">
		<a-tab-pane key="1" tab="Funds">
			<a-row type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(1)" :key="i">			
					<CardChartFundInfo :title="e.title" :ticker="e.ticker" :sedol="e.sedol"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Equities">
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(2)" :key="i">			
					<CardChartEquityInfo :title="e.title" :ticker="e.ticker"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Index & Bonds">
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(3)" :key="i">			
					<CardChartIndexInfo v-if="e.type==='index'" :title="e.title" :ticker="e.ticker"/>
					<CardChartBondInfo v-if="e.type==='bond'" :title="e.title" :ticker="e.ticker"/>
				</a-col>
			</a-row>
		</a-tab-pane>
	</a-tabs>
</template>

<script>

import { mapState, mapGetters } from "vuex";

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
		...mapGetters("markets",["getGroup"]),

    	...mapState("wscrape", ["qqData"]),
	},
	data() {
		return {
		}
	},
	mounted() {
	    this.$store.dispatch("markets/getMarkets");
	    //this.$store.dispatch("wscrape/getQQData");
	}
})
</script>

<style lang="scss">
</style>