<template>
	<div :id="chartId" style="width: 99%; height: 560px;"></div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
export default ({
	props: {
		epic: {
			type: String,
			default: null,
		}
	},
	components: {
	},
	watch: {
		chartData(newVal,oldVal) {
			// console.log(newVal)
			this.candlestickSeries.setData(newVal.ohcl)
			this.smaSeries.setData(newVal.sma)
			this.emaSeries.setData(newVal.ema)

			this.chart.timeScale().fitContent();
		}
	},
	computed: {
		...mapState("fool", ["chartData"]),
	},
	data() {
		return {
			chart,
			chartId,
			candlestickSeries,
			smaSeries,
			emaSeries,
			// https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/customization.md#date-format
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			}
		}
	},
	created() {
		console.log("created")
	    // Generate a unique ID when the component is created
    	// this.chartId = `id-${this.epic}-${Math.random().toString(36).slice(2, 11)}`;
	},
	beforeMount() {
		console.log("beforeMount")
	    // Generate a unique ID when the component is created
    	this.chartId = `id-${this.epic}-${Math.random().toString(36).slice(2, 11)}`;		
	},
	mounted() {
		console.log("mounted")

		console.log(this.chart)
		const chartElement = document.getElementById(this.chartId);
		console.log(chartElement)
	
		// Create the chart
		this.chart = createChart(chartElement, this.chartProperties)
		console.log(this.chart)

		// Create a line series and set initial data
		this.candlestickSeries = this.chart.addCandlestickSeries();
		this.smaSeries = this.chart.addLineSeries({color:'blue',lineWidth:1,title:"sma-50"});
		this.emaSeries = this.chart.addLineSeries({color:'green',lineWidth:1,title:"ema-10"});

		this.$store.dispatch("fool/getChartData",{symbol:this.epic});
  	},
  	beforeDestroy() {
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
  	},
})

</script>