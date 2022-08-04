<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table v-if="trades"
				:columns="fundsColumns" 
				:data-source="trades" 
				:pagination="pagination"
				class='table table-small' style="margin: 6; background-color: white;">
				
				<a-button icon="plus" type="primary" slot="action" slot-scope="record" @click="onExpand(record.key)"></a-button>

				<div slot="expandedRowRender" slot-scope="record" style="margin: 0">
					<CardTraderChart :symbol="fullSymbol(record.epic)"></CardTraderChart>
				</div>

				<template slot="stock" slot-scope="stock">
					<p class="m-0 font-regular text-muted">{{ stock }}</p>
				</template>
				<template slot="epic" slot-scope="epic">
					<p class="m-0 font-regular text-muted">{{ epic }}</p>
				</template>
				<template slot="qty" slot-scope="qty">
					<p class="m-0 font-regular text-muted">{{ qty }}</p>
				</template>
				<template slot="price" slot-scope="price">
					<p class="m-0 font-regular text-muted">{{ price }}</p>
				</template>
				<template slot="target" slot-scope="target">
					<p class="m-0 font-regular text-muted">{{ target }}</p>
				</template>
				<template slot="stop" slot-scope="stop">
					<p class="m-0 font-regular text-muted">{{ stop }}</p>
				</template>
				<template slot="buydate" slot-scope="buydate">
					<p class="m-0 font-regular text-muted">{{ buydate }}</p>
				</template>
				<template slot="sell" slot-scope="sell">
					<p class="m-0 font-regular text-muted">{{ sell }}</p>
				</template>
				<template slot="selldate" slot-scope="selldate">
					<p class="m-0 font-regular text-muted">{{ selldate }}</p>
				</template>
				<template slot="pl" slot-scope="pl">
					<p class="m-0 font-regular text-muted">{{ pl }}</p>
				</template>	
			</a-table>
		</a-col>
	</a-row>
</template>

<script>
const fundsColumns = [{
		title: 'Stock',
		dataIndex: 'stock',
		scopedSlots: { customRender: 'stock' },
	},{
		title: 'Epic',
		dataIndex: 'epic',
		scopedSlots: { customRender: 'epic' },
	},{
		title: 'Qty',
		dataIndex: 'qty',
		scopedSlots: { customRender: 'qty' },
	},{
		title: 'Price',
		dataIndex: 'price',
		scopedSlots: { customRender: 'price' },
	},{
		title: 'Target',
		dataIndex: 'target',
		scopedSlots: { customRender: 'target' },
	},{
		title: 'Stop',
		dataIndex: 'stop',
		scopedSlots: { customRender: 'stop' },
	},{
		title: 'Buy Date',
		dataIndex: 'buydate',
		scopedSlots: { customRender: 'buydate' },
	},{
		title: 'Sell',
		dataIndex: 'sell',
		scopedSlots: { customRender: 'sell' },
	},{
		title: 'Sel Date',
		dataIndex: 'selldate',
		scopedSlots: { customRender: 'selldate' },
	},{
		title: 'P/L ',
		dataIndex: 'pl',
		scopedSlots: { customRender: 'pl' }
	}
];

import { mapState } from "vuex";
import CardTraderChart from "@/components/Cards/CardTraderChart";

export default ({
	components: {
		CardTraderChart
	},
	computed: {
    	...mapState("wscrape", ["trades"])
		
	},
	data() {
		return {
			fundsColumns,
			pagination: { pageSize: 60 },
			symbol: 'LSE:SQZ'
		}
	},
	methods: {
		fullSymbol(epic) {
			console.log("fullSymbol: ",epic)
			return "LSE:" + epic; 
		},
   		onExpand(rowkey) {
			/*
			if (this.curExpandedRowKeys.length > 0) {
				let index = this.curExpandedRowKeys.indexOf(rowkey);
				if (index > -1) {
					this.curExpandedRowKeys.splice(index, 1);
				} else {
					this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length);
					this.curExpandedRowKeys.push(rowkey);
				}
			} else {
				this.curExpandedRowKeys.push(rowkey);
			}
			*/
		}
	},	
	mounted() {
		this.$store.dispatch("wscrape/getNakedTrades");
	}
})
</script>

<style lang="scss"></style>