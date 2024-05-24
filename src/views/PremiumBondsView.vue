<template>
	<a-row :gutter="24" type="flex">
		<a-col v-if="show" :span="24" class="mb-24">
			<div v-if="holders.length>0 && premiumBondsData.results.length>0">
				<h5>{{premiumBondsData.nextDrawDate}}</h5>
				<a-tabs v-if="holders.length" v-model="activeTab">
					<a-tab-pane v-for="(holder,index) in premiumBondsData.results" :key="index" :tab="holder.name">
					
						<a-row>
							<a-col :span="4"><a-statistic title="Holder" :value="getHolder(holder.holder)" /></a-col>
							<a-col :span="4"><a-statistic title="Prizes" :value="holder.results.length" /></a-col>
							<a-col :span="4"><a-statistic title="Sum" :value="holder.sum" /></a-col>
							<a-col :span="4"><a-statistic title="Holdings" :value="getHolderValue2(holder.name)" /></a-col>
							<a-col :span="4"><a-statistic title="6MWR" :value="getHolderWinRate2(holder.name,holder.sum)" /></a-col>
						</a-row>

						<a-table
							:loading="loading"
							:columns="cols"
							:data-source="holder.results" 
							:pagination="pagination"
							:rowKey="(record,index) => index"
							class='table table-small' style="margin: 0; background-color: white;">	
							
							<template slot="date" slot-scope="date"><p class="m-0 font-regular text-muted">{{ date }}</p></template>
							<template slot="bond" slot-scope="bond"><p class="m-0 font-regular text-muted">{{ bond }}</p></template>
							<template slot="prize" slot-scope="prize"><p class="m-0 font-regular text-muted">{{ prize }}</p></template>

						</a-table>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-col>
	</a-row>
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
        premiumBondsData(nn, prv) {
			if(nn != null) {
				this.show = true;
				this.loading = false;
			}
		},
		holders(nn,prv) {
			this.$store.dispatch("pb/getPremiumBondsData",{ holders: this.getHoldersQry });
		}
	},
	data() {
		return {
			show: false,
			cols,
			loading: true,
			activeTab: 0,
			pagination: { pageSize: 200, onChange: (p) => {}},
		}
	},
	mounted() {
        this.$store.dispatch("pb/getHolders")
	},
	methods: {
		getHolder(name) { return " "+name},
		getHolderValue2(name) { return this.getHolderValue(name)},
		getHolderWinRate2(name,winnings) { return this.getHolderWinRate(name,winnings) + "%"},
	}

})

</script>

<style>
	.ant-table-thead > tr > th, .ant-table-tbody > tr > td { padding: 8px 8px; }
</style>