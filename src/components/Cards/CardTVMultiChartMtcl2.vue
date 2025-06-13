<template>
	<div>
		<h4>Depletion Probability: {{ probabilityOfDepletion }}%, Average Years Lasted: {{ averageYearsLasted }}</h4>
		<div id="chart-container" ref="chartContainer" style="width: 100%; height: 500px;"></div>
	</div>
</template>
  
<script>
import { createChart } from 'lightweight-charts';
  
export default {
	name: 'CardTVMultiChartMtcl2',
	props: {
		datasets: {
			type: Array,
			default: () => [],
		},
		probabilityOfDepletion : {
			type: Number,
			default: 0.0,
		},
		averageYearsLasted: {
			type: Number,
			default: 1,
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
			timeScale: {
        		leftOffset: -2, // Reduce this value to bring the timeline closer to the left
        		barSpacing: 45,
        		fixLeftEdge: true,
    		},
		});

		// Add multiple Monte Carlo simulation lines
		for (let i = 0; i < this.datasets.length; i++) {
			console.log(this.datasets[i].dv)
			const lineSeries = chart.addLineSeries({
				color: this.getRandomColor(), // Unique color
				lineWidth: 1,
			});
			lineSeries.setData(this.datasets[i].dv); 
		}

		// Handle resizing
		window.addEventListener('resize', () => {
			chart.resize(this.$refs.chartContainer.offsetWidth, 500);
		});
	},
	beforeDestroy() {
		if (this.chart) {
			this.chart.remove();
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
  