<template>
	<a-card v-if="fundsAnalysisFilter(sedol) != undefined" :bordered="false" class="card-info">
		<a-table
			:columns="Columns" 
			:data-source="fundsAnalysisFilter(sedol).data.assetAllocation" 
			:pagination="false" 
			:rowKey="(record,i) => i"
			class='table table-small' style="margin: 6">
		</a-table>
	</a-card>
</template>

<script>
// FT - GB0030281066:GBX
// FT -     75607414
// HL       3028106
const Columns = [
	{ title: 'Type', dataIndex: 'type'},
	{ title: 'Allocation %', dataIndex: 'allocation'},
];

import { mapGetters,mapState } from "vuex";

export default ({
	props: {
		sedol: { type: String, default: "" },
	},
	computed: {
		...mapGetters("hl", ["fundsAnalysisFilter"]),
		...mapState("hl", ["loadingAnalysis"]),
	},
	watch: {},
	data() {
		return {
			Columns
		}
	},
	methods: {
	},
	mounted() {
		this.$store.dispatch("hl/getFundAnalysis",{ sedol: this.sedol });
	}
})
</script>

<style lang="scss">
.ant-card-body {
	.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    	padding: 6px 6px;
	}
}

.change-divide .change {
    font-size: 1.3em;
    margin-right: 0.1em;
    font-weight: bold;
}

.price-divide {
    font-size: 1.3em;
    font-weight: bold;
    margin-right: 0.4em;
    padding-right: 0.4em;
    border-right: 0.13em solid #1e1d56;
}
</style>
