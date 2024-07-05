<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<div id="chart">
        	<apexchart type="line" height="300" ref="chart" :options="chartOptions" :series="series"></apexchart>
		</div>
	</a-card>
</template>

<script>

export default ({
	props: {
		title: {
			type: String,
			default: "",
		},
		historicalData: {
			type: Array,
			default: () => [],
		},
		historicalMA125Data: {
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
				{name: "MA125", data: this.historicalMA125Data}
			],
			chartOptions: { 
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true } 
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
        		title:{ text: this.title},
			  	stroke: { curve: 'smooth',  width: 2, colors:['#36454F', '#E91E63', '#9C27B0']},// colors: undefined }, // Allow colors to be defined in gradient
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		min:  new Date(this.historicalData[0][0]).getTime(),
              		tickAmount: 2,
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