<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">

		<a-table v-if="bonds.length>0"
			:columns="sivcols"
			:data-source="bonds" 
			:pagination="false"
			:rowKey="(record,i) => i"
			class='table table-small' style="margin: 0; background-color: white;">				

			<template slot="name" slot-scope="name">
				<p class="m-0 font-regular text-muted">{{ name }}</p>
			</template>
			<template slot="coupon" slot-scope="coupon"><p class="m-0 font-regular text-muted">{{ coupon }}</p></template>
			<template slot="maturity" slot-scope="maturity"><p class="m-0 font-regular text-muted">{{ maturity }}</p></template>
			<template slot="daysRemaining" slot-scope="daysRemaining"><p class="m-0 font-regular text-muted">{{ daysRemaining }}</p></template>
			<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>
			<template slot="nominal" slot-scope="nominal"><p class="m-0 font-regular text-muted">{{ nominal }}</p></template>
			<template slot="diff" slot-scope="diff"><p class="m-0 font-regular text-muted">{{ diff }}</p></template>

		</a-table>
	</a-card>
</template>

<script>

/*
  {
    "name": "Treasury 0.625% 07/06/25",
    "href": "https://www.hl.co.uk/shares/shares-search-results/BK5CVX0",
    "details": "GBP | GB00BK5CVX03 | BK5CVX0",
    "coupon": 0.625,
    "maturity": "07/06/2025",
    "price": 99.9,
    "nominal": 100,
    "diff

*/

const sivcols = [
	{
		title: 'Name',
		dataIndex: 'name',
		// sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.name.localeCompare(b.name),
		//onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
		//scopedSlots: { 
		//	customRender: 'name', 
		//	filterDropdown: 'filterDropdown',
		//	filterIcon: 'filterIcon'
		//},
		// width: 200, 
	},
	{
		title: 'Coupon %',
		dataIndex: 'coupon',
		//sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
		scopedSlots: { customRender: 'coupon' }
	},
	{
		title: 'Maturity',
		dataIndex: 'maturity',
		//sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
		scopedSlots: { customRender: 'maturity' }
	},
	{
		title: 'Days Remaining',
		dataIndex: 'daysRemaining',
		//sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
		scopedSlots: { customRender: 'daysRemaining' }
	},
	{
		title: 'Price',
		dataIndex: 'price',
		//sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
		scopedSlots: { customRender: 'price' }
	},
	{
		title: 'Nominal',
		dataIndex: 'nominal',
		//sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
		scopedSlots: { customRender: 'nominal' }
	},
	{
		title: 'Diff',
		dataIndex: 'diff',
		//sortDirections: ["descend", "ascend"],
		//sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
		scopedSlots: { customRender: 'diff' }
	}
];

import { mapState } from "vuex";

export default ({
	components: {
  	},
	computed: {
    	...mapState("hl", ["bonds"])	
	},
	watch: {
	},
  	data() {
    	return {
			loading: false,
			sivcols,
			pagination: { pageSize: 200 },

			curExpandedRowKeys: [],
			selectedRowKeys: [],
			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",
    	}
  	},
	methods: {
  	},
	mounted() {
		this.loading = true;
		this.$store.dispatch("hl/getBonds",{group: "uk-gilts"});
	}
})
</script>

<style lang="scss">
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 6px 6px;
}
</style>