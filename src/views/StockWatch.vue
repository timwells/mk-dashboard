<template>
	<div>

		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">
				<a-button type="primary" @click="jobRun" size="small">Job Run</a-button>
			</a-col>
		</a-row>

		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24">			
				<a-table
					:loading="loading"
					:columns="stockWatchColumns" 
					:data-source="stockWatches"
					:pagination="pagination"
					:rowKey="(record,i) => i"
					@expand="onExpand"
					:rowClassName="rowColor"
					@expandedRowsChange="expandedRowsChange"
					size="small"
					bordered
					class='table table-small' style="margin: 0; background-color: white;">

					<template slot="expandedRowRender" slot-scope="record" style="margin: 0">
						<a-tabs default-active-key="1">
							<a-tab-pane key="1" tab="Trade View">
								<CardTVStockChart2 :epic="shortSymbol(record)"/>
							</a-tab-pane>
							<a-tab-pane key="2" tab="Broker View">
								<WidgetTradingViewBrokerAnalysis 
									:symbol="fullSymbol(record)">
								</WidgetTradingViewBrokerAnalysis>
							</a-tab-pane>

							<a-tab-pane key="3" tab="Financials">
								<WidgetTradingViewFinancials 
									:symbol="fullSymbol(record)">
								</WidgetTradingViewFinancials>
							</a-tab-pane>

						</a-tabs>
					</template>

					<template slot="epic" slot-scope="epic">
						<p class="m-0">{{ epic }}</p>
					</template>
	#				<template slot="price" slot-scope="price">
						<p class="m-0">{{ price }}</p></template>				
					<template slot="buy" slot-scope="tp">
						<p class="m-0">{{ tp }}</p>
					</template>
					<template slot="trigger" slot-scope="trigger">
						<p class="m-0">{{ trigger }}</p>
					</template>
					<template slot="timestamp" slot-scope="timestamp">
						<p class="m-0">{{timeStamp(timestamp)}}</p>
					</template>
					<!--template slot="minichart" slot-scope="record">
						<WidgetTradingViewMiniChart 
							:symbol="fullSymbol(record)">
						</WidgetTradingViewMiniChart>
					</template-->
				</a-table>
			</a-col>
		</a-row>
	</div>
</template>

<script>
/*
  {
    "h": 500,
    "l": 498.5,
	"lse" :"LSE:DRX",
	"n": "DRX.L",
    "tp": false,
    "ts": "2022-10-14T18:37:28.171Z",
    "v": 524
  }
*/

const stockWatchColumns = [
	{ title: 'Epic', dataIndex: 'n', scopedSlots: { customRender: 'epic' }},
	{ title: 'Price', dataIndex: 'v', scopedSlots: { customRender: 'price' }},
	{ title: 'Trigger', dataIndex: 'h', scopedSlots: { customRender: 'trigger' }},
	{ title: 'TimeStamp', dataIndex: 'ts',scopedSlots: { customRender: 'timestamp' }},
	{ title: 'Thumb', scopedSlots: { customRender: 'minichart' }}
];

import { mapState } from "vuex";
import WidgetTradingViewTechAnalysis from "@/components/Widgets/WidgetTradingViewTechAnalysis";
import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
import WidgetTradingViewMiniChart from "@/components/Widgets/WidgetTradingViewMiniChart"
import WidgetTradingViewFinancials from "@/components/Widgets/WidgetTradingViewFinancials"
import CardTVStockChart2 from "@/components/Cards/CardTVStockChart2.vue";
export default ({
	components: {
		WidgetTradingViewTechAnalysis,
		WidgetTradingViewBrokerAnalysis,
		WidgetTradingViewMiniChart,
		WidgetTradingViewFinancials,
		CardTVStockChart2
	},
	computed: {
    	...mapState("stockwatch", ["stockWatches"]),
		...mapState("auth", ["userSecrets"])
	},
	watch: {
        stockWatches(o,n) {
			this.loading = this.stockWatches.length > 0 ? false: true
		},
    },
	data() {
		return {
			activeKey: 1,
			loading: true,
			stockWatchColumns,			
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
			expandedRowKeys: []
		}
	},
	methods: {
		fullSymbol(r) {
			return "LSE:" + r.n.split(".L")[0]
		},
		tradeView(epic) {
			// return ""
			return `https://www.tradingview.com/chart/${this.userSecrets.tradingviewid}?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
		shortSymbol(record) {
			//console.log(s)
			//let ss = s.n.split(":")[1].split(".")[0]
			//console.log(ss)
			return record.n.split(".")[0]
		},
		expandedRowsChange(r) {},
		onExpand(exp,r) { },
		rowColor(row) { return row.tp ? "tiggered" : "" },
		timeStamp(ts) { return ts.split("T")[0] },
		jobRun() {
			this.$store.dispatch("stockwatch/jobrun");
		}
	},	
	mounted() {
		this.loading = true
		this.$store.dispatch("stockwatch/getStockWatches");
	}
})
</script>

<style>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 8px 8px;
}

.tiggered { background-color:rgb(174, 243, 174) }
</style>