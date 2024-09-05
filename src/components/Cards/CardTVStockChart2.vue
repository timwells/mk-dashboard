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
			if(newVal != null) {
				this.candlestickSeries.setData(newVal.ohcl)
				this.sma50Series.setData(newVal.ta.find(e => e.name == "sma-50").series)
				this.sma100Series.setData(newVal.ta.find(e => e.name == "sma-100").series)
				this.sma200Series.setData(newVal.ta.find(e => e.name == "sma-200").series)

				this.ema10Series.setData(newVal.ta.find(e => e.name == "ema-10").series)
			
				// this.vwapSeries.setData(newVal.vwap)
				console.log(newVal.vol)
				this.volSeries.setData(newVal.vol.map((v) => ({ 
						time: v.time, 
						value: v.value, 
						color: (v.direction == 1 ? 'green' : (v.direction == -1) ? 'red': 'grey')	  
				})))


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
			sma50Series,
			sma100Series,
			sma200Series,
			ema10Series,
			vwapSeries,
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
		this.sma50Series = this.chart.addLineSeries({color:'blue',lineWidth:1,title:"sma-50"});
		this.sma100Series = this.chart.addLineSeries({color:'red',lineWidth:1,title:"sma-100"});
		this.sma200Series = this.chart.addLineSeries({color:'orange',lineWidth:1,title:"sma-200"});
		this.ema10Series = this.chart.addLineSeries({color:'green',lineWidth:1,title:"ema-10"});
		// this.vwapSeries = this.chart.addLineSeries({color:'black',lineWidth:1,title:"vwap"});
		// this.volSeries = this.chart.addHistogramSeries({overlay: true});
		this.volSeries = this.chart.addHistogramSeries({
			color: '#2196F3', // Blue color for histogram bars
    		lineWidth: 2,
    		priceFormat: {
    			type: 'volume',
    		},
    		// overlay: true, // Allows histogram to overlay on candlestick series

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