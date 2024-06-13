<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">
		<a-table 
			:columns="columns" 
			:data-source="etfs" 
			:pagination="pagination"
			@expand="onExpand"
			:rowKey="(record,i) => i"
			class='table table-small' style="margin:6">

			<div slot="filterDropdown"
				slot-scope="{setSelectedKeys,selectedKeys,confirm,clearFilters,column}"
				style="padding: 8px">
				<a-input
					v-ant-ref="c => (searchInput = c)"
					:placeholder="`Search ${column.dataIndex}`"
					:value="selectedKeys[0]"
					style="width:188px; margin-bottom:8px; display: block"
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
				:style="{ color: filtered ? '#108ee9' : undefined }"/>

			<div slot="expandedRowRender" slot-scope="record" style="margin: 0">
				<a-tabs default-active-key="0">
					<a-tab-pane key="0" tab="Chart">
						<h6><a :href="record.href" target="_blank">{{ record.name }}</a></h6>
						<img  :src="getChart(record.sedol)" alt="Performance Chart" />
					</a-tab-pane>

					<a-tab-pane key="1" tab="Holdings">
						
					</a-tab-pane>
					<a-tab-pane key="2" tab="Performance">
					</a-tab-pane>
					<a-tab-pane key="3" tab="Sectors">
					</a-tab-pane>
					<a-tab-pane key="4" tab="Countries">
					</a-tab-pane>
					<a-tab-pane key="5" tab="RawData">
						<pre>{{ gEtfDetail(record.sedol) }}</pre>
					</a-tab-pane>

				</a-tabs>
			</div>

			<!-- Etf Name -->
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
		</a-table>
	</a-card>
</template>

<script>
import CardChartInfoIframe from '@/components/Cards/CardChartInfoIframe';

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
	    sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.name.localeCompare(b.name),
	    onFilter: (value, record) =>
    	  record.name
        	.toString()
        	.toLowerCase()
        	.includes(value.toLowerCase()),
		scopedSlots: { 
			customRender: 'name', 
	      	filterDropdown: 'filterDropdown',
 	     	filterIcon: 'filterIcon'
		},		
		width: 500, 
	},{
		title: 'Provider',
		dataIndex: 'provider',
	    sortDirections: ["descend", "ascend"],
    	sorter: (a, b) => a.provider.localeCompare(b.provider),
		scopedSlots: { customRender: 'provider' },
		width: 320, 
	},
	{
		title: 'Sedol',
		dataIndex: 'sedol',
		scopedSlots: { customRender: 'sedol' },
		width: 120, 
	},
	{
		title: 'Non-LSE',
		dataIndex: 'nonLSE',
		scopedSlots: { customRender: 'nonLSE' },
		width: 80, 
	},
	{
		title: 'Fees',
		dataIndex: 'mfee',
		sorter: (a, b) => a.mfee - b.mfee,
    	sortDirections: ["descend", "ascend"],
		scopedSlots: { customRender: 'mfee' },
	}
];

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardChartInfoIframe
	},
	computed: {
    	...mapState("etfs", ["etfs"]),
		...mapGetters("etfs",["gEtfDetail"]),

	},
	data() {
		return {
			columns,
			pagination: { pageSize: 1000 },

			curExpandedRowKeys: [],
			selectedRowKeys: [],
			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",
		}
	},
	methods: {
		handleSearch(selectedKeys, confirm, dataIndex) {
      		confirm();
      		this.searchText = selectedKeys[0];
      		this.searchedColumn = dataIndex;
    	},
    	handleReset(clearFilters) {
      		clearFilters();
      		this.searchText = "";
    	},
		getChart(sedol) {
			return `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_SEDOL=${sedol}&amp;WIDTH=511&amp;HEIGHT=239&amp;TIME_SPAN=10Y&amp;SUBSAMPLINGGRANULARITY=MONTH&amp;XAXISCLOSECOL=0&amp;LINE_WIDTH=2&amp;MOUNTAIN_COLOR1=ffffff&amp;MOUNTAIN_COLOR2=ffffff&amp;MOUNTAIN_COLOR3=ffffff&amp;MOUNTAIN_COLOR4=ffffff&amp;ID_NOTATION_COLOR1=0000FF`
		},
		getEtfDetail(etf) {
			this.$store.dispatch("etfs/getetfDetail",{etf: etf });
		},
		getEtfDetail2() {
			console.log("getEtfDetail2")
		},
		//expandedRowRender(record) {
      	//	return `<p>${record.name}'s details</p>`;
    	//}
		//,
    	onExpand(expanded, record) {
			this.$store.dispatch("etfs/getEtfDetail",{sedol: record.sedol });
    	},
	},
	mounted() {
		this.$store.dispatch("etfs/getETFs");
	}
})
</script>

<style lang="scss">
</style>