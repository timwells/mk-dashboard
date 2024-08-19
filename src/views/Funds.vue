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
		<a-tab-pane key="2" tab="MyMap">
			<a-row :gutter="24" type="flex">
				<a-col :span="24" class="mb-24">
					<CardMultiChart v-if="funddata.length>0" id="mymap" :dataset="funddata"></CardMultiChart>
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
export default ({
	components: {
		CardFundsTable,
		CardMultiChart
	},
	computed: {
    	...mapState("funds", ["funds"]),
    	...mapState("ft", ["funddata"]),
	},
	data() {
		return {
			FUNDS_Columns,
			pagination: { pageSize: 1000 },
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
		this.$store.dispatch("ft/getFundData");
	}
})
</script>

<style lang="scss">
</style>