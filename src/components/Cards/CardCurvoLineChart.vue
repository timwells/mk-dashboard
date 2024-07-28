<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<div id="chart">
            <div id="vix-chart-timeline">
        		<apexchart type="line" height="600" ref="chart" :options="chartOptions" :series="series"></apexchart>
      		</div>
		</div>
	</a-card>
</template>

<script>
import { TOOLS_DISABLED } from '@/common/charts'

export default ({
	props: {
		dataset: {
			type: Object,
			default: () => {},
		},
		//historicalData: {
		//	type: Array,
		//	default: () => [],
		//},
	},
	components: {
	},
	computed : {
	},
	data() {
		return {
			series: [
				// {name: "MM", data: this.historicalData},
				{name: this.dataset.name, data: this.dataset.data}
			],
			chartOptions: {
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true },
					toolbar: TOOLS_DISABLED,			
				},
        		title:{ text: this.dataset.name},
			  	stroke: { curve: 'smooth',  width: 2},
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		// min: new Date(this.historicalData[0][0]).getTime(),
              		tickAmount: 8,
            	},
            	tooltip: { x: { format: 'dd MMM yyyy' }},
			  	grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
			}
    	}
	},
    methods: {
	},
})
</script>