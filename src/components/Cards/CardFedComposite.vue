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

/*
[
{name: this.dataset.name, data: this.dataset.data}
]
*/
export default ({
	props: {
		dataset: {
			type: Array,
			default: () => [],
        }
	},
	components: {
	},
	computed : {
	},
	data() {
		return {
			series: this.dataset,
			chartOptions: {
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300,
					zoom: {
						type: 'x',
						enabled: true,
						autoScaleYaxis: true
					},
					toolbar: {
						autoSelected: 'zoom'
					}					
					// toolbar: TOOLS_DISABLED,			
				},
        		title:{ text: this.title()},
			  	stroke: { curve: 'smooth',  width: 1},
            	dataLabels: { enabled: false },
            	markers: { size: 0, style: 'hollow' },
            	xaxis: {
              		type: 'datetime',
              		tickAmount: 6,
            	},
            	tooltip: { x: { format: 'dd MMM yyyy' }},
			  	grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}},
			}
    	}
	},
    methods: {
        title() {
            let _title = ""
            for(let i = 0; i < this.dataset.length; i++) {
                if(_title.length > 0) _title += " / "
                _title += this.dataset[i].name
            }
            return _title
        }
	},
})
</script>
