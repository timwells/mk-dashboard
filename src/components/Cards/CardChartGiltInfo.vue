<template>
	<a-card hoverable style="padding: 2px;">
    	<a-card-meta :title='title'>
      		<template #description>ID: {{id}}</template>
    	</a-card-meta>
    	<template #cover>
			<img v-if="id.length>0" :src="url2" alt="Performance Chart" />
    	</template>
  	</a-card>
</template>

<script>
// import { mapState, mapGetters } from "vuex";
// https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=294258755&WIDTH=930&HEIGHT=330&IND_SPACING=36&IND_HEIGHT=130&TIME_SPAN=10Y&ID_NOTATION_COLOR1=25456b&XAXISCLOSECOL=0&XAXISCLOSE_COLORLIST=000099%3B990000%3B009900&HILOW_COLORLIST=5387db%3B5387db%3B&COPYRIGHT_TEXT_COLOR=999999&MOUNTAIN_ALPHA=62&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&TEXT_COLOR=666666&BACKGROUND_COLOR=FFFFFF&SUBSAMPLINGGRANULARITY=WEEK&ID_TYPE_SCALE_DATA=1&BENCHMARK_OWN_COORD=1&ID_TYPE_SCALE_AXIS=1&TYPE_CHART=LINE&LINE_WIDTH=1&LINE_WIDTH_BENCH=1&NOITNAV=1&DATE_START=&DATE_END=&TYPE_IND1=RSI&TYPE_IND1_PARAM1=period%3B14&TYPE_IND1_PARAM2=supportLinesUpper%3B50&TYPE_IND1_PARAM3=supportLinesLower%3B50&TYPE_IND1_PARAM4=undefined&TYPE_IND1_PARAM5=undefined&TYPE_IND1_COLORLIST=000000%3BFF0000%3BCCCCCC
// 
// https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=294258755&WIDTH=930&HEIGHT=330&IND_SPACING=36&IND_HEIGHT=130&TIME_SPAN=10Y&ID_NOTATION_COLOR1=25456b&XAXISCLOSECOL=1&XAXISCLOSE_COLORLIST=000099%3B990000%3B009900&HILOW_COLORLIST=5387db%3B5387db%3B&COPYRIGHT_TEXT_COLOR=999999&MOUNTAIN_ALPHA=62&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&TEXT_COLOR=666666&BACKGROUND_COLOR=FFFFFF&SUBSAMPLINGGRANULARITY=WEEK&ID_TYPE_SCALE_DATA=1&BENCHMARK_OWN_COORD=1&ID_TYPE_SCALE_AXIS=1&TYPE_CHART=CANDLE&LINE_WIDTH=1&LINE_WIDTH_BENCH=1&NOITNAV=1&DATE_START=&DATE_END=&CANDLE_COLORS=BF1F20%3B0000CC%3B5487BD&TYPE_IND1=RSI&TYPE_IND1_PARAM1=period%3B14&TYPE_IND1_PARAM2=supportLinesUpper%3B50&TYPE_IND1_PARAM3=supportLinesLower%3B50&TYPE_IND1_PARAM4=undefined&TYPE_IND1_PARAM5=undefined&TYPE_IND1_COLORLIST=000000%3BFF0000%3BCCCCCC&TYPE_UPPER_IND1=EMA&TYPE_UPPER_IND1_PARAM1=period%3B200&TYPE_UPPER_IND1_PARAM2=undefined&TYPE_UPPER_IND1_PARAM3=undefined&TYPE_UPPER_IND1_PARAM4=undefined&TYPE_UPPER_IND1_PARAM5=undefined&TYPE_UPPER_IND1_COLORLIST=FF9BF7


