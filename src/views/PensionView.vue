<template>
	<div>
        <h6>{{ pensionTickers }}</h6>
		<CardTVStockMultiChartFT :epics="pensionTickers"></CardTVStockMultiChartFT>
	</div>
</template>

<script>
import CardTVStockMultiChartFT from '@/components/Cards/CardTVStockMultiChartFT';

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardTVStockMultiChartFT
	},
	computed: {
        ...mapState("pensions",["portfolios"])
	},
	data() {
		return {
			pensionTickers: [
				"GB00B9GRH067:GBX", 
				"GB00B935C537:GBP", 
				"GB0007832826:GBP",
				"GB0007832602:GBP",
				"GB0007832487:GBP"
			]
		}
	},
	methods: {
	},
	async mounted() {
        // this.$store.dispatch("pensions/getPortfolios")
	}
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>