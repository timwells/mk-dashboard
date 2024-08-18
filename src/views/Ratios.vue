<template>
	<div>
		<a href="https://www.multpl.com/" target="_blank">Multpl - Market, financial, and economic data.</a>

		<a-row :gutter="24" type="flex">
			<pre>{{ treasuraryRates }}</pre>
		</a-row>
		<a-row :gutter="24" type="flex">
		</a-row>	
	</div>
</template>

<script>
// https://www.multpl.com/
//const DS_SHILLER_PE = "shiller-pe/table/by-year"
//const DS_SHILLER_PE_MONTHLY = "shiller-pe/table/by-month"
//const DS_SP500_PE = "s-p-500-pe-ratio/table/by-month"
//const DS_1YR_TREASURY_RATE = "1-year-treasury-rate/table/by-month"
//const DS_10YR_TREASURY_RATE = "10-year-treasury-rate/table/by-month"

const _CHART = { type: 'line', zoom: { enabled: false } }
const _DATALABLES = { enabled: false }
const _STROKE = { curve: 'straight',  width: 2 }
const _TITLE = { text: '', align: 'left' }
const _GRID = { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}}
//const _XAXIS = { categories: null, tickAmount: 10 }

const _XAXIS = { 
	type: 'datetime',
    //min: new Date(this.historicalData[0][0]).getTime(),
    tickAmount: 2,
}

/*
xaxis: {
    type: 'datetime',
    min: new Date(this.historicalData[0][0]).getTime(),
    tickAmount: 4,
},
*/

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("mtpl", ["mtplDataSets","treasuraryRates"]),
		...mapGetters("mtpl",["gMtplDataSetExists"]),
	},
	data() {
		return {
		}
	},
	methods: {
	},
	async mounted() {
		// this.$store.dispatch("mtpl/getMtplData",{ds: DS_SHILLER_PE_MONTHLY});
		this.$store.dispatch("mtpl/getTreasuryRates");
	},
})


</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>