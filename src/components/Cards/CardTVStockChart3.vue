<template>
	<div :id="chartId" style="width: 99%; height: 600px;"></div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
export default ({
	props: {
		epic: {
			type: String,
			default: null,
		},
		epics: {
			type: Array,
			default: () => [],
		}
	},
	components: {
	},
	watch: {
		chartData2(newVal,oldVal) {
			console.log(newVal)
			if(newVal != null) {
				this.candlestickSeries.setData(newVal.ohcl)
				this.chart.timeScale().fitContent();
			}
		}
	},
	computed: {
		...mapState("fool", ["chartData2"]),
	},
	data() {
		return {
			chart,
			chartId,
			candlestickSeries,
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			}
		}
	},
	created() {
		console.log("CardTVStockChart3.created")
	},
	beforeMount() {
		console.log("CardTVStockChart3.beforeMount")
	    // Generate a unique ID when the component is created
    	this.chartId = `id-${this.epic}-${Math.random().toString(36).slice(2, 11)}`;
		console.log(this.chartId)	
	},
	mounted() {
		console.log("CardTVStockChart3.mounted")

		const chartElement = document.getElementById(this.chartId);
	
		// Create the chart
		this.chart = createChart(chartElement, this.chartProperties)

		// Create a line series and set initial data
		this.candlestickSeries = this.chart.addCandlestickSeries();

		this.$store.dispatch("fool/getChartData2",{symbol: this.epic});
  	},
  	beforeDestroy() {
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
  	},
})

</script>