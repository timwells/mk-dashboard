<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table
				:loading="loading"
				:columns="cols"
				:data-source="hlIndexData" 
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
					</a-tabs>
				</template>
			</a-table>
		</a-col>
	</a-row>
</template>

<script>
import { mapState } from "vuex";

const epicCorrections = [
	{in:"T17",out:"TM17"},
	{in:"BAE",out:"BA."}
]

const cols = [
	{ 
		title: 'Index', dataIndex: 'index', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.index.localeCompare(b.index),	
		scopedSlots: { customRender: 'index' }
	},
	{ title: 'Epic', dataIndex: 'epic', scopedSlots: { customRender: 'epic' }},
	{ title: 'Name', dataIndex: 'name', scopedSlots: { customRender: 'name' }},
	{ title: 'Price', dataIndex: 'price', scopedSlots: { customRender: 'price' }},
	{ 
		title: 'Change', dataIndex: 'change', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.change - b.change,
		scopedSlots: { customRender: 'change' }
	},
	{ 
		title: '%', dataIndex: 'percentage', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.percentage - b.percentage,
		scopedSlots: { customRender: 'percentage' }
	},
];

export default ({
	components: {},
	computed: {
		...mapState("wscrape", ["hlIndexData"]),
		...mapState("app", ["secrets"])
	},
	watch: {
        hlIndexData(nn, prv) {
			if(nn.length > 0) this.loading = false;
		},
	},
	data() {
		return {
			cols,
			loading: true,
			pagination: { pageSize: 1000, onChange: (p) => {}},
			expandedIdList: [],
			expandedRowKeys: []
		}
	},
	mounted() {
        this.$store.dispatch("wscrape/getHLIndexData")
	},
	methods: {
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			return "LSE:" + epic; 
		},
		onExpand(exp,r) { 
			if(!exp) {}
		},
		expandedRowsChange(r) {},
		tradeView(epic) {
			return `https://www.tradingview.com/chart/${this.secrets.tradingviewid}?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
	}
})

</script>

<style>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td { padding: 8px 8px; }
</style>