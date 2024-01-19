<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-tabs default-active-key="1">
				<a-tab-pane key="1" tab="Open">
					<a-row v-if="nakedTrades!=null">
						<a-col :span="6">
							<a-statistic title="Open Orders" :value="nakedTrades.statistics.openTrades" />
						</a-col>
						<a-col :span="6">
							<a-statistic title="Open Order Cost £" :value="nakedTrades.statistics.openOrderCost" />
						</a-col>
					</a-row>
					<a-table
						:loading="loading"
						:columns="OpenTradeCols"
						:data-source="openTrades" 
						:pagination="pagination"
						:rowKey="(record,index) => index"
						@expand="onExpand"
						@expandedRowsChange="expandedRowsChange"
						class='table table-small' style="margin: 0; background-color: white;">				
						<template slot="expandedRowRender" slot-scope="record">
							<a-tabs default-active-key="1">
								<a-tab-pane key="1" tab="TradeView">
									<a :href="tradeView(record.epic)" target="_blank">{{record.epic}}</a>
								</a-tab-pane>
								<a-tab-pane key="2" tab="Broker View">
									<WidgetTradingViewBrokerAnalysis :symbol="fullSymbol(record.epic)"/>
								</a-tab-pane>
								<a-tab-pane key="3" tab="Financials">
									<WidgetTradingViewFinancials :symbol="fullSymbol(record.epic)"/>
								</a-tab-pane>
								<a-tab-pane key="4" tab="Price">
									<card-price-info :epic="lseSymbol(record.epic)"></card-price-info>
								</a-tab-pane>
							</a-tabs>
						</template>

						<template slot="stock" slot-scope="stock"><p class="m-0 font-regular text-muted">{{ stock }}</p></template>
						<template slot="epic" slot-scope="epic"><p class="m-0 font-regular text-muted">{{ epic }}</p></template>
						<template slot="qty" slot-scope="qty"><p class="m-0 font-regular text-muted">{{ qty }}</p></template>
						<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>
						<template slot="target" slot-scope="target"><p class="m-0 font-regular text-muted">{{ target }}</p></template>
						<template slot="stop" slot-scope="stop"><p class="m-0 font-regular text-muted">{{ stop }}</p></template>
						<template slot="buydate" slot-scope="buydate"><p class="m-0 font-regular text-muted">{{ buydate }}</p></template>

						<template slot="tc" slot-scope="tc"><p class="m-0 font-regular text-muted">£{{ tc }}</p></template>
						<template slot="pd" slot-scope="pd"><p class="m-0 font-regular text-muted">{{ pd }}</p></template>
						<template slot="cp" slot-scope="cp"><p class="m-0 font-regular text-muted">{{ cp }}</p></template>

					</a-table>
				</a-tab-pane>
				<a-tab-pane key="2" tab="All Trades">
					<a-table
						:loading="loading"
						:columns="colDictionary"
						:data-source="allTrades" 
						:pagination="pagination"
						:rowKey="(record,index) => index"
						@expand="onExpand"
						@expandedRowsChange="expandedRowsChange"
						class='table table-small' style="margin: 0; background-color: white;">				
						<template slot="expandedRowRender" slot-scope="record">
							<a-tabs default-active-key="1">
								<a-tab-pane key="1" tab="£ View">
									<WidgetTradingViewTechAnalysis 
										:symbol="fullSymbol(record.epic)" 
										@container="container"> 
									</WidgetTradingViewTechAnalysis>
								</a-tab-pane>
								<a-tab-pane key="2" tab="Broker View">
									<WidgetTradingViewBrokerAnalysis 
										:symbol="fullSymbol(record.epic)">
									</WidgetTradingViewBrokerAnalysis>
								</a-tab-pane>
								<a-tab-pane key="3" tab="Financials">
									<WidgetTradingViewFinancials 
										:symbol="fullSymbol(record.epic)">
									</WidgetTradingViewFinancials>
								</a-tab-pane>						
							</a-tabs>
						</template>

						<template slot="stock" slot-scope="stock"><p class="m-0 font-regular text-muted">{{ stock }}</p></template>
						<template slot="epic" slot-scope="epic"><p class="m-0 font-regular text-muted">{{ epic }}</p></template>
						<template slot="qty" slot-scope="qty"><p class="m-0 font-regular text-muted">{{ qty }}</p></template>
						<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>
						<template slot="target" slot-scope="target"><p class="m-0 font-regular text-muted">{{ target }}</p></template>
						<template slot="stop" slot-scope="stop"><p class="m-0 font-regular text-muted">{{ stop }}</p></template>
						<template slot="buydate" slot-scope="buydate"><p class="m-0 font-regular text-muted">{{ buydate }}</p></template>

						<template slot="tc" slot-scope="tc"><p class="m-0 font-regular text-muted">£{{ tc }}</p></template>
						<template slot="pd" slot-scope="pd"><p class="m-0 font-regular text-muted">{{ pd }}</p></template>
						<template slot="cp" slot-scope="cp"><p class="m-0 font-regular text-muted">{{ cp }}</p></template>

						<template slot="sell" slot-scope="sell"><p class="m-0 font-regular text-muted">{{ sell }}</p></template>
						<template slot="selldate" slot-scope="selldate"><p class="m-0 font-regular text-muted">{{ selldate }}</p></template>
						<template slot="pl" slot-scope="pl"><p class="m-0 font-regular text-muted">{{ pl }}</p></template>	
					</a-table>
				</a-tab-pane>
				<a-tab-pane key="3" tab="Statistics">
					<a-row v-if="nakedTrades">
						<a-col :span="6">
							<a-statistic title="Open Orders" :value="nakedTrades.statistics.openTrades" />
						</a-col>
						<a-col :span="6">
							<a-statistic title="Open Order Cost £" :value="nakedTrades.statistics.openOrderCost" />
						</a-col>
						<a-col :span="6">
							<a-statistic title="Gains %" :value="nakedTrades.statistics.gainPercent" />
						</a-col>
						<a-col :span="6">
							<a-statistic title="Losses %" :value="nakedTrades.statistics.lossPercent" />
						</a-col>
					</a-row>
				</a-tab-pane>	
				<a-tab-pane key="4" tab="Archive">
					<ul>
						<li v-for="x in nakedArchives" :key="x.index">{{ x.year }}
							<ul>
								<li v-for="y in x.archives" :key="y.index">{{ y }}</li>
							</ul>				
						</li>
					</ul>
				</a-tab-pane>
			</a-tabs>
		</a-col>
	</a-row>