export default ({
	props: {
		title: { type: String, default: "", },
		id:    { type: String, default: "", }
	},
	computed: {
    	// ...mapState("funds", ["fundDetails"]),
		// ...mapGetters("funds",["gfundDetail"]),
	},
	data() { // 294258755
		return {
			url: `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=${this.id}&WIDTH=930&HEIGHT=330&IND_SPACING=36&IND_HEIGHT=130&TIME_SPAN=10Y&ID_NOTATION_COLOR1=25456b&XAXISCLOSECOL=0&XAXISCLOSE_COLORLIST=000099%3B990000%3B009900&HILOW_COLORLIST=5387db%3B5387db%3B&COPYRIGHT_TEXT_COLOR=999999&MOUNTAIN_ALPHA=62&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&TEXT_COLOR=666666&BACKGROUND_COLOR=FFFFFF&SUBSAMPLINGGRANULARITY=WEEK&ID_TYPE_SCALE_DATA=1&BENCHMARK_OWN_COORD=1&ID_TYPE_SCALE_AXIS=1&TYPE_CHART=LINE&LINE_WIDTH=1&LINE_WIDTH_BENCH=1&NOITNAV=1&DATE_START=&DATE_END=&TYPE_IND1=RSI&TYPE_IND1_PARAM1=period%3B14&TYPE_IND1_PARAM2=supportLinesUpper%3B50&TYPE_IND1_PARAM3=supportLinesLower%3B50&TYPE_IND1_PARAM4=undefined&TYPE_IND1_PARAM5=undefined&TYPE_IND1_COLORLIST=000000%3BFF0000%3BCCCCCC`,			
			url2: `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=${this.id}&WIDTH=930&HEIGHT=330&IND_SPACING=36&IND_HEIGHT=130&TIME_SPAN=10Y&ID_NOTATION_COLOR1=25456b&XAXISCLOSECOL=1&XAXISCLOSE_COLORLIST=000099%3B990000%3B009900&HILOW_COLORLIST=5387db%3B5387db%3B&COPYRIGHT_TEXT_COLOR=999999&MOUNTAIN_ALPHA=62&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&TEXT_COLOR=666666&BACKGROUND_COLOR=FFFFFF&SUBSAMPLINGGRANULARITY=WEEK&ID_TYPE_SCALE_DATA=1&BENCHMARK_OWN_COORD=1&ID_TYPE_SCALE_AXIS=1&TYPE_CHART=CANDLE&LINE_WIDTH=1&LINE_WIDTH_BENCH=1&NOITNAV=1&DATE_START=&DATE_END=&CANDLE_COLORS=BF1F20%3B0000CC%3B5487BD&TYPE_IND1=RSI&TYPE_IND1_PARAM1=period%3B14&TYPE_IND1_PARAM2=supportLinesUpper%3B50&TYPE_IND1_PARAM3=supportLinesLower%3B50&TYPE_IND1_PARAM4=undefined&TYPE_IND1_PARAM5=undefined&TYPE_IND1_COLORLIST=000000%3BFF0000%3BCCCCCC&TYPE_UPPER_IND1=EMA&TYPE_UPPER_IND1_PARAM1=period%3B200&TYPE_UPPER_IND1_PARAM2=undefined&TYPE_UPPER_IND1_PARAM3=undefined&TYPE_UPPER_IND1_PARAM4=undefined&TYPE_UPPER_IND1_PARAM5=undefined&TYPE_UPPER_IND1_COLORLIST=FF9BF7`,
			url3: `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_NOTATION=${this.id}&IND_SPACING=36&IND_HEIGHT=130&TIME_SPAN=10Y&ID_NOTATION_COLOR1=25456b&XAXISCLOSECOL=1&XAXISCLOSE_COLORLIST=000099%3B990000%3B009900&HILOW_COLORLIST=5387db%3B5387db%3B&COPYRIGHT_TEXT_COLOR=999999&MOUNTAIN_ALPHA=62&MOUNTAIN_COLOR1=a5b9d8&MOUNTAIN_COLOR2=c1cfe5&MOUNTAIN_COLOR3=c1cfe5&MOUNTAIN_COLOR4=ffffff&TEXT_COLOR=666666&BACKGROUND_COLOR=FFFFFF&SUBSAMPLINGGRANULARITY=WEEK&ID_TYPE_SCALE_DATA=1&BENCHMARK_OWN_COORD=1&ID_TYPE_SCALE_AXIS=1&TYPE_CHART=CANDLE&LINE_WIDTH=1&LINE_WIDTH_BENCH=1&NOITNAV=1&DATE_START=&DATE_END=&CANDLE_COLORS=BF1F20%3B0000CC%3B5487BD&TYPE_IND1=RSI&TYPE_IND1_PARAM1=period%3B14&TYPE_IND1_PARAM2=supportLinesUpper%3B50&TYPE_IND1_PARAM3=supportLinesLower%3B50&TYPE_IND1_PARAM4=undefined&TYPE_IND1_PARAM5=undefined&TYPE_IND1_COLORLIST=000000%3BFF0000%3BCCCCCC&TYPE_UPPER_IND1=EMA&TYPE_UPPER_IND1_PARAM1=period%3B200&TYPE_UPPER_IND1_PARAM2=undefined&TYPE_UPPER_IND1_PARAM3=undefined&TYPE_UPPER_IND1_PARAM4=undefined&TYPE_UPPER_IND1_PARAM5=undefined&TYPE_UPPER_IND1_COLORLIST=FF9BF7`
		}

	},
	methods: {
		// details(key) { return this.gfundDetail(key) }
	},
	mounted() {
	},
})
</script>

<style lang="scss">
img {
  transform: scale(0.95);
}

.price-divide {
    font-size: 1.3em;
    font-weight: bold;
    margin-right: 0.4em;
    padding-right: 0.4em;
    border-right: 0.13em solid #1e1d56;
}

</style>