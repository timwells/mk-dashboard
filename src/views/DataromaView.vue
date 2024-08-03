<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">
		<a-table
			:loading="loading"
			:columns="sivcols" 
			:data-source="dataroma" 
			:pagination="false"
			:rowKey="record => record.key"
			class='table table-small' style="margin: 6;">
				<div slot="filterDropdown"
					slot-scope="{setSelectedKeys,selectedKeys,confirm,clearFilters,column}"
					style="padding: 8px">
					<a-input
						v-ant-ref="c => (searchInput = c)"
						:placeholder="`Search ${column.dataIndex}`"
						:value="selectedKeys[0]"
						style="width: 188px; margin-bottom: 8px; display: block"
						@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
						@pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"/>
					<a-button
						type="primary"
						icon="search"
						size="small"
						style="width: 90px; margin-right: 8px"
						@click="() => handleSearch(selectedKeys, confirm, column.dataIndex)">
						Search</a-button>
					<a-button
						size="small"
						style="width: 90px"
						@click="() => handleReset(clearFilters)">
						Reset
					</a-button>
				</div>
				<a-icon
					slot="filterIcon"
					slot-scope="filtered"
					type="search"
					:style="{ color: filtered ? '#108ee9' : undefined }"
				/>
			<a-button icon="plus" type="primary" slot="action" slot-scope="record" onClick="onExpand(record)"></a-button>

			<div slot="expandedRowRender" slot-scope="record" style="margin: 0">
				<DataromaHoldingsView :detail="record.detail"></DataromaHoldingsView>
			</div>

			<template slot="name" slot-scope="text, record, index, column">
				<span v-if="searchText && searchedColumn === column.dataIndex">
					<template v-for="(fragment, i) in text
						.toString()
						.split(new RegExp(`(?<=${searchText})|(?=${searchText})`,'i'))">
						<mark v-if="fragment.toLowerCase() === searchText.toLowerCase()"
							:key="i"
							class="highlight">{{ fragment }}</mark>
						<template v-else>{{ fragment }}</template>
					</template>
				</span>
				<template v-else>
					{{ text }}
				</template>
			</template>

			<template slot="lastUpdate" slot-scope="lastUpdate">
				<p class="m-0 font-regular text-muted">{{ lastUpdate }}</p>
			</template>
		</a-table>
	</a-card>
</template>

<script>
const sivcols = [
{
	title: 'Name',
	dataIndex: 'name',
	sortDirections: ["descend", "ascend"],
	sorter: (a, b) => a.name.localeCompare(b.name),
	onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
	scopedSlots: { 
		customRender: 'name', 
	    filterDropdown: 'filterDropdown',
 	    filterIcon: 'filterIcon'
	},
	width: 500, 
},{
	title: 'Updated',
	dataIndex: 'lastUpdate',
	sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.lastUpdate.localeCompare(b.lastUpdate),
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

			curExpandedRowKeys: [],
			selectedRowKeys: [],
			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",
    	}
  	},
	methods: {
   		onExpand(record) {
      		// console.log('onExpand:',record)
  			//this.$store.dispatch("wscrape/getDataromaHoldings",{ q: record.detail });
    	},
		handleSearch(selectedKeys, confirm, dataIndex) {
      		confirm();
      		this.searchText = selectedKeys[0];
      		this.searchedColumn = dataIndex;
    	},
    	handleReset(clearFilters) {
      		clearFilters();
      		this.searchText = "";
    	},

  	},
	mounted() {
		this.loading = true;
		this.$store.dispatch("wscrape/getDataroma");
	}
})
</script>

<style lang="scss">
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 6px 6px;
}
</style>