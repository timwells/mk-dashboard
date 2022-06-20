<template>
	<div>
		<!-- Funds Table -->
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">
				<!--pre style="color:blue">{{funds}}</pre-->
				<CardFundsTable :data="funds" :columns="fundsColumns" :pagination="pagination"></CardFundsTable>
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
		}
	},{
		title: 'Type',
		dataIndex: 'type',
		scopedSlots: { customRender: 'type' },
	},{
		title: 'Sedol',
		dataIndex: 'sedol',
		scopedSlots: { customRender: 'sedol' },
	},{
		title: 'Bid',
		dataIndex: 'bidPrice',
		scopedSlots: { customRender: 'bidPrice' },
	},{
		title: 'Ask',
		dataIndex: 'askPrice',
		scopedSlots: { customRender: 'askPrice' },
	},{
		title: 'Initial Charge',
		dataIndex: 'netIC',
		sorter: (a, b) => a.netIC - b.netIC,
    	sortDirections: ["descend", "ascend"],
		scopedSlots: { customRender: 'netIC' },
	},{
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
    	...mapState("funds", ["funds"])
	},
	data() {
		return {
			fundsColumns,
			pagination: { pageSize: 60 },
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
	}
})
</script>

<style lang="scss"></style>