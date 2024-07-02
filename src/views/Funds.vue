<template>
	<div>
		<!-- Funds Table -->
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
	</div>
</template>

<script>
import { mapState } from "vuex";
import { FUNDS_Columns } from '@/common/table'

// Funds table component.
import CardFundsTable from '../components/Cards/CardFundsTable' ;

export default ({
	components: {
		CardFundsTable,
	},
	computed: {
    	...mapState("funds", ["funds"]),
	},
	data() {
		return {
			FUNDS_Columns,
			pagination: { pageSize: 1000 },
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
	}
})
</script>

<style lang="scss">
</style>