<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">			
			<a-table ref="tt" v-if="stockWatches"
				:columns="stockWatchColumns" 
				:data-source="stockWatches" 
				:pagination="pagination"
				:rowKey="(record,index) => index"
				class='table table-small' style="margin: 0; background-color: white;">

				<template slot="epic" slot-scope="epic"><p class="m-0 font-regular text-muted">{{ epic }}</p></template>
				<template slot="price" slot-scope="price"><p class="m-0 font-regular text-muted">{{ price }}</p></template>				
				<template slot="buy" slot-scope="tp">
					<p class="m-0 font-regular text-muted">
						{{ tp }}
					</p></template>
				<template slot="timestamp" slot-scope="timestamp"><p class="m-0 font-regular text-muted">{{ timestamp }}</p></template>	
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

const stockWatchColumns = 
[
	{ title: 'Epic', dataIndex: 'n', scopedSlots: { customRender: 'epic' }},
	{ title: 'Price', dataIndex: 'v', scopedSlots: { customRender: 'price' }},
	{ title: 'Buy', dataIndex: 'tp',scopedSlots: { customRender: 'buy' }},
	{ title: 'TimeStamp', dataIndex: 'ts',scopedSlots: { customRender: 'timestamp' }}
];

import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("stockwatch", ["stockWatches"])	
	},
	data() {
		return {
			stockWatchColumns,
			pagination: { 
				pageSize: 10, onChange: (p) => {
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
	},	
	mounted() {
		this.$store.dispatch("stockwatch/getStockWatches");
	}
})
</script>

<style lang="scss"></style>