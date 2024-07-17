<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<div>
        	<!--div class="toolbar">
          		<button id="one_month" @click="updateData('one_month')" :class="{active: selection==='one_month'}">1M</button>
          		<button id="six_months" @click="updateData('six_months')" :class="{active: selection==='six_months'}">6M</button>
          		<button id="one_year" @click="updateData('one_year')" :class="{active: selection==='one_year'}">1Y</button>
				<button id="ytd" @click="updateData('ytd')" :class="{active: selection==='ytd'}">YTD</button>          
          		<button id="all" @click="updateData('all')" :class="{active: selection==='all'}">ALL</button>
        	</div-->
            <div id="mtpl-chart-timeline">
        		<apexchart type="line" height="300" ref="chart" :options="chartOptions" :series="series"></apexchart>
      		</div>
		</div>
	</a-card>
</template>

<script>
import { TOOLS_DISABLED } from '@/common/charts'

export default ({
	props: {
		historicalData: {
			type: Array,
			default: () => [],
		},
		historicalMA125Data: {
			type: Array,
			default: () => [],
		},
		score: { type: Number, default: 0.0 },
		rating: { type: String, default: ""}
	},
	components: {
	},
	computed : {
	},
	data() {
		return {
			series: [
				{name: "MM", data: this.historicalData},
				{name: "MA125", data: this.historicalMA125Data}
			],
			chartOptions: {
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true },
					toolbar: TOOLS_DISABLED,			
				},
        		title:{ text: `Title`},
			  	stroke: { curve: 'smooth',  width: 2},
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		min: new Date(this.historicalData[0][0]).getTime(),
              		tickAmount: 4,
            	},
            	tooltip: { x: { format: 'dd MMM yyyy' }},
			  	grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
			},
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