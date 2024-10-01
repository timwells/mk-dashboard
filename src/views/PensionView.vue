<template>
	<div>
        <h6>{{ getSymbols(portfolioName) }}</h6>
		<CardTVStockMultiChartFT :epics="getSymbols(portfolioName)"></CardTVStockMultiChartFT>
		<!--pre>{{ portfolios }}</pre-->
	</div>
</template>

<script>
import CardTVStockMultiChartFT from '@/components/Cards/CardTVStockMultiChartFT';
import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardTVStockMultiChartFT
	},
	watch: {
		portfolios(n,v) {
			console.log(this.getSymbols("Tim"))
		}
	},
	computed: {
		...mapGetters("pensions",["getSymbols"]),
		...mapState("pensions",["portfolios"])
	},
	data() {
		return {
			portfolioName: "Tim",
		}
	},
	methods: {
	},
	async mounted() {
    	this.$store.dispatch("pensions/getPortfolios")
	}
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>