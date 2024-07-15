<template>
	<div>
		<a href="https://www.longtermtrends.net/" target="_blank">Longterm Trends</a>
		<CardLTTLineChart v-if="wilshireGdpRatio"
			title="Wilshire GDP Ratio"
			id="wilshireGdpRatio"
			:historicalData="wilshireGdpRatio.data.rwdata" 
			:historicalMAData="wilshireGdpRatio.data.expMA">
		</CardLTTLineChart>
		<CardLTTLineChart v-if="sp500vsBondsRatio"
			title="SP500 vs Bonds Ratio"
			id="sp500vsBondsRatio"
			:historicalData="sp500vsBondsRatio.data.rwdata" 
			:historicalMAData="sp500vsBondsRatio.data.expMA">
		</CardLTTLineChart>
	</div>	
	<!--a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Buffett Indicators">
			<a-row v-if="cmvBuffettIndicatorModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" 
					v-for="(cmvBuffettIndicatorModel, index) in cmvBuffettIndicatorModels" :key="index">
					<img :src="cmvBuffettIndicatorModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="2" tab="VIX Fear Index">
			<a-row v-if="cmvVixModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cmvVixModel, index) in cmvVixModels" :key="index">
					<img :src="cmvVixModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Price Earnings">
			
			<a-row v-if="cmvPriceEarningsModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cmvPriceEarningsModel, index) in cmvPriceEarningsModels" :key="index">
					<img :src="cmvPriceEarningsModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="4" tab="SP500 Mean Reversions">
			<a-row v-if="cmvSp500MeanReversionModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cmvSp500MeanReversionModel, index) in cmvSp500MeanReversionModels" :key="index">
					<img :src="cmvSp500MeanReversionModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="5" tab="10Y Interest Rate">
			<a-row v-if="cmv10YInterestRatesModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cmv10YInterestRatesModel, index) in cmv10YInterestRatesModels" :key="index">
					<img :src="cmv10YInterestRatesModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="6" tab="Yeild Curves">
			<a-row v-if="cmvYieldCurveModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cmvYieldCurveModel, index) in cmvYieldCurveModels" :key="index">
					<img :src="cmvYieldCurveModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="7" tab="Sentiments">
			<a-row v-if="cnnSentimentModels.length>0" :gutter="24" type="flex" align="stretch">
        		<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cnnSentimentModel, index) in cnnSentimentModels" :key="index">
					<img :src="cnnSentimentModel" width="600">
        		</a-col>
			</a-row>
		</a-tab-pane>
	</a-tabs>

		<a-row v-if="cmvPriceEarningsModels.length>0" :gutter="24" type="flex" align="stretch">
        	<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(cmvPriceEarningsModel, index) in cmvPriceEarningsModels" :key="index">
				<img :src="cmvPriceEarningsModel" width="600">
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
			height="500"/-->
</template>

<script>
import { mapState } from "vuex";
import CardLTTLineChart from '@/components/Cards/CardLTTLineChart';

export default ({
	components: {
		CardLTTLineChart
	},
	computed: {
    	//...mapState("wscrape", 
		//	[
				//"cmvBuffettIndicatorModels",
				//"cmvPriceEarningsModels",
				//"cmvVixModels",
				//"cmvSp500MeanReversionModels",
				//"cmv10YInterestRatesModels",
				//"cmvYieldCurveModels",
		//	]
		//),
		...mapState("ltt", ["wilshireGdpRatio","sp500vsBondsRatio"]),
	},
	watch: {

    },
	data() {
		return {
		}
	},
	methods: {
	},	
	mounted() {
		this.loading = true;
		//this.$store.dispatch("wscrape/getCmvBuffettIndicatorModels");
		//this.$store.dispatch("wscrape/getCmvPriceEarningsModels");
		//this.$store.dispatch("wscrape/getCmvVixModels");
		//this.$store.dispatch("wscrape/getCmvSp500MeanReversionModels");
		//this.$store.dispatch("wscrape/getCmv10YInterestRatesModels");
		//this.$store.dispatch("wscrape/getCmvYieldCurveModels");
		//this.$store.dispatch("wscrape/getCnnSenitmentModels");

		//this.$store.dispatch("wscrape/getCnnSenitmentModels");
	    this.$store.dispatch("ltt/getWilshireGdpRatio");
	    this.$store.dispatch("ltt/getSP500VsBondsRatio")
	}
})
</script>

<style lang="scss"></style>