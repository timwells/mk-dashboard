<template>
		<!-- Trends -->
		<a-row v-if="trends" :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="(trend, index) in trends" :key="index">
				<CardGoogleTrend 
					:id="trendId(index)" 
					:keywords="trend.keywords" 
					:geo="trend.geo" 
					:search="trendDateRange()"/>
			</a-col>
		</a-row>
</template>

<script>
import { mapState } from "vuex";
import CardGoogleTrend from '@/components/Cards/CardGoogleTrend.vue'

export default ({
	components: {
		CardGoogleTrend
	},
	computed: {
    	...mapState("trends", ["trends"])
	},
	data() {
		return {}
	},
	methods: {
		trendId(index) {return `google-trend${index}`},
		trendDateRange() { return "2012-01-01 " + new Date().toISOString().split("T")[0];}
	},
	mounted() {
    this.$store.dispatch("trends/getTrends");
	}
})
</script>

<style lang="scss">
</style>