<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table
				:loading="loading"
				:columns="dividendColumns" 
				:data-source="dividendData" 
				:pagination="pagination"
				:rowKey="(record,index) => index"
				@expand="onExpand"
				@expandedRowsChange="expandedRowsChange"
				size="small"
				class='table table-small' style="margin: 0; background-color: white;">

				<template slot="expandedRowRender" slot-scope="record" style="margin: 0">
					<a-tabs default-active-key="1">
    					<a-tab-pane key="1" tab="Trade View">
							<a :href="tradeView(record.epic)" target="_blank">{{record.epic}}</a>
						</a-tab-pane>
    					<a-tab-pane key="2" tab="Announcement">
							<a-card :bordered="false" class="card-info">
								<div class="card-content">
									<iframe 
										:src="record.announcementUrl"
										title="title" 
										width="100%" 
										height="800" 
										style="border:none;">
									</iframe>
								</div>
							</a-card>
						</a-tab-pane>
						<a-tab-pane key="3" tab="Broker View">
							<WidgetTradingViewBrokerAnalysis 
								:symbol="fullSymbol(record.epic)">
							</WidgetTradingViewBrokerAnalysis>
						</a-tab-pane>

						<a-tab-pane key="4" tab="Financials">
							<WidgetTradingViewFinancials 
								:symbol="fullSymbol(record.epic)">
							</WidgetTradingViewFinancials>
						</a-tab-pane>	

						<a-tab-pane key="5" tab="Intrinsic">
							<WidgetIntrinsicCalculator/> 
						</a-tab-pane>	
					</a-tabs>
				</template>

				<template slot="epic" slot-scope="epic"><p class="m-0">{{ epic }}</p></template>
				<template slot="name" slot-scope="name"><p class="m-0">{{ name }}</p></template>
				<template slot="market" slot-scope="market"><p class="m-0">{{ market }}</p></template>
				<template slot="price" slot-scope="price"><p class="m-0">{{ price }}</p></template>
				<template slot="dividend" slot-scope="dividend"><p class="m-0">{{ dividend }}</p></template>				
				<template slot="declarationDate" slot-scope="declarationDate"><p class="m-0">{{ declarationDate }}</p></template>						
				<template slot="exDividendDate" slot-scope="exDividendDate"><p class="m-0">{{ exDividendDate }}</p></template>				

			</a-table>
		</a-col>
	</a-row>
</template>

<script>
// {"epic": "SMIN", "name": "Smiths Group", 
// "market": "FTSE 100", "price": "1506p", 
// "dividend": "27.3p", "exdividenddate": "20-Oct"},

const dividendColumns = [
	{ title: 'Epic', dataIndex: 'epic', scopedSlots: { customRender: 'epic' }},
	{ title: 'Name', dataIndex: 'name', 
		sorter: (a, b) => a.name.localeCompare(b.name),
		scopedSlots: { 
			customRender: 'name'
		}
	},
	{ 
		title: 'Market', 
		dataIndex: 'market', 
		sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.market.localeCompare(b.market),
		scopedSlots: { customRender: 'market' }
	},
	{ title: 'Price(p)', dataIndex: 'price', scopedSlots: { customRender: 'price' }},
	{ title: 'Impact(%)', dataIndex: 'impact', scopedSlots: { customRender: 'impact' }},
	{ title: 'Declaration', dataIndex: 'declarationDate', scopedSlots: { customRender: 'declarationDate' }},
	{ 
		title: 'Dividend (p)', 
		dataIndex: 'dividend', 
		sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.dividend.localeCompare(b.dividend),		
		scopedSlots: { customRender: 'dividend' }
	},
	{ title: 'ExDividend', dataIndex: 'exDividendDate', scopedSlots: { customRender: 'exDividendDate' }},
	{ 
		title: 'Days', 
		dataIndex: 'days', 
		sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.days.localeCompare(b.days),		
		scopedSlots: { customRender: 'days' }
	}
];

const epicCorrections = [{in:"T17",out:"TM17"}]
import { mapState } from "vuex";
import WidgetTradingViewTechAnalysis from "@/components/Widgets/WidgetTradingViewTechAnalysis";
import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
import WidgetTradingViewFinancials from "@/components/Widgets/WidgetTradingViewFinancials";
import WidgetIntrinsicCalculator from "@/components/Widgets/WidgetIntrinsicCalculator";

export default ({
	components: {
		WidgetTradingViewTechAnalysis,
		WidgetTradingViewBrokerAnalysis,
		WidgetTradingViewFinancials,
		WidgetIntrinsicCalculator
	},
	computed: {
    	...mapState("divd", ["dividendData"])	
	},
	watch: {
        dividendData(o,n) {
			this.loading = this.dividendData.length > 0 ? false: true
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
			expandedRowKeys: []
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
	},	
	mounted() {
		this.loading = true
		this.$store.dispatch("divd/getDividendData")
	}
})
</script>

<style>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 8px 8px;
}
</style>