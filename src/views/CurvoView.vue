<template>
	<a-tabs  default-active-key="1">
		<a-tab-pane key="1" tab="Ratios">
			<div v-if="assetmap.length>0">
				<a-select mode="multiple" allowClear optionFilterProp="label" placeholder="dataset" style="width: 100%"
					@change="handleSelectionChange">
					<a-select-option v-for="item in assetmap" :key="item.name" :value="item.name" :label="item.name">
						{{ item.name }}
					</a-select-option>
				</a-select>
				<!--CardCurvoLineChart2 ref="CurvoLineChart2Ref" :datasets="datasets"></CardCurvoLineChart2-->
				<CardCurvoLineChart2></CardCurvoLineChart2>
			</div>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Assets">
			<a-table v-if="assetmap.length>0"
				:columns="columns"
				:data-source="assetmap"
				:pagination="false"
				:rowKey="(record,index) => index">
			</a-table>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapState } from "vuex";
import CardCurvoLineChart from '@/components/Cards/CardCurvoLineChart.vue'
import CardCurvoLineChart2 from '@/components/Cards/CardCurvoLineChart2.vue'
const columns = [
	{ title:'Name', dataIndex:'name'},
	{ title:'Data', dataIndex:'data' },
]

export default ({
	components: {
		CardCurvoLineChart2
	},
	computed: {
    	...mapState("curvo", ["assetmap"]),
	},
	watch: {
	},
	data() {
		return {
			columns,
		}
	},
	methods: {
		handleSelectionChange(value) {
			for(let i=0; i < value.length; i++){
				this.$store.dispatch("curvo/getAsset2",{dataset: value[i]});
			}
		}
	},
	mounted() {
	    this.$store.dispatch("curvo/getAssetMap");
	    
		//this.$store.dispatch("curvo/getAsset2",{dataset:"ftse-100"});
	    //this.$store.dispatch("curvo/getAsset2",{dataset:"bitcoin"});
	    //this.$store.dispatch("curvo/getAsset2",{dataset:"msci-world-information-technology"});
	    
		//this.$store.dispatch("curvo/getAsset2",{dataset:"world-water"});
	}
})
</script>

<style lang="scss">
</style>