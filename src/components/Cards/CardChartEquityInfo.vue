<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}}</h6>
					<p>{{ticker}}</p>					
					<img v-if="ticker.length>1" :src="url3" alt="Performance Chart" height="230" width="100%"/>
				</div>
			</a-col>
		</a-row>
	</a-card>
</template>

<script>
const HOST_PATH = 'https://chart.hl.co.uk/charts/chart.jsproto_large.chart'
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
			url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,
			url2: `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_SEDOL=${this.ticker}&WIDTH=737&HEIGHT=278&TIME_SPAN=5Y&SUBSAMPLINGGRANULARITY=DAY&XAXISCLOSECOL=0&LINE_WIDTH=1&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&ID_NOTATION_COLOR1=25456b`,
			url3: `${HOST_PATH}?ID_SEDOL=${this.ticker}&TIME_SPAN=5Y&SUBSAMPLINGGRANULARITY=DAY`
		}
	},
	methods: {
	}		
})
</script>