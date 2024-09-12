<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Fund Table">
			<a-row :gutter="24" type="flex">
				<a-col :span="24" class="mb-24">
					<!--pre style="color:blue">{{funds}}</pre-->
					<CardFundsTable 
						:data="funds" 
						:columns="FUNDS_Columns" 
						:pagination="pagination">
					</CardFundsTable>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="2" tab="MyMapTV">
			<a-row :gutter="24" type="flex">
				<a-col :span="24" class="mb-24">
					<CardTVLineChart v-if="mymapfunds.length>0"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Manage Funds">
			<a-row :gutter="24" type="flex">
				<a-col :span="4">
					<a-statistic v-if="fundsStats" title="Funds" :value="fundsStats.fundsCount" />
				</a-col>
				<a-col :span="4">
					<a-button @click="refresh()">Refresh Funds</a-button>
				</a-col>
				<a-col :span="4">
					<a-progress type="circle" :percent="progressPercent" />
				</a-col>
			</a-row>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapState } from "vuex";
import { FUNDS_Columns } from '@/common/table'

// Funds table component.
import CardFundsTable from '../components/Cards/CardFundsTable' ;
import CardMultiChart from '@/components/Cards/CardMultiChart';
import CardTVLineChart from "../components/Cards/CardTVLineChart.vue";

export default ({
	components: {
		CardFundsTable,
		CardMultiChart,
		CardTVLineChart
	},
	computed: {
    	...mapState("funds", ["funds"]),
    	...mapState("ft", ["mymapfunds"]),
    	...mapState("hl", ["fundsStats","progress"]),
		progressPercent() {
			// Check if TotalFunds is not zero to avoid division by zero errors
			if (this.fundsStats == null || this.fundsStats.fundsCount === 0) {return 0;}
			// Calculate percentage and round to 2 decimal places
			return +((this.progress / this.fundsStats.fundsCount) * 100).toFixed(0);
		},
	},
	data() {
		return {
			FUNDS_Columns,
			pagination: { pageSize: 1000 },
		}
	},
	methods: {
		refresh() {
			this.$store.dispatch("hl/refreshFunds",{count: this.fundsStats.fundsCount});
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
		this.$store.dispatch("ft/getMyMapfunds");
		this.$store.dispatch("hl/getFundsCount");
	}
})
</script>

<style lang="scss">
</style>