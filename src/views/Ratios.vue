<template>
	<div>
		<apexchart v-if="series!=null" :options="chartOptions" :series="series"></apexchart>
	</div>
	<!--a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<apexchart v-if="series!=null" height="auto" :options="chartOptions" :series="series"></apexchart>
				</div>
			</a-col>
		</a-row>
	</a-card-->
</template>

<script>
import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["mtplData"]),
	},
	watch: {
		mtplData(o,n) {
			this.series = [{ name: n[0].rows.ds, data: n[0].rows.map(e => e.value)}]
			this.chartOptions.xaxis.categories = n[0].rows.map((e,i) => ((i % 4) == 0 ? "": e.date));
		}
        // values(o,n) { if(o) this.updateChart() },
        // categories(o,n) { if(o) this.updateChart() },
    },
	data() {
		return {
			series: null,
			chartOptions: {
				chart: { height: 100, type: 'line', zoom: { enabled: false } },
				dataLabels: { enabled: false },
				stroke: { curve: 'straight' },
				title: { text: '', align: 'left' },
                stroke: { curve: 'straight',  width: 1 },
				grid: {
					row: {
						colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
						opacity: 0.5
					},
				},
				xaxis: { categories: null }
			},
			testSeries: [{name: "Desktops",data: [10, 41, 35, 51, 49, 62, 69, 91, 148]}],
			testChartOptions: {
				chart: { height: 400, type: 'line', zoom: { enabled: false }},
				dataLabels: { enabled: false },
				stroke: { curve: 'straight'},
				title: { text: 'Product Trends by Month',align: 'left' },
				grid: {
					row: {
						colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
						opacity: 0.5
					},
				},
				xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],}
	        }
		}
	},
	mounted() {
		this.$store.dispatch("wscrape/getMtplData",{ds:"shiller-pe/table/by-month"});
	},
})


</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>