</template>

<script>
const colDictionary = [
	{ title: 'Stock', dataIndex: 'stock', width: 140, scopedSlots: { customRender: 'stock' }},
	{ title: 'Epic', dataIndex: 'epic', width: 90, scopedSlots: { customRender: 'epic' }},
	{ title: 'Bought', dataIndex: 'buydate', width: 140, scopedSlots: { customRender: 'buydate' }},
	{ title: 'Qty', dataIndex: 'qty', width: 100,scopedSlots: { customRender: 'qty' }},
	{ title: 'Price', dataIndex: 'price', scopedSlots: { customRender: 'price' }},
	{ title: 'Cost', dataIndex: 'tc',scopedSlots: { customRender: 'tc' }},
	{ title: 'Target', dataIndex: 'target',scopedSlots: { customRender: 'target' }},
	{ title: 'Diff', dataIndex: 'pd', width: 80, scopedSlots: { customRender: 'pd' }},
	{ 
		title: '%', 
		dataIndex: 'cp', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.cp - b.cp,
		scopedSlots: { customRender: 'cp' }
	},
	{ title: 'Stop',dataIndex: 'stop', scopedSlots: { customRender: 'stop' }},
	{ title: 'Sell', dataIndex: 'sell', scopedSlots: { customRender: 'sell' }},
	{ title: 'Sell Date', dataIndex: 'selldate', scopedSlots: { customRender: 'selldate' }},
	{ title: 'P/L ', dataIndex: 'pl',scopedSlots: { customRender: 'pl' }}
];
const OpenTradeCols = [
	colDictionary[0],colDictionary[1],colDictionary[2],
	colDictionary[3],colDictionary[4],colDictionary[5],
	colDictionary[6],colDictionary[7]
];

import { mapState } from "vuex";
import WidgetTradingViewTechAnalysis from "@/components/Widgets/WidgetTradingViewTechAnalysis";
import WidgetTradingViewTechAnalysisTest from "@/components/Widgets/WidgetTradingViewTechAnalysisTest";

import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
import WidgetTradingViewFinancials from "@/components/Widgets/WidgetTradingViewFinancials";

import CardPriceInfo from "@/components/Cards/CardPriceInfo";

const epicCorrections = [
	{in:"T17",out:"TM17"},
	{in:"BAE",out:"BA."}
]

// https://blog.katastros.com/a?ID=01750-67585afe-3add-4a2a-929a-d49a26d82b6c

// https://www.tradingview.com/chart/?symbol=LSE%3ATTG&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=LSE%3ATTG
// https://www.tradingview.com/chart/?symbol=LSE%3ATTG
// &utm_source=www.tradingview.com
// &utm_medium=widget
// &utm_campaign=chart
// &utm_term=LSE%3ATTG
export default ({
	components: {
		WidgetTradingViewTechAnalysisTest,	
		WidgetTradingViewTechAnalysis,
		WidgetTradingViewBrokerAnalysis,
		WidgetTradingViewFinancials,
		CardPriceInfo
	},
	computed: {...mapState("wscrape", ["nakedTrades","nakedArchives"])},
	watch: {
        nakedTrades(o,n) {
			this.openTrades = this.nakedTrades.openTrades
			this.allTrades = this.nakedTrades.trades
			this.loading = false;
		},
    },
	data() {
		return {
			openTrades: [],
			allTrades: [],
			loading: true,
			OpenTradeCols,
			colDictionary,
			pagination: { 
				pageSize: 200, onChange: (p) => {
					/*
					for(let i=0; i < this.expandedIdList.length; i++) {
						var e = document.getElementById(this.expandedIdList[i]); 
						console.log(this.expandedIdList[i],e);
						e.removeChild(e.children[0]);	
					}
					this.expandedIdList = []
					*/
				},
			},
			expandedIdList: [],
			expandedRowKeys: []
		}
	},
	methods: {
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			return "LSE:" + epic; 
		},
		lseSymbol(epic) {
			return epic + ".L"
		},
		tradeView(epic) {
			return `https://www.tradingview.com/chart/?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
   		onExpand(exp,r) { 
			if(!exp) {
			}
		},
		expandedRowsChange(r) {
		},
		customRow(record) {
      		return { on: { click: event => { console.log("customRow:",event, record);}} };
   	 	},
		container(id) {
			this.expandedIdList.push(id)
		}
	},	
	mounted() {
		this.loading = true;
		this.$store.dispatch("wscrape/getNakedTrades");
		this.$store.dispatch("wscrape/getNakedArchives");
	}
})
</script>

<style lang="scss">
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 8px 8px;
}

</style>