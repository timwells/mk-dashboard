<template>
	<div>
		<a-row v-if="cmvModels.length>0" :gutter="24" type="flex" align="stretch">
        	<a-col :span="24" :lg="24" :xl="24" class="mb-24" 
				v-for="(cmvModel, index) in cmvModels" :key="index">
				<CardIndicatorInfo 
					:url="cmvModel"
					type="img"
					height="500"/>
        	</a-col>
		</a-row>
		<a-row>
        	<a-col :span="24" :lg="24" :xl="24" class="mb-24" 
				v-for="(indicator, index) in indicators" :key="index">
            	<CardIndicatorInfo :title="indicator.title" 
					:url="indicator.url" :type="indicator.type"
					:height="indicator.height"/>
        	</a-col>
		</a-row>
		<CardIndicatorInfo 
			url="https://www.isabelnet.com/wp-content/uploads/2020/11/Fear-Greed-Index-Investor-Sentiment.png"
			type="img"
			height="500"/>
	</div>
</template>

<script>
import { mapState } from "vuex";
import CardIndicatorInfo from '@/components/Cards/CardIndicatorInfo';

export default ({
	components: {
		CardIndicatorInfo
	},
	computed: {
    	...mapState("wscrape", ["cmvModels"])	
	},
	watch: {
    },
	data() {
		return {
			indicators:[
				{
					"title":"",
					"url": `https://fred.stlouisfed.org/graph/graph-landing.php?g=YbPp`,
					"type":"iframe",
					"height": "700"
				},
				{
					"title":"BoE Interest Rate Forecast",
					"url":"./images/Interest-Rate-Forecast.png",
					"type":"img",
					"height": "500"
				},
				{
					"title":"Margin Of Safety",
					"url":"./images/margin-of-safety.png",
					"type":"img",
					"height": "500"
				},
				{
					"title":"Market Sturcture",
					"url":"./images/understanding-market-structure.jpg",
					"type":"img",
					"height": "700"
				},
			]
		}
	},
	methods: {
	},	
	mounted() {
		this.loading = true;
		this.$store.dispatch("wscrape/getCmvModels");
	}
})
</script>

<style lang="scss"></style>