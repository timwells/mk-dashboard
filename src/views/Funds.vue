<template>
	<div>
		<!-- Funds Table -->
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">
				<!--pre style="color:blue">{{funds}}</pre-->
				<CardFundsTable :data="funds" :columns="fundsColumns" :pagination="pagination">
				</CardFundsTable>
			</a-col>
		</a-row>
	</div>
</template>

<script>
// https://aaronwn.github.io/vue-antd/components/table/
// name	type	sedol	bidPrice	askPrice	netIC	netAC	
const fundsColumns = [{
		title: 'Name',
		dataIndex: 'name',
		scopedSlots: { customRender: 'name' },
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
	},
];

// "Authors" table list of rows and their properties.
const table1Data = [
	{
		key: '1',
		author: {
			avatar: 'images/face-2.jpg',
			name: 'Michael John',
			email: 'michael@mail.com',
		},
		func: {
			job: 'Manager',
			department: 'Organization',
		},
		status: 1,
		employed: '23/04/18',
	},
	{
		key: '2',
		author: {
			avatar: 'images/face-3.jpg',
			name: 'Alexa Liras',
			email: 'alexa@mail.com',
		},
		func: {
			job: 'Programator',
			department: 'Developer',
		},
		status: 0,
		employed: '23/12/20',
	},
	{
		key: '3',
		author: {
			avatar: 'images/face-1.jpg',
			name: 'Laure Perrier',
			email: 'laure@mail.com',
		},
		func: {
			job: 'Executive',
			department: 'Projects',
		},
		status: 1,
		employed: '13/04/19',
	},
	{
		key: '4',
		author: {
			avatar: 'images/face-4.jpg',
			name: 'Miriam Eric',
			email: 'miriam@mail.com',
		},
		func: {
			job: 'Marketing',
			department: 'Organization',
		},
		status: 1,
		employed: '03/04/21',
	},
	{
		key: '5',
		author: {
			avatar: 'images/face-5.jpeg',
			name: 'Richard Gran',
			email: 'richard@mail.com',
		},
		func: {
			job: 'Manager',
			department: 'Organization',
		},
		status: 0,
		employed: '23/03/20',
	},
	{
		key: '6',
		author: {
			avatar: 'images/face-6.jpeg',
			name: 'John Levi',
			email: 'john@mail.com',
		},
		func: {
			job: 'Tester',
			department: 'Developer',
		},
		status: 0,
		employed: '14/04/17',
	},
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
			pagination: { pageSize: 20 },
		}
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
	}
})
</script>

<style lang="scss">
</style>