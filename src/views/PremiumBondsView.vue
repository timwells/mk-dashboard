<template>
	<a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-tabs v-if="premiumBondsData.length>0" v-model="activeTab">
				<a-tab-pane v-for="(holder,index) in premiumBondsData" :key="index" :tab="holder.name">
					<a-row>
						<a-col :span="4">
							<a-statistic title="Holder" :value="holder.holder" />
						</a-col>
						<a-col :span="4">
							<a-statistic title="Prizes" :value="holder.results.length" />
						</a-col>
						<a-col :span="4">
							<a-statistic title="Sum" :value="holder.sum" />
						</a-col>
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
		</a-col>
	</a-row>
</template>

<script>
import { mapState } from "vuex";

const PREMUIM_BOND_HOLDERS = process.env.VUE_APP_PREMIUM_BONDS;

const cols = [
	{ title: 'Date', dataIndex: 'date', width: 50, scopedSlots: { customRender: 'date' }},
	{ title: 'Bond', dataIndex: 'bond_number', width: 50, scopedSlots: { customRender: 'bond_number' }},
	{ title: 'Prize', dataIndex: 'prize', width: 50, scopedSlots: { customRender: 'prize' }},
];

export default ({
	components: {
	},
	computed: {
    	...mapState("wscrape", ["premiumBondsData"])
	},
	watch: {
        premiumBondsData(o,n) {
			this.loading = false;
		},
	},
	data() {
		return {
			cols,
			loading: true,
			activeTab: 0,
			pagination: { 
				pageSize: 200, onChange: (p) => {
				},
			},
		}
	},
	mounted() {
        this.$store.dispatch("wscrape/getPremiumBondsData",{holders: PREMUIM_BOND_HOLDERS});
	}
})

</script>

<style>

</style>