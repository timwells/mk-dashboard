<template>
	<div class="card-content" >
		<h6>{{fundName}}</h6>
		<img :src="chart" height="300" width="60%">
		<p>{{ aims }}</p>
	</div>
</template>

<script>
// FT - GB0030281066:GBX
// FT -     75607414
// HL       3028106

export default ({
	props: {
		fundName: { type: String, default: "" },
		citiCode: { type: String, default: ""},
		aims:     { type: String, default: ""}
	},
	computed: {},
	watch: {},
	data() {
		return {
			chart: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citiCode}&color=f65d1a&hide=&span=M200&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
		}
	},
	methods: {
	},
	mounted() {
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
