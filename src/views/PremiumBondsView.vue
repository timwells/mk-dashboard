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
	dataIndex: 'prize',sortDirections: ["descend", "ascend"],sorter: (a, b) => a.prize - b.prize},
{ title: 'Area', 
	dataIndex: 'area',sortDirections: ["descend", "ascend"],sorter: (a, b) => a.area.localeCompare(b.area)},
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
			prizeCols
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
	}
})
</script>

<style>
	.ant-table-thead > tr > th, 
	.ant-table-tbody > tr > td { 
		padding: 8px 8px; 
	}
</style>