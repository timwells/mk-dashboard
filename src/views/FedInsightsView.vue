<template>
	<div>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="24" :xl="24" class="mb-8" v-for="(chart, index) in fedInfo" :key="index">			
				<CardIndicatorInfo title="" 
					:url="chart.url" 
					:type="chart.type"
					height="500px"/>
			</a-col>
		</a-row>

		<!--iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1jdCI&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" 
			allowTransparency="true" loading="lazy"></iframe-->

		<!--iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1io9J&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>

		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1io8w&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>

		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1io8U&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1io8W&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1io9B&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1ioa4&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1ioar&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe style="width: 670px; height: 475px; overflow: hidden;" 
			src="//research.stlouisfed.org/fred2/graph/graph-landing.php?g=Hmv" width="300" height="150" frameborder="0" scrolling="no"></iframe>		

		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iobf&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iobj&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>

		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iobV&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>		

		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iocd&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" allowTransparency="true" loading="lazy"></iframe>
		
		<iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iocm&width=670&height=475" 
			scrolling="no" frameborder="0" style="overflow:hidden; width:670px; height:525px;" 
			allowTransparency="true" loading="lazy"></iframe-->

		<!--iframe src="https://cmegroup-tools.quikstrike.net/User/QuikStrikeTools.aspx?viewitemid=IntegratedFedWatchTool&amp;userId=lwolf&amp;jobRole=&amp;company=&amp;companyType=&amp;userId=lwolf&amp;jobRole=&amp;company=&amp;companyType=" style="width: 100%; height: 1000px; overflow: auto; border: 0" scrolling="auto" frameborder="0" id="cmeIframe-jtxelq2f" class="cmeIframe"></iframe-->

</div>
</template>

<script>
import { mapState } from "vuex";
import CardIndicatorInfo from '@/components/Cards/CardIndicatorInfo';

export default ({
	components: {
		CardIndicatorInfo
	},
	watch: {
        fedInfo(o,n) {
			console.log("watch",n)
		},
	},
	computed: {
    	...mapState("fedinfo", ["fedInfo"])	
	},
	data() {
		return {
			url :"https://fred.stlouisfed.org/graph/graph-landing.php?g=1io71&width=670&height=475"
		}
	},
	mounted() {
		this.$store.dispatch("fedinfo/getFedInfo")
	}
})
</script>

<style lang="scss">
</style>