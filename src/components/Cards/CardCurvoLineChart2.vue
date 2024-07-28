<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<div id="chart">
            <div id="vix-chart-timeline">
        		<apexchart ref="chart" type="line" height="500" :options="chartOptions" :series="series"></apexchart>
      		</div>
			<!--pre>{{ datasets }}</pre-->
		</div>
	</a-card>
</template>

<script>
import { TOOLS_DISABLED } from '@/common/charts'
import { mapState } from "vuex";

export default ({
	props: {
		//datasets: {
		//	type: Array,
		//	default: () => [],
		//},
	},
	components: {},
	watch: {
		datasets(n,o) {
			this.$refs.chart.updateSeries(n);
		}
	},
	computed : {
    	...mapState("curvo", [,"datasets"]),
	},
	data() {
		return {
			series: [],
			chartOptions: {
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true },
					toolbar: TOOLS_DISABLED,			
				},
        		title:{ text: "compounded"},
			  	stroke: { curve: 'smooth',  width: 2},
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		tickAmount: 4,
            	},
            	tooltip: { x: { format: 'dd MMM yyyy' }},
			  	grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
			}
    	}
	},
    methods: {
		update2() {
	      console.log('Update');
    	}
	},
})
</script>