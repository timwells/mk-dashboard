<template>
	<div>

		<a-row :gutter="24" type="flex">
			<a-col :span="12" class="mb-12">
				<apexchart v-if="shillerPESeries!=null" 
					:options="shillerPEChartOpts" 
					:series="shillerPESeries"
					height="450">
				</apexchart>
			</a-col>
			<a-col :span="12" class="mb-12">
				<apexchart v-if="spPESeries!=null" 
					:options="spPEChartOpts" 
					:series="spPESeries"
					height="450">
				</apexchart>
			</a-col>
		</a-row>	
		<a-row :gutter="24" type="flex">
			<a-col :span="12" class="mb-12">
				<apexchart v-if="yr1TreasuryRateSeries!=null" 
					:options="yr1TreasuryRateChartOpts" 
					:series="yr1TreasuryRateSeries"
					height="450">
				</apexchart>
			</a-col>
			<a-col :span="12" class="mb-12">
				<apexchart v-if="yr10TreasuryRateSeries!=null" 
					:options="yr10TreasuryRateChartOpts" 
					:series="yr10TreasuryRateSeries"
					height="450">
				</apexchart>
			</a-col>
		</a-row>	
	</div>
</template>

<script>
// https://www.multpl.com/
const DS_SHILLER_PE = "shiller-pe/table/by-year"
const DS_SP500_PE = "s-p-500-pe-ratio/table/by-month"
const DS_1YR_TREASURY_RATE = "1-year-treasury-rate/table/by-month"
const DS_10YR_TREASURY_RATE = "10-year-treasury-rate/table/by-month"

const _CHART = { type: 'line', zoom: { enabled: false } }
const _DATALABLES = { enabled: false }
const _STROKE = { curve: 'straight',  width: 3 }
const _TITLE = { text: '', align: 'left' }
const _GRID = { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}}
const _XAXIS = { categories: null, tickAmount: 25 }


import { mapState, mapGetters } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["mtplDataSets"]),
		...mapGetters("wscrape",["gMtplDataSetExists"]),
	},
	watch: {
		mtplDataSets(o,n) {
			let index
			index = this.gMtplDataSetExists(DS_SHILLER_PE)
			if(index > -1) {
				this.shillerPESeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.value)}]
				this.shillerPEChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.date);
				this.shillerPEChartOpts.title.text = n[index].ds
			}
			index = this.gMtplDataSetExists(DS_SP500_PE)
			if(index > -1) {
				this.spPESeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.value)}]
				this.spPEChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.date);
				this.spPEChartOpts.title.text = n[index].ds
			}
			index = this.gMtplDataSetExists(DS_1YR_TREASURY_RATE)
			if(index > -1) {
				this.yr1TreasuryRateSeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.value)}]
				this.yr1TreasuryRateChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.date);
				this.yr1TreasuryRateChartOpts.title.text = n[index].ds
			}
			index = this.gMtplDataSetExists(DS_10YR_TREASURY_RATE)
			if(index > -1) {
				this.yr10TreasuryRateSeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.value)}]
				this.yr10TreasuryRateChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.date);
				this.yr10TreasuryRateChartOpts.title.text = n[index].ds
			}
		}
    },
	data() {
		return {
			shillerPESeries: null,
			shillerPEChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
			spPESeries: null,
			spPEChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
			yr1TreasuryRateSeries: null,
			yr1TreasuryRateChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
			yr10TreasuryRateSeries: null,
			yr10TreasuryRateChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
		}
	},
	mounted() {
		this.$store.dispatch("wscrape/getMtplData",{ds: DS_SHILLER_PE});
		this.$store.dispatch("wscrape/getMtplData",{ds: DS_SP500_PE})
		this.$store.dispatch("wscrape/getMtplData",{ds: DS_1YR_TREASURY_RATE})
		this.$store.dispatch("wscrape/getMtplData",{ds: DS_10YR_TREASURY_RATE})
	},
})


</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>