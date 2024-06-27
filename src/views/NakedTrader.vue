<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<h5 v-if="nakedArchives">Last Updated: {{ nakedArchives[0].archives[0].name}}</h5>
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
					<a-table v-if="nakedTrades"
						:loading="loading"
						:columns="openColumns"
						:data-source="nakedTrades.openTrades" 
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
						<template slot="dopn" slot-scope="dopn"><p class="m-0 font-regular text-muted">{{ dopn }}</p></template>
						<template slot="qty" slot-scope="qty"><p class="m-0 font-regular text-muted">{{ qty }}</p></template>
						<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>
						<template slot="target" slot-scope="target"><p class="m-0 font-regular text-muted">{{ target }}</p></template>
						<template slot="stop" slot-scope="stop"><p class="m-0 font-regular text-muted">{{ stop }}</p></template>
						<template slot="buydate" slot-scope="buydate"><p class="m-0 font-regular text-muted">{{ buydate }}</p></template>

						<template slot="tc" slot-scope="tc"><p class="m-0 font-regular text-muted">{{ tc }}</p></template>
						<template slot="pd" slot-scope="pd"><p class="m-0 font-regular text-muted">{{ pd }}</p></template>
						<template slot="cp" slot-scope="cp"><p class="m-0 font-regular text-muted">{{ cp }}</p></template>
						<template slot="xp" slot-scope="xp"><p class="m-0 font-regular text-muted">{{ xp }}</p></template>
						<template slot="xpd" slot-scope="xpd"><p class="m-0 font-regular text-muted">{{ xpd }}</p></template>

					</a-table>
				</a-tab-pane>
				<a-tab-pane key="2" tab="Closed">
					<a-table v-if="nakedTrades"
						:loading="loading"
						:columns="columns"
						:data-source="nakedTrades.closedTrades" 
						:pagination="pagination"
						:rowKey="(record,index) => index"
						@expand="onExpand"
						@expandedRowsChange="expandedRowsChange"
						class='table table-small' style="margin: 0; background-color: white;">				
						<template slot="stock" slot-scope="stock"><p class="m-0 font-regular text-muted">{{ stock }}</p></template>
						<template slot="epic" slot-scope="epic"><p class="m-0 font-regular text-muted">{{ epic }}</p></template>
						<template slot="dopn" slot-scope="dopn"><p class="m-0 font-regular text-muted">{{ dopn }}</p></template>
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
				<a-tab-pane key="3" tab="Statistics">
					<a-row v-if="nakedTrades!=null">
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
					<a-row v-if="nakedArchives.length>0">
						<a-col :span="6">
							<a-card>
								<a-list
									item-layout="vertical"
									:data-source="nakedArchives">
									<a-list-item slot="renderItem" slot-scope="item">
										<a-list-item-meta :title="item.yearMonth"/>
											<div v-if="item">
												<li v-for="y in item.archives" 
													:key="y.index"
													@click="getArchiveContent(y.href)">{{ y.name }}
												</li>
											</div>
									</a-list-item>
								</a-list>
							</a-card>
						</a-col>
						<a-col :span="18">
							<a-card v-if="nakedArchiveContent.length>0" :bodyStyle="{paddingTop: 0, paddingBottom: '16px' }">
								<div v-html="nakedArchiveContent"></div>
							</a-card>
						</a-col>
					</a-row>
				</a-tab-pane>
			</a-tabs>
		</a-col>
	</a-row>
</template>

<script>
const columns = [
	{ title:'Stock', dataIndex:'stock', width: 140, scopedSlots: { customRender: 'stock' }},
	{ title:'Epic', dataIndex:'epic', width: 60, scopedSlots: { customRender: 'epic' }},
	{ title:'Bought', dataIndex:'buydate', width: 100, scopedSlots: { customRender: 'buydate' }},
	{ title:'Dopn', dataIndex:'dopn', width: 60, 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.cp - b.cp,
		scopedSlots: { customRender: 'dopn' }
	},
	{ title:'Qty', dataIndex:'qty', width: 60,
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.cp - b.cp,
		scopedSlots: { customRender: 'qty' }
	},
	{ title:'Price', dataIndex:'price', width: 60, scopedSlots: { customRender: 'price' }},
	{ title:'Cost', dataIndex:'tc',width: 80,scopedSlots: { customRender: 'tc' }},
	{ title:'Trgt', dataIndex:'target',width: 60,scopedSlots: { customRender: 'target' }},
	{ title:'Diff', dataIndex:'pd', width: 60, 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.cp - b.cp,
		scopedSlots: { customRender: 'pd' }
	},
	{ 
		title:'%', 
		dataIndex: 'cp', 
		width: 80,
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.cp - b.cp,
		scopedSlots: { customRender: 'cp' }
	},
	{ title:'XP', dataIndex:'xp', width: 80, scopedSlots: { customRender: 'xp' }},
	{ title:'XPD', dataIndex:'xpd', width: 80, 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.xpd - b.xpd,
		scopedSlots: { customRender: 'xpd' }
	},
	{ title:'Stop',dataIndex: 'stop',width: 60,scopedSlots: { customRender: 'stop' }},
	{ title:'Sell', dataIndex: 'sell', width: 80,scopedSlots: { customRender: 'sell' }},
	{ title:'Sell.D', dataIndex: 'selldate',width: 100,scopedSlots: { customRender: 'selldate' }},
	{ 
		title:'P/L', 
		dataIndex:'pl',
		width: 60,
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.cp - b.cp,
		scopedSlots: { customRender: 'pl' }
	},
];
const openColumns = [
	columns[0],
	columns[1],
	columns[2],
	columns[3],
	columns[4],
	columns[5],
	columns[6],
	columns[7],
	columns[8],
	columns[9],
	columns[10],
	columns[11],
	columns[12],
]

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
	computed: {
		...mapState("nt", ["nakedTrades","nakedArchives","nakedArchiveContent"]),
		...mapState("app", ["secrets"])
	},
	watch: {
        nakedTrades(n,o) {
			this.loading = false;
		},
    },
	data() {
		return {
			openTrades: [],
			allTrades: [],
			loading: true,
			columns,
			openColumns,
			pagination: { pageSize: 500, onChange: (p) => {},},
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
			return `https://www.tradingview.com/chart/${this.secrets.tradingviewid}?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
   		onExpand(exp,r) { 
			if(!exp) {}
		},
		expandedRowsChange(r) {
		},
		customRow(record) {
      		return { on: { click: event => { console.log("customRow:",event, record);}} };
   	 	},
		container(id) {
			this.expandedIdList.push(id)
		},
		getArchiveContent(href){
			this.$store.dispatch("nt/getNakedArchiveContent",{content:href});
		}
	},	
	mounted() {
		this.loading = true;
		this.$store.dispatch("nt/getNakedTrades");
		this.$store.dispatch("nt/getNakedArchives");
	}
})
</script>

<style lang="scss">
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 6px 6px;
}

li:hover{ color: blue}

li {
  list-style-type: none;
}
</style>