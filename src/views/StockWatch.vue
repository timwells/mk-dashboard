<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">			
			<a-table ref="tt" v-if="stockWatches"
				:columns="stockWatchColumns" 
				:data-source="stockWatches" 
				:rowKey="(record,index) => index"
				@expand="onExpand"
				:rowClassName="rowColor"
				@expandedRowsChange="expandedRowsChange"
				size="small"
				class='table table-small' style="margin: 0; background-color: white;">

				<template slot="expandedRowRender" slot-scope="record" style="margin: 0">
					<a-row :gutter="24" type="flex">
						<a-col :span="24">
							<WidgetTradingView :symbol="fullSymbol(record.n)" @container="container"></WidgetTradingView>
						</a-col>						
						<!--a-col :span="6">
							<CardTraderBrokerInfo :symbol="fullSymbol(record.epic)"></CardTraderBrokerInfo>
						</a-col-->						
					</a-row>
				</template>

				<template slot="epic" slot-scope="epic">
					<p class="m-0">{{ epic }}</p></template>
				<template slot="price" slot-scope="price">
					<p class="m-0">{{ price }}</p></template>				
				<template slot="buy" slot-scope="tp">
					<p class="m-0">{{ tp }}</p>
				</template>
				<template slot="trigger" slot-scope="trigger">
					<p class="m-0">{{ trigger }}</p>
				</template>
				<template slot="timestamp" slot-scope="timestamp">
					<p class="m-0">{{timeStamp(timestamp)}}</p></template>	
			</a-table>
		</a-col>
	</a-row>
</template>

<script>
/*
  {
    "h": 500,
    "l": 498.5,
    "n": "DRX.L",
    "td": "",
    "tp": false,
    "ts": "2022-10-14T18:37:28.171Z",
    "v": 524
  }
*/

const stockWatchColumns = [
	{ title: 'Epic', dataIndex: 'n', scopedSlots: { customRender: 'epic' }},
	{ title: 'Price', dataIndex: 'v', scopedSlots: { customRender: 'price' }},
	{ title: 'Trigger', dataIndex: 'h', scopedSlots: { customRender: 'trigger' }},
	// { title: 'Buy', dataIndex: 'tp',scopedSlots: { customRender: 'buy' }},
	{ title: 'TimeStamp', dataIndex: 'ts',scopedSlots: { customRender: 'timestamp' }}
];
const epicCorrections = [{in:"T17",out:"TM17"}]

import { mapState } from "vuex";
import WidgetTradingView from "@/components/Widgets/WidgetTradingView";

export default ({
	components: {
		WidgetTradingView
	},
	computed: {
    	...mapState("stockwatch", ["stockWatches"])	
	},
	data() {
		return {
			stockWatchColumns,
			/*
			pagination: { 
				pageSize: 10, onChange: (p) => {
					for(let i=0; i < this.expandedIdList.length; i++) {
						var e = document.getElementById(this.expandedIdList[i]); 
						e.removeChild(e.children[0]);	
					}
					this.expandedIdList = []
				},
			},*/
			expandedIdList: [],
			expandedRowKeys: []
		}
	},
	methods: {
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			// remove ".L"
			return "LSE:" + epic.slice(0,-2);
		},
		expandedRowsChange(r) {
			console.log("expandedRowsChange:",r)
		},
		onExpand(exp,r) { 
			console.log("onExpand: ",exp,r);
		},
		rowColor(row) {
			if(row.tp) return "tiggered"
			return ""
		},
		timeStamp(ts) {
			return ts.split("T")[0]
		}
	},	
	mounted() {
		this.$store.dispatch("stockwatch/getStockWatches");
	}
})
</script>

<style>
.tiggered { background-color:rgb(174, 243, 174) }
</style>