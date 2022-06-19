<template>
	<div>
		<!-- Trends -->
		<a-row>
			<a-col :span="12">col-12</a-col>
			<a-col :span="12">col-12</a-col>
		</a-row>
		<!--a-row v-if="trends" :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="(trend, index) in trends" :key="index">
				<GoogleTrend 
					:id="trendId(index)" 
					:keywords="trend.keywords" 
					:geo="trend.geo" 
					:search="trendDateRange()"/>
			</a-col>
		</a-row-->
	</div>
</template>

<script>
import { mapState } from "vuex";
import GoogleTrend from '../components/GoogleTrend/GoogleTrend';
export default ({
	components: {
		GoogleTrend
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

/*
var currentdate = new Date();
var datetime = "Last Sync: " + currentdate.getDay() + "/" + currentdate.getMonth() 
+ "/" + currentdate.getFullYear() + " @ " 
+ currentdate.getHours() + ":" 
+ currentdate.getMinutes() + ":" + currentdate.getSeconds();
It should print 18/04/2012 15:07:33 and prints 3/3/2012 15:07:33
*/
</script>

<style lang="scss">
</style>