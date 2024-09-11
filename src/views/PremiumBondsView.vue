<template>
	<div>
		<a-row :gutter="24" type="flex">
			<a-col :span="24" class="mb-24" v-if="premiumBondsData.length>0">
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
							:columns="cols"
							:data-source="holder.results" 
							:pagination="false"
							:rowKey="(record,i) => i"
							class='table table-small' style="margin: 0; background-color: white;">	
							<template slot="date" slot-scope="date"><p class="m-0 font-regular text-muted">{{ date }}</p></template>
							<template slot="bond" slot-scope="bond"><p class="m-0 font-regular text-muted">{{ bond }}</p></template>
							<template slot="prize" slot-scope="prize"><p class="m-0 font-regular text-muted">{{ prize }}</p></template>
						</a-table>
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

const cols = [
	{ title: 'Date', dataIndex: 'date', width: 50, scopedSlots: { customRender: 'date' }},
	{ title: 'Bond', dataIndex: 'bond_number', width: 50, scopedSlots: { customRender: 'bond_number' }},
	{ title: 'Prize', dataIndex: 'prize', width: 50, scopedSlots: { customRender: 'prize' }},
];

export default ({
	components: {},
	computed: {
    	...mapState("pb", ["holders","premiumBondsData"]),
		...mapGetters("pb", ['getHoldersQry','getHolderValue','getHolderWinRate']),
	},
	watch: {
		holders(nn,prv) {			
			this.$store.dispatch("pb/getPremiumBondsData",{ holders: this.getHoldersQry });
		}
	},
	data() {
		return {
			cols,
			activeKey: 0,
			tabs:[]
		}
	},
	mounted() {
        this.$store.dispatch("pb/getHolders")
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