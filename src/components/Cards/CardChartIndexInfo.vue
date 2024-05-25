<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}}</h6>
					<p>{{ticker}}</p>					
					<img v-if="ticker.length>1" :src="url" alt="Performance Chart"  height="280" width="98%"/>
				</div>
				<!--div class="card-footer">
					<span>Prices as at 31 May 2022</span>
				</div-->
			</a-col>
		</a-row>
	</a-card>
</template>

<script>

// https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=15236761&XAXISCLOSECOL=0&LINE_WIDTH=1&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&ID_NOTATION_COLOR1=25456b&TIME_SPAN=10Y&SUBSAMPLINGGRANULARITY=DAY&WIDTH=520&HEIGHT=260

// https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=15236761&TIME_SPAN=10Y&SUBSAMPLINGGRANULARITY=DAY&WIDTH=520&HEIGHT=260

//&XAXISCLOSECOL=0&LINE_WIDTH=1&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&ID_NOTATION_COLOR1=25456b
//&TIME_SPAN=10Y&SUBSAMPLINGGRANULARITY=DAY&WIDTH=520&HEIGHT=260

	export default ({
		props: {
			title: {
				type: String,
				default: "",
			},
			ticker: {
				type: String,
				default: "",
			}
		},
		computed: {
			chartUrl() {
			}
		},
		data() {
			return {
				url: `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?INDEX=${this.ticker}&XAXISCLOSECOL=0&LINE_WIDTH=1&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&ID_NOTATION_COLOR1=25456b&TIME_SPAN=10Y&SUBSAMPLINGGRANULARITY=DAY&WIDTH=460&HEIGHT=230`
			}
		},
		methods: {
		}		
	})
</script>