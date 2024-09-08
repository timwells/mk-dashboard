<template>
	<div :id="chartId" style="width: 99%; height: 800px;"></div>
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
			if(newVal != null) {
				console.log(newVal)

				this.candlestickSeries.setData(newVal.ohcl)

				this.sma20Series.setData(newVal.ta.find(e => e.name == "sma-20").series)
				this.sma50Series.setData(newVal.ta.find(e => e.name == "sma-50").series)
				this.sma75Series.setData(newVal.ta.find(e => e.name == "sma-75").series)
				this.sma100Series.setData(newVal.ta.find(e => e.name == "sma-100").series)
				this.sma125Series.setData(newVal.ta.find(e => e.name == "sma-125").series)
				this.sma150Series.setData(newVal.ta.find(e => e.name == "sma-150").series)
				this.sma175Series.setData(newVal.ta.find(e => e.name == "sma-175").series)
				this.sma200Series.setData(newVal.ta.find(e => e.name == "sma-200").series)
				this.sma225Series.setData(newVal.ta.find(e => e.name == "sma-225").series)
				this.sma250Series.setData(newVal.ta.find(e => e.name == "sma-250").series)

				this.ema10Series.setData(newVal.ta.find(e => e.name == "ema-10").series)
			
				// this.vwapSeries.setData(newVal.vwap)
				const volMap = newVal.vol.map((v) => ({ 
						time: v.time, 
						value: v.value, 
						color: (v.direction == 1 ? 'green' : (v.direction == -1) ? 'red': 'grey')	  
				}))

				console.log(volMap)				
				
				this.volSeries.setData(volMap)

				this.chart.timeScale().fitContent();
			}
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
			sma20Series,
			sma50Series,
			sma75Series,
			sma100Series,
			sma125Series,
			sma150Series,
			sma175Series,
			sma200Series,
			sma225Series,
			sma250Series,

			ema10Series,
			// vwapSeries,
			volSeries,
			// https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/customization.md#date-format
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			}
		}
	},
	created() {
	},
	beforeMount() {
	    // Generate a unique ID when the component is created
    	this.chartId = `id-${this.epic}-${Math.random().toString(36).slice(2, 11)}`;		
	},
	mounted() {
		const chartElement = document.getElementById(this.chartId);
	
		// Create the chart
		this.chart = createChart(chartElement, this.chartProperties)

		// Create a line series and set initial data
		this.candlestickSeries = this.chart.addCandlestickSeries();
		this.sma20Series = this.chart.addLineSeries({color:'red',lineWidth:1,title:"sma-20"});
		this.sma50Series = this.chart.addLineSeries({color:'green',lineWidth:1,title:"sma-50"});
		this.sma75Series = this.chart.addLineSeries({color:'blue',lineWidth:1,title:"sma-75"});
		this.sma100Series = this.chart.addLineSeries({color:'orange',lineWidth:1,title:"sma-100"});
		this.sma125Series = this.chart.addLineSeries({color:'purple',lineWidth:1,title:"sma-125"});
		this.sma150Series = this.chart.addLineSeries({color:'yellow',lineWidth:1,title:"sma-150"});
		this.sma175Series = this.chart.addLineSeries({color:'cyan',lineWidth:1,title:"sma-175"});
		this.sma200Series = this.chart.addLineSeries({color:'magenta',lineWidth:1,title:"sma-200"});
		this.sma225Series = this.chart.addLineSeries({color:'teal',lineWidth:1,title:"sma-225"});
		this.sma250Series = this.chart.addLineSeries({color:'black',lineWidth:2,title:"sma-250"});

		this.ema10Series = this.chart.addLineSeries({color:'brown',lineWidth:2,title:"ema-10"});

		// this.vwapSeries = this.chart.addLineSeries({color:'black',lineWidth:1,title:"vwap"});
		this.volSeries = this.chart.addHistogramSeries({
			color: '#2196F3', // Blue color for histogram bars
    		lineWidth: 2,
    		priceFormat: {type: 'volume'},
    		overlay: false, // Allows histogram to overlay on candlestick series

			priceScaleId: 'left', // Use the left price scale
            scaleMargins: {
                top: 0.7, // Push the histogram to the bottom
                bottom: 0,
            },
		})

		this.$store.dispatch("fool/getChartData",{symbol:this.epic});
  	},
  	beforeDestroy() {
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
  	},
})

</script>