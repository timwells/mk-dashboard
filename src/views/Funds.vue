<template>
	<div>
		<!-- Funds Table -->
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">
				<!--pre style="color:blue">{{funds}}</pre-->
				<CardFundsTable 
					:data="funds" 
					:columns="fundsColumns" 
					:pagination="pagination">
				</CardFundsTable>
			</a-col>
		</a-row>
	</div>
</template>

<script>
// https://aaronwn.github.io/vue-antd/components/table/
// name	type	sedol	bidPrice	askPrice	netIC	netAC	
const fundsColumns = [
	{
		title: 'Name',
		dataIndex: 'name',
	    sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.name.localeCompare(b.name),
	    onFilter: (value, record) =>
    	  record.name
        	.toString()
        	.toLowerCase()
        	.includes(value.toLowerCase()),
		scopedSlots: { 
			customRender: 'name', 
	      	filterDropdown: 'filterDropdown',
 	     	filterIcon: 'filterIcon'
		},
		width: 400, 
	},{
		title: 'Type',
		dataIndex: 'type',
		scopedSlots: { customRender: 'type' },
		width: 160, 
	},
	{
		title: 'Sedol',
		dataIndex: 'sedol',
		scopedSlots: { customRender: 'sedol' },
		width: 120, 
	},
	{
		title: 'Citi Code',
		dataIndex: 'citicode',
		scopedSlots: { customRender: 'citicode' },
		width: 80, 
	},
	{
		title: 'Annual Charge',
		dataIndex: 'netAC',
		sorter: (a, b) => a.netAC - b.netAC,
    	sortDirections: ["descend", "ascend"],
		scopedSlots: { customRender: 'netAC' },
	}
];

import { mapState } from "vuex";

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
			fundsColumns,
			pagination: { pageSize: 300 },
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
	}
})
</script>

<style lang="scss">
</style>