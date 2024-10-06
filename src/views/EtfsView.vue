<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="ETFs">
			<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">
				<a-row :gutter="24" type="flex">
						<a-col :span="4">
							<a-statistic v-if="etfsCompanies" title="Live: HL-Providers" :value="etfsCompanies.length" />
						</a-col>
						<a-col :span="4">
							<a-statistic v-if="etfsCompanies" title="Cached: HL-Providers" :value="etfsCompanies.length" />
						</a-col>
						<a-col :span="4">
							<a-statistic v-if="etfsObj" title="Cached Date" :value="etfsCreatedDate()" />
						</a-col>
						<a-col :span="4">
							<a-button @click="refreshEtfs()" :disabled="isDisabled">Refresh Etfs</a-button>
						</a-col>
						<a-col :span="8">
							<a-progress type="circle" :percent="etfsRefreshProgress" :width="60" />
						</a-col>
				</a-row>
				<a-row>
					<a-table 
						:columns="COLUMNS" 
						:data-source="etfsObj.data" 
						:pagination="false"
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
									<a-row :gutter="24" type="flex">
										<a-col :span="18" class="mb-18">							
											<a-card class="card-content">					
												<h6><a :href="getSource(record.sedol)" target="_blank">{{ record.name }}</a></h6>
												<img :src="getChart(record.sedol)" alt="Performance Chart" width="100%" />									
												<!--p v-if="gEtfDetail(record.sedol)">{{gEtfDetail(record.sedol).aim}}</p-->
											</a-card>
										</a-col>
										<a-col :span="6" class="mb-6">
											<a-card class="card-content">
												<a-table v-if="etfDetailFilter(record.sedol)"
													:columns="PRICES_Columns"
													:data-source="etfDetailFilter(record.sedol).data.prices"
													:pagination="false">
												</a-table>
											</a-card>
											<a-card class="card-content">
												<a-table v-if="etfDetailFilter(record.sedol)"
													:columns="COSTS_Columns"
													:data-source="etfDetailFilter(record.sedol).data.costs"
													:pagination="false">
												</a-table>		
											</a-card>
										</a-col>
									</a-row>
								</a-tab-pane>
								<a-tab-pane key="1" tab="Holdings">
									<a-card v-if="etfDetailFilter(record.sedol)" hoverable style="padding: 10px;">
										<template #cover>
											<a-table
												:columns="HOLDING_Columns"
												:data-source="etfDetailFilter(record.sedol).data.holdings"
												:pagination="false"
												:rowKey="(record,i) => i"
												class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
												<template slot="security" slot-scope="security">
													<p class="m-0 font-regular text-muted">{{ security }}</p>
												</template>
												<template slot="weight" slot-scope="weight">
													<p class="m-0 font-regular text-muted">{{ weight }}</p>
												</template>
											</a-table>
										</template>
										<!--a-card-meta>
											<template #description>
												<h5>Sum: {{ gEtfHoldingsSum(record.sedol) }}%</h5>
											</template>
										</a-card-meta-->
									</a-card>					
								</a-tab-pane>
								<!--a-tab-pane key="2" tab="Performance">
								</a-tab-pane-->
								<a-tab-pane key="2" tab="Sectors">
									<a-card class="card-content">
										<a-table v-if="etfDetailFilter(record.sedol)"
											:columns="SECTOR_Columns"
											:data-source="etfDetailFilter(record.sedol).data.sectors"
											:pagination="false"
											:rowKey="(record,i) => i"
											class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
											<template slot="country" slot-scope="country">
												<p class="m-0 font-regular text-muted">{{ country }}</p>
											</template>
											<template slot="weight" slot-scope="weight">
												<p class="m-0 font-regular text-muted">{{ weight }}</p>
											</template>
										</a-table>						
									</a-card>
								</a-tab-pane>
								<a-tab-pane key="3" tab="Countries"T>
									<a-card class="card-content">
										<a-table v-if="etfDetailFilter(record.sedol)"
											:columns="COUNTRY_Columns"
											:data-source="etfDetailFilter(record.sedol).data.countries"
											:pagination="false"
											:rowKey="(record,i) => i"
											class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
											<template slot="country" slot-scope="country">
												<p class="m-0 font-regular text-muted">{{ country }}</p>
											</template>
											<template slot="weight" slot-scope="weight">
												<p class="m-0 font-regular text-muted">{{ weight }}</p>
											</template>
										</a-table>						
									</a-card>						
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
				</a-row>
			</a-card>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Infrastructure">
		</a-tab-pane>
		<a-tab-pane key="3" tab="Energy">
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import CardChartInfoIframe from '@/components/Cards/CardChartInfoIframe';
import { 
	HOLDING_Columns,
    PERIOD_Columns,
    SECTOR_Columns,
    COUNTRY_Columns,
	COSTS_Columns,
	PRICES_Columns
} from '@/common/table'



const COLUMNS = [
	/* { title: 'Id', dataIndex: 'id',}, */
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
	},
	{
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
];

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardChartInfoIframe
	},
	computed: {
    	// ...mapState("etfs", ["etfs"]),
		// ...mapGetters("etfs",["gEtfDetail","gEtfHoldingsSum"]),
		...mapGetters("hl",["etfDetailFilter",]),
		...mapState("hl",["etfsCompanies","etfsRefreshProgress","etfsRefreshComplete","etfsObj"])
	},
	data() {
		return {
			COLUMNS,
			pagination: { pageSize: 1000 },

			curExpandedRowKeys: [],
			selectedRowKeys: [],
			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",


			HOLDING_Columns,
			SECTOR_Columns,
			COUNTRY_Columns,
			COSTS_Columns,
			PRICES_Columns,

			isDisabled: false,
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
			return `https://chart.hl.co.uk/charts/chart.jsproto_large.chart?ID_SEDOL=${sedol}&amp;WIDTH=511&amp;HEIGHT=239&amp;TIME_SPAN=20Y&amp;SUBSAMPLINGGRANULARITY=MONTH&amp;XAXISCLOSECOL=0&amp;LINE_WIDTH=2&amp;MOUNTAIN_COLOR1=ffffff&amp;MOUNTAIN_COLOR2=ffffff&amp;MOUNTAIN_COLOR3=ffffff&amp;MOUNTAIN_COLOR4=ffffff&amp;ID_NOTATION_COLOR1=0000FF`
		},
		getSource(sedol) {
			return `https://www.hl.co.uk/shares/shares-search-results/${sedol}`
		},
		etfsCreatedDate() {
			if(this.etfsObj) return this.etfsObj.created.split("T")[0]
			return ""
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
			// this.$store.dispatch("etfs/getEtfDetail",{sedol: record.sedol });
			this.$store.dispatch("hl/getEtfDetails",{sedol: record.sedol });
    	},
	
		refreshEtfs() {
			console.log("refreshEtfs")
			this.$store.dispatch("hl/refreshEtfs")
		}
	},
	mounted() {
		//this.$store.dispatch("etfs/getETFs");
		this.$store.dispatch("hl/getEtfsCompanies")
		this.$store.dispatch("hl/getEtfs")
	}
})
</script>

<style lang="scss">
</style>