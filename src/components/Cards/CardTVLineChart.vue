<template>
	<div :id="chartId" style="width: 99%; height: 560px;"></div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
export default ({
	components: {
	},
	watch: {
		mymapfunds(newVal,oldVal) {
			this.myMap3.setData(newVal[0].data)
			this.myMap3.applyOptions({title:newVal[0].name})

			this.myMap4.setData(newVal[1].data)
			this.myMap4.applyOptions({title:newVal[1].name})

			this.myMap5.setData(newVal[2].data)
			this.myMap5.applyOptions({title:newVal[2].name})

			this.myMap6.setData(newVal[3].data)
			this.myMap6.applyOptions({title:newVal[3].name})

			this.myMap7.setData(newVal[4].data)
			this.myMap7.applyOptions({title:newVal[4].name})

			this.lindT.setData(newVal[5].data)
			this.lindT.applyOptions({title:newVal[5].name})
			
			this.chart.timeScale().fitContent();
		}
	},
	computed: {
		...mapState("ft", ["mymapfunds"]),
	},
	data() {
		return {
			chart,
			chartId,
			candlestickSeries,
			smaSeries,
			emaSeries,
			myMap3,
			myMap4,
			myMap5,
			myMap6,
			myMap7,
			lindT,		
			// https://github.com/tradingview/lightweight-charts/blob/v2.0.0/docs/customization.md#date-format
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false},
				layout: { backgroundColor: '#ffffff',textColor: '#333'},
				grid: { vertLines: {color: '#eeeeee',},horzLines: {color: '#eeeeee',}},
			},
			handleResize: null,
		}
	},
	created() {
	},
	beforeMount() {
	    // Generate a unique ID when the component is created
    	this.chartId = `id-tvc-${Math.random().toString(36).slice(2, 11)}`;		
	},
	mounted() {
		const chartElement = document.getElementById(this.chartId);
	
		// Create the chart
		this.chart = createChart(chartElement, this.chartProperties)

		// Create a line series and set initial data
		this.myMap3 = this.chart.addLineSeries({color:'purple',lineWidth:1,title:"myMap3"});
		this.myMap4 = this.chart.addLineSeries({color:'blue',lineWidth:1,title:"myMap4"});
		this.myMap5 = this.chart.addLineSeries({color:'orange',lineWidth:1,title:"myMap5 ESG"});
		this.myMap6 = this.chart.addLineSeries({color:'green',lineWidth:1,title:"myMap6"});
		this.myMap7 = this.chart.addLineSeries({color:'red',lineWidth:1,title:"myMap7"});
		this.lindT = this.chart.addLineSeries({color:'black',lineWidth:1,title:"lindsT"});

		this.$store.dispatch("ft/getMyMapfunds");

		// Handle window resize
		this.handleResize = () => {
			if (this.chart && chartElement) {
				this.chart.resize(chartElement.clientWidth, chartElement.clientHeight);
			}
		};

		window.addEventListener('resize', this.handleResize);
		// Initial resize to fit container
		this.handleResize();
	},
	beforeDestroy() {
    	if (this.chart) {
      		this.chart.remove(); // Clean up the chart on component destruction
    	}
		window.removeEventListener('resize', this.handleResize);
  	},
})

</script>