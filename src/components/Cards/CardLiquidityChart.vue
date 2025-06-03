<template>
	<div>
		<div id="stockchartid-liqd" style="width: 99%; height: 600px;"></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
import { genRndColor2 } from '@/common/fns.js'

export default ({
	components: {
	},
	watch: {
		chartCache(newVal, oldVal) {
			if (newVal.length == 2) {
				this.setChartSeries(this.lineSeries0, newVal[0].data, newVal[0].expression, newVal[0].name)
				this.setChartSeries(this.lineSeries1, newVal[1].data, newVal[1].expression, newVal[1].name)

				this.chart.timeScale().fitContent();
			}
		},
	},
	computed: {
		...mapState("yahoo", ["chartCache"]),
	},
	data() {
		return {
			chart: null,
			chartId: null,
			chartProperties: {
				timeScale: { timeVisible: true, secondsVisible: false },
				layout: { backgroundColor: '#ffffff', textColor: '#333' },
				grid: { vertLines: { color: '#eeeeee', }, horzLines: { color: '#eeeeee', } },
				rightPriceScale: {
					visible: true, // Show right scale
					borderColor: '#cccccc'
				},
				leftPriceScale: {
					visible: true, // Show left scale
					borderColor: '#cccccc'
				}
			},

			lineSeries0: null,
			lineSeries1: null,
			lineSeries2: null,
			lineSeries3: null
		}
	},
	mounted() {
		const chartElement = document.getElementById('stockchartid-liqd');

		this.chart = createChart(chartElement, this.chartProperties)
		this.lineSeries0 = this.chart.addLineSeries({
			color: genRndColor2(),
			lineWidth: 1,
			priceScaleId: 'left'
		});
		this.lineSeries1 = this.chart.addLineSeries({
			color: genRndColor2(),
			lineWidth: 1,
			priceScaleId: 'right' // Use right scale for second series
		});

		let p = {
			expression: '',
			name: '',
			period1: '2000-01-01',
			period2: '2024-04-27',
			interval: '1mo'
		}
		p.name = 'Oil';
		p.expression = 'CL=F'; // Oil
		this.$store.dispatch("yahoo/getChartDataValues", p)

		p.name = 'Gold';
		p.expression = 'GC=F'; // Gold	
		this.$store.dispatch("yahoo/getChartDataValues", p)

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
			this.chart.remove();
		}
		window.removeEventListener('resize', this.handleResize);
	},
	methods: {
		setChartSeries(lineSeries, series, symbol, name) {
			lineSeries.setData(series);
			lineSeries.applyOptions({ title: name + "/" + symbol })
		}
	}
})

</script>