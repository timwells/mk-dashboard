<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table ref="tt" v-if="nakedTrades"
				:columns="fundsColumns" 
				:data-source="nakedTrades" 
				:pagination="pagination"
				:rowKey="(record,index) => index"
				@expand="onExpand"
				@expandedRowsChange="expandedRowsChange"
				class='table table-small' style="margin: 0; background-color: white;">
				
				<template slot="expandedRowRender" slot-scope="record" style="margin: 0">
					<a-row :gutter="24" type="flex">
						<a-col :span="18">
							<WidgetTradingView :symbol="fullSymbol(record.epic)" @container="container"></WidgetTradingView>
						</a-col>						
						<a-col :span="6">
							<!--CardTraderBrokerInfo :symbol="fullSymbol(record.epic)"></CardTraderBrokerInfo-->
						</a-col>						
					</a-row>
				</template>

				<template slot="stock" slot-scope="stock"><p class="m-0 font-regular text-muted">{{ stock }}</p></template>
				<template slot="epic" slot-scope="epic"><p class="m-0 font-regular text-muted">{{ epic }}</p></template>
				<template slot="qty" slot-scope="qty"><p class="m-0 font-regular text-muted">{{ qty }}</p></template>
				<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>
				<template slot="target" slot-scope="target"><p class="m-0 font-regular text-muted">{{ target }}</p></template>
				<template slot="stop" slot-scope="stop"><p class="m-0 font-regular text-muted">{{ stop }}</p></template>
				<template slot="buydate" slot-scope="buydate"><p class="m-0 font-regular text-muted">{{ buydate }}</p></template>
				<template slot="sell" slot-scope="sell"><p class="m-0 font-regular text-muted">{{ sell }}</p></template>
				<template slot="selldate" slot-scope="selldate"><p class="m-0 font-regular text-muted">{{ selldate }}</p></template>
				<template slot="pl" slot-scope="pl"><p class="m-0 font-regular text-muted">{{ pl }}</p></template>	
			</a-table>
		</a-col>
	</a-row>
</template>

<script>
const fundsColumns = [
	{ title: 'Stock', dataIndex: 'stock', scopedSlots: { customRender: 'stock' }},
	{ title: 'Epic', dataIndex: 'epic', scopedSlots: { customRender: 'epic' }},
	{ title: 'Qty',dataIndex: 'qty',scopedSlots: { customRender: 'qty' }},
	{ title: 'Price', dataIndex: 'price', scopedSlots: { customRender: 'price' }},
	{ title: 'Target',dataIndex: 'target',scopedSlots: { customRender: 'target' }},
	{ title: 'Stop',dataIndex: 'stop',scopedSlots: { customRender: 'stop' }},
	{ title: 'Buy Date',dataIndex: 'buydate',scopedSlots: { customRender: 'buydate' }},
	{ title: 'Sell', dataIndex: 'sell', scopedSlots: { customRender: 'sell' }},
	{ title: 'Sell Date', dataIndex: 'selldate', scopedSlots: { customRender: 'selldate' }},
	{ title: 'P/L ', dataIndex: 'pl',scopedSlots: { customRender: 'pl' }}
];

import { mapState } from "vuex";
import WidgetTradingView from "@/components/Widgets/WidgetTradingView";

const epicCorrections = [{in:"T17",out:"TM17"}]

// https://blog.katastros.com/a?ID=01750-67585afe-3add-4a2a-929a-d49a26d82b6c

export default ({
	components: {
		WidgetTradingView
	},
	computed: {
    	...mapState("wscrape", ["nakedTrades"])	
	},
	data() {
		return {
			fundsColumns,
			pagination: { 
				pageSize: 10, onChange: (p) => {
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
   		onExpand(exp,r) { 
			console.log("onExpand: ",exp,r);
			if(!exp) {
				//console.log("onExpand - DELETE-1",this.$children)
				// console.log("onExpand - DELETE-2",this)
				//console.log("onExpand - DELETE-2",this.$destroy())
				// this.$el.children.removeChild(this.$el)
			}
			// console.log(this.$refs.tt)
		},
		expandedRowsChange(r) {
			console.log("expandedRowsChange:",r)
		},
		customRow(record) {
      		return { on: { click: event => { console.log("customRow:",event, record);}} };
   	 	},
		container(id) {
			this.expandedIdList.push(id)
			// console.log("expandedIdList:",this.expandedIdList)
		}
	},	
	mounted() {
		this.$store.dispatch("wscrape/getNakedTrades");
	}
})
</script>

<style lang="scss"></style>