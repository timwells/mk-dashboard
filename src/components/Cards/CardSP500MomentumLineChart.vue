<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<div id="chart">
        	<!--div class="toolbar">
          		<button id="one_month" @click="updateData('one_month')" :class="{active: selection==='one_month'}">1M</button>
          		<button id="six_months" @click="updateData('six_months')" :class="{active: selection==='six_months'}">6M</button>
          		<button id="one_year" @click="updateData('one_year')" :class="{active: selection==='one_year'}">1Y</button>
				<button id="ytd" @click="updateData('ytd')" :class="{active: selection==='ytd'}">YTD</button>          
          		<button id="all" @click="updateData('all')" :class="{active: selection==='all'}">ALL</button>
        	</div-->
            <div id="vix-chart-timeline">
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
		historicalMA200Data: {
			type: Array,
			default: () => [],
		},
		historicalMA100Data: {
			type: Array,
			default: () => [],
		},
		historicalMA50Data: {
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
				{name: "MA200", data: this.historicalMA200Data},
				{name: "MA100", data: this.historicalMA100Data},
				{name: "MA50", data: this.historicalMA50Data}
			],
			chartOptions: {
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true },
					toolbar: TOOLS_DISABLED,			
				},
				/*
				annotations: {
					yaxis: [{
						y: 15,
						borderColor: '#00AF00',
						label: {
							borderColor: '#00AF00', borderWidth: 4,
							style: { color: '#fff', background: '#00AF00' },
							text: 'Low Volitilty'
						}
					  },{
						  y: 75,
						  borderColor: '#FF0000',
						  label: {
							  borderColor: '#FF0000', borderWidth: 4,
							  style: { color: '#fff', background: '#FF0000' },
							  text: 'Extreme Volitilty'
						  }
					}]
			  	},*/
        		title:{ text: `CNN SP500 Market Momentum - ${this.score.toFixed(2)} / ${this.rating}`},
			  	// stroke: { curve: 'smooth',  width: 2, colors:['#36454F', '#E91E63', '#9C27B0']},// colors: undefined }, // Allow colors to be defined in gradient
			  	stroke: { curve: 'smooth',  width: 2},
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		min: new Date(this.historicalData[0][0]).getTime(),
              		tickAmount: 4,
            	},
			    // yaxis: { min: 10, max: 80 },
            	tooltip: { x: { format: 'dd MMM yyyy' }},
			  	grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
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