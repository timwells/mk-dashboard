<template>
  <a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table
				:loading="loading"
				:columns="sivcols" 
				:data-source="dataroma" 
				:pagination="pagination"
				:rowKey="(record,index) => index"
				class='table table-small' style="margin: 0; background-color: white;">
				
				<a-button icon="plus" type="primary" slot="action" slot-scope="record" onClick="onExpand(record)"></a-button>

        		<div slot="expandedRowRender" slot-scope="record" style="margin: 0">
          			<DataromaHoldingsView :detail="record.detail"></DataromaHoldingsView>
				</div>

				<template slot="name" slot-scope="name">
					<p class="m-0 font-regular text-muted">{{ name }}</p>
				</template>
				<template slot="lastUpdate" slot-scope="lastUpdate">
					<p class="m-0 font-regular text-muted">{{ lastUpdate }}</p>
				</template>
			</a-table>
		</a-col>
	</a-row>
</template>

<script>
const sivcols = [{
	title: 'Name',
	dataIndex: 'name',
	scopedSlots: { customRender: 'name' }
},
{
	title: 'Updated',
	dataIndex: 'lastUpdate',
	scopedSlots: { customRender: 'lastUpdate' }
}
];

import { mapState } from "vuex";
import DataromaHoldingsView from '@/views/DataromaHoldingsView.vue';

export default ({
	components: {
    	DataromaHoldingsView
  	},
	computed: {
    	...mapState("wscrape", ["dataroma"])	
	},
	watch: {
		dataroma(o,n) {
			this.loading = this.dataroma.length > 0 ? false: true
		}
	},
  	data() {
    	return {
			loading: true,
			sivcols,
			pagination: { pageSize: 200 },
    	}
  	},
	methods: {
   		onExpand(record) {
      		// console.log('onExpand:',record)
  			//this.$store.dispatch("wscrape/getDataromaHoldings",{ q: record.detail });
    	},
  	},
	mounted() {
		this.loading = true;
		this.$store.dispatch("wscrape/getDataroma");
	}
})
</script>

<style>

</style>