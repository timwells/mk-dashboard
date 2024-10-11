<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Funds">
			<a-row :gutter="24" type="flex">
				<a-col :span="4">
					<a-statistic v-if="fundsStats" title="Live: HL-Funds" :value="fundsStats.availableFunds" />
				</a-col>
				<a-col :span="4">
					<a-statistic v-if="fundsObj" title="Cached: HL-Funds" :value="fundsObj.data.length" />
				</a-col>
				<a-col :span="4">
					<a-statistic v-if="fundsObj" title="Cached Date" :value="fundsCreatedDate()" />
				</a-col>
				<a-col :span="4">
					<a-button @click="refresh()" :disabled="isDisabled">Refresh Funds</a-button>
				</a-col>
				<a-col :span="8">
					<a-progress type="circle" :percent="fundsRefreshProgress" :width="60" />

				</a-col>
			</a-row>
			<a-row :gutter="24" type="flex">
				<a-col :span="24">
					<CardFundsTable2 v-if="fundsObj"
						:data="fundsObj.data" 
						:columns="fundListColumns" 
						:pagination="pagination"
						searchIndex="full_description">
					</CardFundsTable2>
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
	{ title: 'Fund', dataIndex: 'fund_name', ellipsis:true, width:320,
		onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { 
			customRender: 'full_description', 
			filterDropdown: 'filterDropdown', 
			filterIcon: 'filterIcon' 
		}
	},
	{ title: 'Company', dataIndex: 'company_name', ellipsis:true, width:150,
		onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { 
			customRender: 'full_description', 
			filterDropdown: 'filterDropdown', 
			filterIcon: 'filterIcon' 
		}
	},
	{ title: 'Sector', dataIndex: 'sector_name', ellipsis: true,
		onFilter: (value, record) => record.sector_name.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { customRender: 'sector_name', filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' },
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.sector_name.localeCompare(b.sector_name)
	},
	{ title: 'Type', dataIndex: 'unit_type', ellipsis:true,},
	{ title: 'I.Chg', dataIndex: 'initial_charge'},
	{ title: 'A.Chg', dataIndex: 'annual_charge',
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.annual_charge - b.annual_charge,
	},
	{ title: 'Payment', dataIndex: 'payment_type'},
	{ title: 'Yield', dataIndex: 'yield',
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.yield - b.yield,
	},
	//{ title: 'F.Size', dataIndex: 'fund_size'},
	{ title: 'Bid', dataIndex: 'bid_price'},
	{ title: 'Offer', dataIndex: 'offer_price'},
	//{ title: 'Chng', dataIndex: 'price_change'},
	//{ title: '%Chng', dataIndex: 'percent_change'},
	{ title: 'Date', dataIndex: 'updated'},
	{ title: '', dataIndex: 'company_id',width:0,scopedSlots: { customRender: "company_id"}},
	{ title: '', dataIndex: 'sector_id',width:0, scopedSlots: { customRender: "sector_id"}},
	{ title: '', dataIndex: 'sedol',width:0, scopedSlots: { customRender: "sedol"}},
	{ title: '', dataIndex: 'citicode',width:0,scopedSlots: { customRender: "citicode"}},
];

export default ({
	components: {
		CardFundsTable,
		CardFundsTable2,
		CardMultiChart,
		CardTVLineChart,
	},
	computed: {
    	...mapState("funds", ["funds"]),
    	...mapState("ft", ["mymapfunds"]),
    	...mapState("hl", ["fundsStats","fundsRefreshProgress","fundsRefreshComplete","fundsObj"]),
		progressPercent() {
			// Check if TotalFunds is not zero to avoid division by zero errors
			if (this.fundsStats == null || this.fundsStats.availableFunds === 0) {return 0;} 
			return +((this.progress / this.fundsStats.availableFunds) * 100).toFixed(0);
		},
	},
	watch: {
		fundsRefreshProgress(n,o) {
		},
		fundsRefreshComplete(n,o) {
			if(n === true) {
				this.$store.dispatch("hl/getFunds");
				this.isDisabled = false
			}
		},
		fundsObj(n,o) {
			if(n) {
				//this.isDisabled = false;
			}
		}
	},
	data() {
		return {
			FUNDS_Columns,
			fundListColumns,
			pagination: { pageSize: 500 },
			isDisabled: false,
		}
	},
	methods: {
		refresh() {
			this.isDisabled = true
			this.$store.dispatch("hl/refreshFunds",{count: this.fundsStats.availableFunds});
		},
		fundsCreatedDate() {
			if(this.fundsObj) return this.fundsObj.created.split("T")[0]
			return ""
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