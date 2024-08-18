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
		</a-tabs>
		<a-row :gutter="24" type="flex">
		</a-row>	
	</div>
</template>

<script>
// https://www.multpl.com/
//const DS_SHILLER_PE_MONTHLY = "shiller-pe/table/by-month"
//const DS_SP500_PE = "s-p-500-pe-ratio/table/by-month"

// import CardTreasuryRateComposite from '@/components/Cards/CardTreasuryRateComposite';
import CardMultiChart from '@/components/Cards/CardMultiChart';

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardMultiChart
	},
	computed: {
    	...mapState("mtpl", ["treasuryRates","shillerData"]),
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
	},
})


</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>