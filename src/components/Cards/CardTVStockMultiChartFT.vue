<template>
	<div>
		<div :id="chartId" style="width: 99%; height: 600px;"></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
import { genRndColor2 } from '@/common/fns.js'

export default ({
	props: {
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
				if(newVal.length === this.epics.length) {
					for(let i = 0; i < this.epics.length; i++) {
						switch(i) {
							case 0: 
								this.setChartSeries(this.lineSeries0,newVal[0].data,newVal[0].name)
							break;
							case 1: 
								this.setChartSeries(this.lineSeries1,newVal[1].data,newVal[1].name)
								break;
							case 2: 
								this.setChartSeries(this.lineSeries2,newVal[2].data,newVal[2].name)
								break;
							case 3: 
								this.setChartSeries(this.lineSeries3,newVal[3].data,newVal[3].name)
								break;
							case 4: 
								this.setChartSeries(this.lineSeries4,newVal[4].data,newVal[4].name)
								break;
							case 5: 
								this.setChartSeries(this.lineSeries5,newVal[5].data,newVal[5].name)
								break;
							case 6: 
								this.setChartSeries(this.lineSeries6,newVal[6].data,newVal[6].name)
								break;
							case 7: 
								this.setChartSeries(this.lineSeries7,newVal[7].data,newVal[7].name)
								break;
							case 8: 
								this.setChartSeries(this.lineSeries8,newVal[8].data,newVal[8].name)
								break;
						}
					}
					this.chart.timeScale().fitContent();
				}
			}
		}
	},	
	computed: {
		...mapState("ft", ["chartCache"]),
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
			lineSeries3,
			lineSeries4,
			lineSeries5,
			lineSeries6,
			lineSeries7,
			lineSeries8,
		}
	},
	beforeMount() {
    	this.chartId = `id-${this.epic}-${Math.random().toString(36).slice(2, 11)}`;
	},
	mounted() {
		this.$store.dispatch("ft/resetChartDataValues");

		const chartElement = document.getElementById(this.chartId);
	
		// Create the chart
		this.chart = createChart(chartElement, this.chartProperties)
				
		this.lineSeries0 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries1 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries2 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries3 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries4 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries5 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries6 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries7 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		this.lineSeries8 = this.chart.addLineSeries({color:genRndColor2(),lineWidth:1});
		
		for(let i = 0; i < this.epics.length; i++) {
			this.$store.dispatch("ft/getChartDataValues",{symbol: this.epics[i]});
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