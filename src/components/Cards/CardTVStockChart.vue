<template>
	<div>
		<div id="stockchartid" style="width: 100%; height: 400px;"></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
export default ({
	components: {
	},
	watch: {
		chartData(newVal,oldVal) {
			console.log(newVal)
			this.candlestickSeries.setData(newVal.ohcl)


			this.smaSeries.setData(newVal.sma)
			this.chart.timeScale().fitContent();
		}
	},
	computed: {
		...mapState("fool", ["chartData"]),
	},
	data() {
		return {
			chart,
			candlestickSeries,
			smaSeries,
			// https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/customization.md#date-format
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			}
		}
	},
	mounted() {
		
		const chartElement = document.getElementById('stockchartid');
	
		// Create the chart
		// https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/customization.md#date-format
		this.chart = createChart(chartElement, this.chartProperties)

		// Create a line series and set initial data
		this.candlestickSeries = this.chart.addCandlestickSeries();
		this.smaSeries = this.chart.addLineSeries({color:'blue',lineWidth:1});

		/*
		candlestickSeries.setData([
			{
				time: '2018-12-19',
				open: 141.77,
				high: 170.39,
				low: 120.25,
				close: 145.72,
			},
			{
				time: '2018-12-20',
				open: 145.72,
				high: 147.99,
				low: 100.11,
				close: 108.19,
			},
			{
				time: '2018-12-21',
				open: 108.19,
				high: 118.43,
				low: 74.22,
				close: 75.16,
			},
			{
				time: '2018-12-22',
				open: 75.16,
				high: 82.84,
				low: 36.16,
				close: 45.72,
			},
			{ time: '2018-12-23', open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
			{
				time: '2018-12-24',
				open: 60.71,
				high: 60.71,
				low: 53.39,
				close: 59.29,
			},
			{ time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
			{
				time: '2018-12-26',
				open: 67.71,
				high: 105.85,
				low: 66.67,
				close: 91.04,
			},
			{ time: '2018-12-27', open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
			{
				time: '2018-12-28',
				open: 111.51,
				high: 142.83,
				low: 103.34,
				close: 131.25,
			},
			{
				time: '2018-12-29',
				open: 131.33,
				high: 151.17,
				low: 77.68,
				close: 96.43,
			},
			{
				time: '2018-12-30',
				open: 106.33,
				high: 110.2,
				low: 90.39,
				close: 98.1,
			},
			{
				time: '2018-12-31',
				open: 109.87,
				high: 114.69,
				low: 85.66,
				close: 111.26,
			},
		]);

		this.chart.timeScale().fitContent();
		*/

		//this.$store.dispatch("fool/getChartData",{symbol:"WTB"});
		//this.$store.dispatch("fool/getChartData",{symbol:"DEC"});
		this.$store.dispatch("fool/getChartData",{symbol:"DGE"});

  	},
  	beforeDestroy() {
		console.log("beforeDestroy")
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
  	},
})

</script>