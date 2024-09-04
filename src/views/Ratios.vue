<template>
	<div>
		<a href="https://www.multpl.com/" target="_blank">Multpl - Market, financial, and economic data.</a>
		<a-tabs default-active-key="1">
			<a-tab-pane key="1" tab="Treasury Rate">
				<a-row type="flex" align="stretch">
					<a-col :span="24" :lg="24" :xl="24" class="mb-24">
						<CardMultiChart 
							v-if="treasuryRates.length>0"
							id="treasuryRates"
							:dataset="treasuryRates">
						</CardMultiChart>
					</a-col>	
				</a-row>
			</a-tab-pane>
			<a-tab-pane key="2" tab="Shiller">
				<CardMultiChart 
					v-if="shillerData.length>0" 
					id="shillerData"
					:dataset="shillerData">
				</CardMultiChart>
			</a-tab-pane>
			<a-tab-pane key="3" tab="Y2-10Y-Recession">
				<CardMultiChart 
					v-if="y2y10maturity.length>0" 
					id="y2y10maturity"
					:dataset="y2y10maturity">
				</CardMultiChart>
			</a-tab-pane>
			<a-tab-pane key="4" tab="TV Test">
				<CardTVStockChart2 epic="VIC"/>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
// https://www.multpl.com/
//const DS_SHILLER_PE_MONTHLY = "shiller-pe/table/by-month"
//const DS_SP500_PE = "s-p-500-pe-ratio/table/by-month"

// import CardTreasuryRateComposite from '@/components/Cards/CardTreasuryRateComposite';
import CardMultiChart from '@/components/Cards/CardMultiChart';
import CardTVStockChart2 from '@/components/Cards/CardTVStockChart2';

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardMultiChart,
		CardTVStockChart2
	},
	computed: {
    	...mapState("mtpl", ["treasuryRates","shillerData"]),
		...mapState("fedinfo",["y2y10maturity"]),
		...mapGetters("mtpl",["gMtplDataSetExists"]),
	},
	data() {
		return {
		}
	},
	methods: {
	},
	async mounted() {
		this.$store.dispatch("mtpl/getTreasuryRates");
		this.$store.dispatch("mtpl/getShiller");
		this.$store.dispatch("fedinfo/get2Y10YTreasuryMaturity");
	},
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>