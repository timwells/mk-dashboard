<template>
	<div>
		<div id="stockchartid-liqd" style="width: 100%; height: 600px;"></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
import { genRndColor2 } from '@/common/fns.js'

// https://charts.bgeometrics.com/files/addresses_active_btc_price.json
// https://charts.bgeometrics.com/files/addresses_active.json
export default ({
	components: {
	},
	watch: {
		chartCache(newVal,oldVal) {		
			// console.log("newVal",newVal.length);
			if(newVal.length == 1) {
				this.setChartSeries(this.lineSeries0,newVal[0].data,newVal[0].expression)
				// this.setChartSeries(this.lineSeries1,newVal[1].data,newVal[1].expression)

				this.chart.timeScale().fitContent();
			}
		},
	},
	computed: {
		...mapState("yahoo", ["chartCache"]),
	},
	data() {
		return {
			chart,
			chartId,
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			},

			lineSeries1,
			lineSeries2,
			lineSeries3
		}
	},
	mounted() {
		const chartElement = document.getElementById('stockchartid-liqd');
	
		// Create the chart
		// https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/customization.md#date-format
		this.chart = createChart(chartElement, this.chartProperties)
		this.lineSeries0 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries1 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		//this.lineSeries2 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});

		//this.$store.dispatch("bge/getChartDataValues",{path:"btc_yf.json"});
		//this.$store.dispatch("bge/getChartDataValues",{path:"m2.json"});
		let p = {
			expression:'',
			period1:'2009-01-01',
			period2:'2024-04-27',
			interval:'1mo'
		}
		// p.expression = 'GC=F'
		//this.$store.dispatch("yahoo/getChartDataValues",p)
		//p.expression = '^DJI'
		//this.$store.dispatch("yahoo/getChartDataValues",p)

		// p.expression = '^DJI/GC=F'
		p.expression = '^DJI/BTC-USD'
		this.$store.dispatch("yahoo/getChartDataValues",p)
  	},
  	beforeDestroy() {
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
  	},
	methods: {
		setChartSeries(lineSeries,series,symbol) {
			lineSeries.setData(series); 
			lineSeries.applyOptions({title: symbol})
		}
	}
})

</script>