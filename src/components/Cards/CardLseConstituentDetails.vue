<template>
	<div v-if="gConstituentDetails(epic) != undefined">
		<img :src="gConstituentDetails(epic).chartUrl" height="300" width="98%"></img>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

//import WidgetTradingViewTechAnalysis from "@/components/Widgets/WidgetTradingViewTechAnalysis";
//import WidgetTradingViewTechAnalysisTest from "@/components/Widgets/WidgetTradingViewTechAnalysisTest";
//import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
//import WidgetTradingViewFinancials from "@/components/Widgets/WidgetTradingViewFinancials";

export default ({
	props: {
		epic: {
			type: String,
			default: ""
		}
	},
	components: {
		//WidgetTradingViewTechAnalysisTest,	
		//WidgetTradingViewTechAnalysis,
		//WidgetTradingViewBrokerAnalysis,
		//WidgetTradingViewFinancials,
	},
	computed: {
		...mapGetters("lse",["gConstituentDetails"]),
	},
	data() {
		return { }
	},
	methods: {
		//epic(record) {
		//	return `https://www.dividenddata.co.uk/dividend-history.py?epic=${record.epic.split('.')[0]}` 
		//},
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			return "LSE:" + epic.split(".")[0]; 
		},
	},
	mounted() {
	  this.$store.dispatch("lse/getConstituentDetails",{epic: this.epic});
	}
})
</script>

<style>
</style>