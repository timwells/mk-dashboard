<template>
	<div>
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24" v-if="premiumBondsData.length>0">
				<h6>{{ nextPrizeDrawDate }}</h6>
				<a-tabs v-model="activeKey">
					<a-tab-pane v-for="(holder,i) in premiumBondsData" :key="i" :tab="holder.name">
						<a-row>
							<a-col :span="4"><a-statistic title="Holder" :value="getHolder(holder.holder)" /></a-col>
							<a-col :span="4"><a-statistic title="Prizes" :value="holder.results.length" /></a-col>
							<a-col :span="4"><a-statistic title="Total" :value="holder.sum" /></a-col>
							<a-col :span="4"><a-statistic title="Holdings" :value="getHolderValue2(holder.name)" /></a-col>
							<a-col :span="4"><a-statistic title="6MWR" :value="getHolderWinRate2(holder.name,holder.sum)" /></a-col>
						</a-row>
						<a-table
							:columns="prizeCols"
							:data-source="holder.results" 
							:pagination="false"
							:rowKey="(record,i) => i"
							class='table table-small' style="margin: 0; background-color: white;">	
							<template slot="date" slot-scope="date"><p class="m-0 font-regular text-muted">{{ date }}</p></template>
							<template slot="bond" slot-scope="bond"><p class="m-0 font-regular text-muted">{{ bond }}</p></template>
							<template slot="prize" slot-scope="prize"><p class="m-0 font-regular text-muted">{{ prize }}</p></template>
						</a-table>
					</a-tab-pane>
					<a-tab-pane tab="Winners">
						<a-row>
							<a-col :span="4"><a-statistic title="Winners" :value="getWinnersCount()"/></a-col>
							<a-col :span="4"><a-statistic title="50K Holders" :value="getMaxHoldersCount()" /></a-col>
							<a-col :span="4"><a-statistic title="Ratio" :value="getMaxHolderWinnerRatio()" /></a-col>
							<a-col :span="4"></a-col>
						</a-row>
						<a-table
							:columns="winnersCols"
							:data-source="winners" 
							:pagination="false"
							:rowKey="(record,i) => i"
							class='table table-small' style="margin: 0; background-color: white;">
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
									@click="() =>handleSearch(selectedKeys, confirm, column.dataIndex)">
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

							<template slot="full_description" slot-scope="text, record, index, column">
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
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-row>
	</div>
</template>

<script>

import { mapState, mapGetters } from "vuex";

const prizeCols = [
	{ title: 'Date', dataIndex: 'date', width: 50, scopedSlots: { customRender: 'date' }},
	{ title: 'Bond', dataIndex: 'bond_number', width: 50, scopedSlots: { customRender: 'bond_number' }},
	{ title: 'Prize', dataIndex: 'prize', width: 50, scopedSlots: { customRender: 'prize' }},
];

const winnersCols = [
{ title: 'Prize', 
	width: 180,
	dataIndex: 'prize',
	sortDirections: ["descend", "ascend"],
	sorter: (a, b) => a.prize - b.prize},
{ title: 'Area', 
	width: 240,
	dataIndex: 'area',sortDirections: ["descend", "ascend"],
	sorter: (a, b) => a.area.localeCompare(b.area),
	onFilter: (value, record) => record.area.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { 
			customRender: 'full_description', 
	      	filterDropdown: 'filterDropdown',
 	     	filterIcon: 'filterIcon'
		},
},
{ title: 'Bond', 
	dataIndex: 'bondNumber'},
{ title: 'Holdings', 
	dataIndex: 'holdings',sortDirections: ["descend", "ascend"],sorter: (a, b) => a.holdings - b.holdings},
{ title: 'Purchased', 
	dataIndex: 'purchaseDate',sortDirections: ["descend", "ascend"],sorter: (a, b) => a.purchaseDate.localeCompare(b.purchaseDate),}
];

export default ({
	components: {},
	computed: {
    	...mapState("pb", ["holders","premiumBondsData","nextPrizeDrawDate","winners"]),
		...mapGetters("pb", ['getHoldersQry','getHolderValue','getHolderWinRate','getHoldersQry',
							'getWinnersCount',
							'getMaxHoldersCount',
							'getMaxHolderWinnerRatio'
						]),
	},
	watch: {
		holders(nn,prv) {			
			this.$store.dispatch("pb/getPremiumBondsData",{ holders: this.getHoldersQry });
		}
	},
	data() {
		return {
			activeKey: 0,
			tabs:[],
			winnersCols,
			prizeCols,

			selectedRowKeys: [],
			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",
		}
	},
	mounted() {
        this.$store.dispatch("pb/getHolders")
		this.$store.dispatch("pb/getNextPrizeDrawDate")
		this.$store.dispatch("pb/getWinners")
	},
	methods: {
		getHolder(name) { return name !== undefined ? " "+name: ''},
		getHolderValue2(name) { return name !== undefined ? this.getHolderValue(name) : "-"},
		getHolderWinRate2(name,winnings) { return this.getHolderWinRate(name,winnings) + "%"},

		handleSearch(selectedKeys, confirm, dataIndex) {
      		confirm();
      		this.searchText = selectedKeys[0];
      		this.searchedColumn = dataIndex;
    	},
    	handleReset(clearFilters) {
      		clearFilters();
      		this.searchText = "";
    	},		
	}
})
</script>

<style>
	.ant-table-thead > tr > th, 
	.ant-table-tbody > tr > td { 
		padding: 8px 8px; 
	}
</style>