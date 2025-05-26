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

			<template slot="nominalValue" slot-scope="nominalValue"><p class="m-0 font-regular text-muted">{{ nominalValue }}</p></template>
			<template slot="remainingCoupons" slot-scope="remainingCoupons"><p class="m-0 font-regular text-muted">{{ remainingCoupons }}</p></template>
			<template slot="totalCoupon" slot-scope="totalCoupon"><p class="m-0 font-regular text-muted">{{ totalCoupon }}</p></template>
			<template slot="capitalGain" slot-scope="capitalGain"><p class="m-0 font-regular text-muted">{{ capitalGain }}</p></template>
			<template slot="totalReturn" slot-scope="totalReturn"><p class="m-0 font-regular text-muted">{{ totalReturn }}</p></template>
			<template slot="annualisedReturn" slot-scope="annualisedReturn"><p class="m-0 font-regular text-muted">{{ annualisedReturn }}</p></template>
		</a-table>
	</a-card>
</template>

<script>
/*
{
        "name": "Treasury 6% 07/12/2028",
        "href": "https://www.hl.co.uk/shares/shares-search-results/0240419",
        "details": "GBP | GB0002404191 | 0240419",
        "nominal": 100,
        "diff": 7.12,
        "nominalValue": 4667.66,
        "remainingCoupons": 6,
        "totalCoupon": 840.18,
        "capitalGain": -332.34,
        "totalReturn": 507.84,
        "annualisedReturn": 3.25,
        "coupon": 6,
        "maturity": "07/12/2028",
        "daysRemaining": 1290.23,
        "price": 107.12
    },
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
	},
	{
		title: 'Nominal Value',
		dataIndex: 'nominalValue',
		scopedSlots: { customRender: 'nominalValue' }
	},
	{
		title: 'Remaining Coupons',
		dataIndex: 'remainingCoupons',
		scopedSlots: { customRender: 'remainingCoupons' }
	},
	{
		title: 'Total Coupon',
		dataIndex: 'totalCoupon',
		scopedSlots: { customRender: 'totalCoupon' }
	},
	{
		title: 'Capital Gain',
		dataIndex: 'capitalGain',
		scopedSlots: { customRender: 'capitalGain' }
	},
	{
		title: 'Total Return',
		dataIndex: 'totalReturn',
		scopedSlots: { customRender: 'totalReturn' }
	},
	{
		title: 'Annualised Return',
		dataIndex: 'annualisedReturn',
		scopedSlots: { customRender: 'annualisedReturn' }
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