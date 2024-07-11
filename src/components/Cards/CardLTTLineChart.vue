<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<div :id="id">
        	<apexchart type="line" height="300" ref="chart" :options="chartOptions" :series="series"></apexchart>
		</div>
		<!--pre>{{ series }}</pre-->
	</a-card>
</template>

<script>
import { TOOLS_DISABLED } from '@/common/charts'

export default ({
	props: {
		title: {
			type: String,
			default: "",
		},
		id: {
			type: String,
			default: "",
		},
		historicalData: {
			type: Array,
			default: () => [],
		},
		historicalMAData: {
			type: Array,
			default: () => [],
		},
	},
	components: {
	},
	computed : {
	},
	data() {
		return {
			series: [
				{name: "MM", data: this.historicalData},
				{name: "MA", data: this.historicalMAData}
			],
			chartOptions: { 
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true }, 
					toolbar: TOOLS_DISABLED,
				},
        		title:{ text: this.title},
			  	// stroke: { curve: 'smooth',  width: 2, colors:['#36454F', '#E91E63', '#9C27B0']},// colors: undefined }, // Allow colors to be defined in gradient
			  	stroke: { curve: 'smooth',  width: 1},
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		min:  new Date(this.historicalData[0][0]).getTime(),
              		tickAmount: 5,
            	},
			    // yaxis: { min: 10, max: 80 },
            	tooltip: { x: { format: 'dd MMM yyyy' }},
			  	grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}}
      		},
      		selection: 'one_year',
    	}
	},
    methods: {
    	updateData: function(timeline) {
            this.selection = timeline
        }
	},
	mounted() {
	}
})
</script>