<template>
	<div>
		<a href="https://www.dividenddata.co.uk/exdividenddate.py?m=alldividends" target="_blank">Dividend Data</a>
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">

				<!--pre>{{ dividendData }}</pre-->
				
				<a-table
					:columns="dividendColumns" 
					:data-source="dividendData.data" 
					:pagination="pagination"
					:rowKey="(record,index) => index"
					@expand="onExpand"
					@expandedRowsChange="expandedRowsChange"
					size="small"
					class='table table-small' style="margin: 0; background-color: white;">

					<div slot="filterDropdown"
						slot-scope="{setSelectedKeys,selectedKeys,confirm,clearFilters,column}"
						style="padding:8px">
						<a-input
							v-ant-ref="c => (searchInput = c)"
							:placeholder="`Search ${column.dataIndex}`"
							:value="selectedKeys[0]"
							style="width: 188px; margin-bottom: 8px; display: block"
							@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
							@pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"/>
						<a-button
							type="primary"
							icon="search"
							size="small"
							style="width: 90px; margin-right: 8px"
							@click="() =>handleSearch(selectedKeys, confirm, column.dataIndex)">
							Search</a-button>
						<a-button
							size="small"
							style="width: 90px"
							@click="() => handleReset(clearFilters)">
							Reset
						</a-button>
					</div>
					<a-icon
						slot="filterIcon"
						slot-scope="filtered"
						type="search"
						:style="{ color: filtered ? '#108ee9' : undefined }"
					/>
					<template slot="expandedRowRender" slot-scope="record">
						<a-tabs default-active-key="1">
							<a-tab-pane key="1" tab="Fundimentals">
								<pre>{{ record.epic }}</pre>
								<CardTVStockChart2 :epic="record.epic"/>
							</a-tab-pane>
							<!--a-tab-pane key="2" tab="Broker View">
								<WidgetTradingViewBrokerAnalysis :symbol="fullSymbol(record.epic)"/>
							</a-tab-pane-->
							<!--a-tab-pane key="3" tab="Financials">
								<WidgetTradingViewFinancials :symbol="fullSymbol(record.epic)"/>
							</a-tab-pane-->
							<!--a-tab-pane key="4" tab="Price">
								<card-price-info :epic="lseSymbol(record.epic)"></card-price-info>
							</a-tab-pane-->
							<!--a-tab-pane key="2" tab="TradeView">
								<a :href="tradeView(record.epic)" target="_blank">{{record.epic}}</a>
							</a-tab-pane-->
						</a-tabs>
					</template>

					<template slot="epic" slot-scope="epic"><p class="m-0">{{ epic }}</p></template>
					<template slot="name" slot-scope="name"><p class="m-0">{{ name }}</p></template>
					<template slot="ExDate" slot-scope="exDate"><p class="m-0">{{ exDate }}</p></template>
					<template slot="market" slot-scope="market"><p class="m-0">{{ market }}</p></template>
					<template slot="amount" slot-scope="amount"><p class="m-0">{{ amount }}</p></template>
					<template slot="daysToGo" slot-scope="daysToGo"><p class="m-0">{{ daysToGo }}</p></template>						
					<template slot="payDate" slot-scope="payDate"><p class="m-0">{{ payDate }}</p></template>				

				</a-table>
			</a-col>
		</a-row>
	</div>
</template>

<script>

/*
 "data": [
    {
      "epic": "ADM",
      "name": "Admiral Group",
      "market": "FTSE 100",
      "exDate": "15/05/2025",
      "amount": 121,
      "payDate": "13/06/2025",
      "daysToGo": 5
    },
*/

const dividendColumns = [
	{ title: 'Epic', dataIndex: 'epic', scopedSlots: { customRender: 'epic' }},
	{ title: 'Name', dataIndex: 'name', 
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
	},
	{ 
		title: 'Market', 
		dataIndex: 'market', 
		sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.market.localeCompare(b.market),
		scopedSlots: { customRender: 'market' }
	},
	{ 
		title: 'Dividend(p)', 
		dataIndex: 'amount', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.amount - b.amount,
		scopedSlots: { customRender: 'amount' }
	},
	{ title: 'ExDividend', dataIndex: 'exDate', scopedSlots: { customRender: 'exDate' }},
	{ 
		title: 'Days', 
		dataIndex: 'daysToGo', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.daysToGo - b.daysToGo,
		scopedSlots: { customRender: 'daysToGo' }
	},
	{ title: 'Pay Out', dataIndex: 'payDate', scopedSlots: { customRender: 'payDate' }}
];

const epicCorrections = [{in:"T17",out:"TM17"}]
import { mapState } from "vuex";
import WidgetTradingViewTechAnalysis from "@/components/Widgets/WidgetTradingViewTechAnalysis";
import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
import WidgetTradingViewFinancials from "@/components/Widgets/WidgetTradingViewFinancials";
import WidgetIntrinsicCalculator from "@/components/Widgets/WidgetIntrinsicCalculator";
import CardPriceInfo from "@/components/Cards/CardPriceInfo";
import CardTVStockChart2 from "@/components/Cards/CardTVStockChart2.vue";

export default ({
	components: {
		WidgetTradingViewTechAnalysis,
		WidgetTradingViewBrokerAnalysis,
		WidgetTradingViewFinancials,
		WidgetIntrinsicCalculator,
		CardPriceInfo,
		CardTVStockChart2
	},
	computed: {
    	...mapState("dd", ["dividendData"])	
	},
	watch: {
        dividendData(o,n) {
			//this.loading = this.dividendData.length > 0 ? false: true
		},
    },
	data() {
		return {
			activeKey: 1,
			loading: true,
			dividendColumns,
			pagination: { 
				pageSize: 200, onChange: (p) => {
					for(let i=0; i < this.expandedIdList.length; i++) {
						var e = document.getElementById(this.expandedIdList[i]); 
						e.removeChild(e.children[0]);	
					}
					this.expandedIdList = []
				},
			},
			expandedIdList: [],
			expandedRowKeys: [],

			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",
		}
	},
	methods: {
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			return "LSE:" + epic
		},
		tradeView(epic) {
			return `https://www.tradingview.com/chart/?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
		expandedRowsChange(r) {
		},
		onExpand(exp,r) { 
		},

		handleSearch(selectedKeys, confirm, dataIndex) {
      		confirm();
      		this.searchText = selectedKeys[0];
      		this.searchedColumn = dataIndex;
    	},

		handleReset(clearFilters) {
      		clearFilters();
      		this.searchText = "";
    	},
	},	
	mounted() {
		// this.loading = true
		this.$store.dispatch("dd/getDividendData")
	}
})
</script>

<style>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 8px 8px;
}
</style>