<template>
	<div>
		<div :id="chartId" style="width: 99%; height: 600px;"></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
import { genRndColor } from '@/common/fns.js'

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
		chartCache(newVal, oldVal) {
			if(newVal !== null) {
				console.log("chartCache:",newVal.length)
				if(newVal.length === this.epics.length) {
					console.log("Charts Loaded:")
					for(let i = 0; i < this.epics.length; i++) {
						console.log(this.epics[i])
						switch(i) {
							case 0: 
								this.setChartSeries(this.lineSeries0,newVal[0].vs,newVal[0].symbol)
							break;
							case 1: 
								this.setChartSeries(this.lineSeries1,newVal[1].vs,newVal[1].symbol)
								break;
							case 2: 
								this.setChartSeries(this.lineSeries2,newVal[2].vs,newVal[2].symbol)
								break;
							case 3: 
								this.setChartSeries(this.lineSeries3,newVal[3].vs,newVal[3].symbol)
								break;
							case 4: 
								this.setChartSeries(this.lineSeries4,newVal[4].vs,newVal[4].symbol)
								break;
							case 5: 
								this.setChartSeries(this.lineSeries5,newVal[5].vs,newVal[5].symbol)
								break;
							case 6: 
								this.setChartSeries(this.lineSeries6,newVal[6].vs,newVal[6].symbol)
								break;
							case 7: 
								this.setChartSeries(this.lineSeries7,newVal[7].vs,newVal[7].symbol)
								break;
							case 8: 
								this.setChartSeries(this.lineSeries8,newVal[8].vs,newVal[8].symbol)
								break;
						}
					}
					this.chart.timeScale().fitContent();
				}
			}
		}
	},	
	computed: {
		...mapState("fool", ["chartCache"]),
	},
	data() {
		return {
			chart,
			chartId,
			arrCandlestickSeries: [],
			candlestickSeries1,
			candlestickSeries2,
			candlestickSeries,
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			},

			lineSeries1,
			lineSeries2,
			lineSeries3,
			lineSeries4,
			lineSeries5,
			lineSeries6,
			lineSeries7,
			lineSeries8,
		}
	},
	created() {
		// console.log("CardTVStockChart4.created")
	},
	beforeMount() {
		// console.log("CardTVStockChart4.beforeMount")
	    // Generate a unique ID when the component is created
    	this.chartId = `id-${this.epic}-${Math.random().toString(36).slice(2, 11)}`;
	},
	mounted() {
		this.$store.dispatch("fool/resetChartDataValues");

		const chartElement = document.getElementById(this.chartId);
	
		// Create the chart
		this.chart = createChart(chartElement, this.chartProperties)
				
		this.lineSeries0 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries1 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries2 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries3 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries4 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries5 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries6 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries7 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		this.lineSeries8 = this.chart.addLineSeries({color:genRndColor(),lineWidth:1});
		
		for(let i = 0; i < this.epics.length; i++) {
			this.$store.dispatch("fool/getChartDataValues",{symbol: this.epics[i]});
		}
  	},
  	beforeDestroy() {
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
  	},
	methods: {
		setChartSeries(lineSeries, series,symbol) {
			lineSeries.setData(series); 
			lineSeries.applyOptions({title: symbol})
		}
	}
})

</script>