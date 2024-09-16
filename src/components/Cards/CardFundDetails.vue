<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Overview">
			<CardHLOverview
				:fundName="fundsDetailFilter(sedol).data.fund_name"
				:annualCharge="fundsDetailFilter(sedol).data.annual_charge"
				:citiCode="fundsDetailFilter(sedol).data.citicode"
				:sedol="sedol"
				:aims="fundsDetailFilter(sedol).data.aims"
				:sectorName="fundsDetailFilter(sedol).data.sector_name"
				:unitType="fundsDetailFilter(sedol).data.unit_type"
				:paymentType="fundsDetailFilter(sedol).data.payment_type"
				:launchDate="fundsDetailFilter(sedol).data.launchdate"
			>
			</CardHLOverview>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Holdings">
			<CardHLAnalysis :sedol="sedol"></CardHLAnalysis>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Allocation">
			<CardHLAllocation :sedol="sedol"></CardHLAllocation>
		</a-tab-pane>
		<a-tab-pane key="4" tab="Data">
			<pre>{{ fundsDetailFilter(sedol) }}</pre>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// import ElementFundDetail from '@/components/Elements/ElementFundDetail'
// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=FJRPU&color=f65d1a&hide=&span=M240&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_
// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=FH3BOP&color=f65d1a&hide=&span=60&totalReturn=true
// https://www.fundslibrary.co.uk/flweb/Views/Charting.aspx?type=column&fontSize=8&xtitle=&ytitle=Percent&width=550&height=377&background=&showvalues=true&shrink=true&names=%3C%A350M%2C%3E%A350M%20and%20%3C%A3250M%2C%3E%A3250M%20and%20%3C%A31BN%2C%3E%A31BN%20and%20%3C%A33BN%2C%3E%A33BN%20and%20%3C%A35BN%2C%3E%A35BN%20and%20%3C%A310BN%2C%3E%A310BN%20and%20%3C%A320BN%2C%3E%A320BN%20and%20%3C%A350BN%2C%3E%A350BN%2CUnknown%2CDebt%2CCash%20and%20Equiv.&values=0.007955,0.033765,1.253437,5.163267,4.242722,6.463873,7.246721,18.448956,31.059793,25.650222,0.02099,0.408295&colours=3e5174,c5c5c5,fb6d6d,498244,e0a3ce,91b3f1,929292,cc0000,7dc178,b768a0,417ff0,585858,ebbb5d,c4e8c1,824470,000000&usecoloursforseries=true
// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/
// 		h/hl-multi-manager-special-situations-trust-accumulation/fund-analysis/in-detail

// https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/B88N705

// Hargreaves Lansdown Multi-Manager Special Situations Trust
import CardHLOverview from "./CardHLOverview.vue";
import CardHLAnalysis from "./CardHLAnalysis.vue";
import CardHLAllocation from "./CardHLAllocation.vue";

export default ({
	props: {
		companyid: { type: String, default: ""},
		sectorid:  { type: String, default: ""},
		sedol:     { type: String, default: ""}
	},
	components: {
		CardHLOverview,
		CardHLAnalysis,
		CardHLAllocation
	},
	watch:{
	},
	computed: {
		...mapGetters("hl", ["fundsDetailFilter"]),
	},
	data() {
		return {
		}
	},
	methods: {
	},
	async mounted() {
		this.$store.dispatch("hl/getFundDetails",{ 
				companyid: this.companyid,
				sectorid: this.sectorid,
				sedol: this.sedol 
		});
		// await new Promise((s) => setTimeout(s, 1000));
	},
})

</script>