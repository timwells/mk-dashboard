<template>
	<a-card :bordered="false" class="dashboard-bar-line header-solid">
        <div :id="id">
            <div id="vix-chart-timeline">
        		<apexchart 
					type="line" 
					height="600" 
					:ref="id" 
					:options="chartOptions" 
					:series="series">
				</apexchart>
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
		id : {
			type: String,
			default: "chart",
		},
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
			theme: {
				mode: 'dark',  // Set theme mode to 'dark'. Options: 'light', 'dark'
				palette: 'palette6',  // Choose a predefined color palette. Options: 'palette1', 'palette2', etc.
				monochrome: {
					enabled: false,  // Enable monochrome theme
					color: '#255aee',  // Base color for monochrome
					shadeTo: 'light',  // Shade to 'light' or 'dark'
					shadeIntensity: 0.65  // Intensity of shading (0 to 1)
				}
			},
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
