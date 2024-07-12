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
			// console.log("watch",n)
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