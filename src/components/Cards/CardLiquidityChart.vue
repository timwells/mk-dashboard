<template>
	<div>
		<div id="stockchartid" style="width: 100%; height: 600px;"></div>
	</div>
</template>

<script>
//import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';


// https://charts.bgeometrics.com/files/addresses_active_btc_price.json
// https://charts.bgeometrics.com/files/addresses_active.json
export default ({
	components: {
	},
    /*
	watch: {
		chartData(newVal,oldVal) {
			this.candlestickSeries.setData(newVal.ohcl)
			this.smaSeries.setData(newVal.sma)
			
			this.chart.timeScale().fitContent();
		}
	},
	computed: {
		...mapState("fool", ["chartData"]),
	},
    */
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
		//this.smaSeries = this.chart.addLineSeries({color:'blue',lineWidth:1});

		//this.$store.dispatch("fool/getChartData",{symbol:"WTB"});
		//this.$store.dispatch("fool/getChartData",{symbol:"DEC"});
		//this.$store.dispatch("fool/getChartData",{symbol:"DGE"});
		// this.$store.dispatch("fool/getChartData",{symbol:"PRU"});

  	},
  	beforeDestroy() {
    	//if (this.chart) {
      	//	this.chart.remove(); // Clean up the chart on component destruction
    	//}
  	},
})

</script>