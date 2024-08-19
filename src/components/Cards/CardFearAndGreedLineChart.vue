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

			<div class="toolbar"></div>	
            <div v-if="historicalData!=null" id="fandg-chart-timeline">
        		<apexchart type="line" height="300" ref="chart" :options="chartOptions" :series="series"></apexchart>
      		</div>
			<!--p>
				<small>
				It’s useful to look at stock market levels compared to where they’ve been over the past few months. When the S&P 500 is above its moving or rolling average of the prior 125 trading days, that’s a sign of positive momentum. But if the index is below this average, it shows investors are getting skittish. The Fear & Greed Index uses slowing momentum as a signal for Fear and a growing momentum for Greed.
				</small>
			</p-->
		</div>
	</a-card>
</template>

<script>
// https://apexcharts.com/javascript-chart-demos/area-charts/datetime-x-axis/
import { TOOLS_DISABLED } from '@/common/charts'

export default ({
	props: {
		historicalData: { type: Array, default: () => [], },
		score: { type: Number, default: 0.0 },
		rating: { type: String, default: ""}
	},
	components: {
	},
	computed : {
	},
	data() {
		return {
			series: [{name: "F&G", data: this.historicalData}],
			chartOptions: { 
				chart: { 
					id: 'area-datetime', 
					type: 'line', 
					height: 300, 
					zoom: { autoScaleYaxis: true },
					toolbar: TOOLS_DISABLED,
				},
				tools: {
					download: true,
					selection: true,
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: false,
		        },
				annotations: {
					yaxis: [{
						y: 15,
						borderColor: '#FF0000',
						label: {
							borderColor: '#FF0000', borderWidth: 4,
							style: { color: '#fff', background: '#FF0000' },
							text: 'Ex.Fear'
						}
					},{
						y: 85,
						borderColor: '#00AF00',
						label: {
							borderColor: '#00AF00', borderWidth: 4,
							style: { color: '#fff', background: '#00AF00' },
							text: 'Ex.Greed'
						}
					}
				]
			},
			title:{ text: `CNN Fear & Greed - ${this.score.toFixed(2)} / ${this.rating}`},
			// stroke: { curve: 'smooth',  width: 2, colors:['#36454F', '#E91E63', '#9C27B0']},// colors: undefined }, // Allow colors to be defined in gradient
			stroke: { curve: 'smooth',  width: 2},// colors:['#36454F', '#E91E63', '#9C27B0']},// colors: undefined }, // Allow colors to be defined in gradient
            dataLabels: { enabled: false },
            markers: { size: 0, style: 'hollow' },
            xaxis: {
              type: 'datetime',
              min: new Date(this.historicalData[0][0]).getTime(),
              tickAmount: 4,
            },
			yaxis: {
          		min: 0,
          		max: 100
        	},
            tooltip: { x: { format: 'dd MMM yyyy' }},
			grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}}
          },
          selection: 'one_year',
    	}
	},
    methods: {
    	updateData: function(timeline) {
            this.selection = timeline
			/*
            switch (timeline) {
              case 'one_month':
                this.$refs.chart.zoomX(
                  new Date('28 Jan 2013').getTime(),
                  new Date('27 Feb 2013').getTime()
                )
                break
              case 'six_months':
                this.$refs.chart.zoomX(
                  new Date('27 Sep 2012').getTime(),
                  new Date('27 Feb 2013').getTime()
                )
                break
              case 'one_year':
                this.$refs.chart.zoomX(
                  new Date('27 Feb 2012').getTime(),
                  new Date('27 Feb 2013').getTime()
                )
                break
              case 'ytd':
                this.$refs.chart.zoomX(
                  new Date('01 Jan 2013').getTime(),
                  new Date('27 Feb 2013').getTime()
                )
                break
              case 'all':
                this.$refs.chart.zoomX(
                  new Date('23 Jan 2012').getTime(),
                  new Date('27 Feb 2013').getTime()
                )
                break
              default:
            }
			  */
        }
	},
	mounted() {
		// console.log("mounted:",this.historicalData)
		//this.$store.dispatch("cnn/getSentiment");
	}
})
</script>