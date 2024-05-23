<template>
	<div>
		<apexchart v-if="shillerPESeries!=null" 
			:options="shillerPEChartOpts" 
			:series="shillerPESeries"
			width="800" 
			height="450">
		</apexchart>
	</div>
</template>

<script>
const DS_SHILLER_PE = "shiller-pe/table/by-year"
const DS_SP500_PE = "s-p-500-pe-ratio/table/by-month"

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["mtplDataSets"]),
		...mapGetters("wscrape",["gMtplDataSet"]),
	},
	watch: {
		mtplDataSets(o,n) {
			console.log(DS_SHILLER_PE, this.gMtplDataSet(DS_SHILLER_PE))
			console.log(DS_SP500_PE, this.gMtplDataSet(DS_SP500_PE))

			/*
			if(n[0].ds === DS_SHILLER_PE) {
				this.shillerPESeries = [{ name: n[0].rows.ds, data: n[0].rows.map(e => e.value)}]
				this.shillerPEChartOpts.xaxis.categories = n[0].rows.map((v,i) => v.date);
				this.shillerPEChartOpts.title.text = n[0].ds
			}
			*/
		}
    },
	data() {
		return {
			shillerPESeries: null,
			shillerPEChartOpts: {
				chart: { type: 'line', zoom: { enabled: false } },
				dataLabels: { enabled: false },
				stroke: { curve: 'straight' },
				title: { text: '', align: 'left' },
                stroke: { curve: 'straight',  width: 1 },
				grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
				xaxis: { categories: null,tickAmount: 45, } // Adjust tick amount to space labels
			},
			spPESeries: null,
			spPEChartOpts: {
				chart: { type: 'line', zoom: { enabled: false } },
				dataLabels: { enabled: false },
				stroke: { curve: 'straight' },
				title: { text: '', align: 'left' },
                stroke: { curve: 'straight',  width: 1 },
				grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
				xaxis: { categories: null,tickAmount: 45, } // Adjust tick amount to space labels
			},
		}
	},
	mounted() {
		this.$store.dispatch("wscrape/getMtplData",{ds: DS_SHILLER_PE});
		this.$store.dispatch("wscrape/getMtplData",{ds: DS_SP500_PE})
	},
})


</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>