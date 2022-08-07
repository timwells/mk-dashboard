<template>

  <a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table v-if="dataroma"
				:columns="sivcols" 
				:data-source="dataroma" 
				:pagination="pagination"
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
  data() {
    return {
			sivcols,
			pagination: { pageSize: 80 },
    }
  },
	methods: {
   	onExpand(record) {
      // console.log('onExpand:',record)
  		//this.$store.dispatch("wscrape/getDataromaHoldings",{ q: record.detail });
    },
  },
	mounted() {
		this.$store.dispatch("wscrape/getDataroma");
	}
})
</script>

<style>

</style>