<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Fund Table">
			<a-row :gutter="24" type="flex">
				<a-col :span="24" class="mb-24">

					<!--pre style="color:blue">{{funds}}</pre-->
					<pre>{{funds.length}}</pre>
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
				<a-col :span="8">
					<a-statistic v-if="fundsStats" title="Funds" :value="fundsStats.availableFunds" />
				</a-col>
				<a-col :span="8">
					<a-button @click="refresh()">Refresh Funds</a-button>
					<!--a-button @click="getFunds()">Get Funds</a-button-->
				</a-col>
				<a-col :span="8">
					<a-progress type="circle" :percent="progressPercent" />
				</a-col>
			</a-row>
			<a-row :gutter="24" type="flex">
				<!--a-table 
					:columns="fundColumns" 
					:data-source="fundsList.data" 
					:pagination="pagination" 
					:rowKey="(record,i) => i">
				</a-table-->
				<a-col :span="24">
					<pre>{{ fundsList }}</pre>
					<CardFundsTable2
						:data="fundsList.data" 
						:columns="fundListColumns" 
						:pagination="pagination"
						searchIndex="full_description">
					</CardFundsTable2>
				</a-col>
			</a-row>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapState } from "vuex";
import { FUNDS_Columns } from '@/common/table'

// Funds table component.
import CardFundsTable from '@/components/Cards/CardFundsTable' ;
import CardFundsTable2 from '@/components/Cards/CardFundsTable2' ;
import CardMultiChart from '@/components/Cards/CardMultiChart';
import CardTVLineChart from "@/components/Cards/CardTVLineChart.vue";

/*
	"sedol": "0433231",
	"citicode": "SL51",
	"full_description": "abrdn Global Infrastructure Equity (Inst Founder)",
	"unit_type": "Accumulation",
	"initial_charge": "0.00",
	"annual_charge": "0.85000",
	"vantage_charge": "0.0000",
	"payment_type": "Dividend",
	"yield": "2.23",
	"historic_yield": "2.23",
	"fund_size": "279.4",
	"bid_price": 456.29999999999995,
	"offer_price": 456.29999999999995,
	"price_change": "2.40",
	"percent_change": "0.53",
	"updated": "2024-09-12"
*/

const fundListColumns = [
	{ title: 'sedol', dataIndex: 'sedol'},
	{ title: 'citicode', dataIndex: 'citicode'},
	{ title: 'Desc', dataIndex: 'full_description', 
		onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { 
			customRender: 'full_description', 
			filterDropdown: 'filterDropdown', 
			filterIcon: 'filterIcon' 
		}
	},
	{ title: 'Type', dataIndex: 'unit_type'},
	{ title: 'IC', dataIndex: 'initial_charge'},
	{ title: 'AC', dataIndex: 'annual_charge',
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.annual_charge - b.annual_charge,
	},
	{ title: 'Payment', dataIndex: 'payment_type'},
	{ title: 'Yield', dataIndex: 'yield',
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.yield - b.yield,
	},
	{ title: 'F.Size', dataIndex: 'fund_size'},
	{ title: 'Bid', dataIndex: 'bid_price'},
	{ title: 'Offer', dataIndex: 'offer_price'},
	{ title: 'Chg', dataIndex: 'price_change'},
	{ title: '%Chg', dataIndex: 'percent_change'},
	{ title: 'Updated', dataIndex: 'updated'},
];

export default ({
	components: {
		CardFundsTable,
		CardFundsTable2,
		CardMultiChart,
		CardTVLineChart
	},
	computed: {
    	...mapState("funds", ["funds"]),
    	...mapState("ft", ["mymapfunds"]),
    	...mapState("hl", ["fundsStats","progress","fundsList"]),
		progressPercent() {
			// Check if TotalFunds is not zero to avoid division by zero errors
			if (this.fundsStats == null || this.fundsStats.availableFunds === 0) {return 0;} 
			// Calculate percentage and round to 2 decimal places
			return +((this.progress / this.fundsStats.availableFunds) * 100).toFixed(0);
		},
	},
	data() {
		return {
			FUNDS_Columns,
			fundListColumns,
			pagination: { pageSize: 500 },
		}
	},
	methods: {
		refresh() {
			this.$store.dispatch("hl/refreshFunds",{count: this.fundsStats.availableFunds});
		},
	},
	mounted() {
		this.$store.dispatch("funds/getFunds");
		this.$store.dispatch("ft/getMyMapfunds");
		this.$store.dispatch("hl/getFundsStats");

		this.$store.dispatch("hl/getFunds");
	}
})
</script>

<style lang="scss">
</style>