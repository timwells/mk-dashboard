<template>
	  <div id="chart-container" ref="chartContainer" style="width: 100%; height: 500px;"></div>
</template>
  
<script>
import { createChart } from 'lightweight-charts';
  
export default {
	name: 'Chart',

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

			handleResize: null,
		}
	},
	mounted() {
		// Initialize chart
		const chart = createChart(this.$refs.chartContainer, {
			width: this.$refs.chartContainer.offsetWidth,
			height: 500,
			layout: {
				backgroundColor: '#FFFFFF',
				textColor: '#000',
			},
			grid: {
				vertLines: { color: '#EAEAEA' },
				horzLines: { color: '#EAEAEA' },
			},
		});

		// Add multiple Monte Carlo simulation lines
		const simulations = 10;
		for (let i = 0; i < simulations; i++) {
			const lineSeries = chart.addLineSeries({
				color: this.getRandomColor(), // Unique color
				lineWidth: 1,
			});
			lineSeries.setData(this.generateMonteCarloData(30, 2020)); // Generate random data for 30 years starting from 2020
		}

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
	methods: {
		getRandomColor() {
			const r = Math.floor(Math.random() * 256); // Random red (0-255)
			const g = Math.floor(Math.random() * 256); // Random green (0-255)
			const b = Math.floor(Math.random() * 256); // Random blue (0-255)
			return `rgb(${r}, ${g}, ${b})`; // Return as an RGB string
		},
		generateMonteCarloData(years, startYear) {
			const data = [];
			let value = 100; // Starting point for the simulation
			for (let i = 0; i < years; i++) {
				value += (Math.random() - 0.5) * 10; // Random walk
				data.push({ time: `${startYear + i}-12-31`, value }); // Use year as time
			}
			return data;
		},
	},
};
</script>

<style scoped>
#chart-container {
margin: 0 auto;
}
</style>
  