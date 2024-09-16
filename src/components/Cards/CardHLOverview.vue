<template>
	<div>
		<a-row type="flex">
			<a-col class="col-content" :span="16" :xl="16">
				<a-card :bordered="true" class="card-info">
					<h6><a :href="sourceLink()" target="_blank">{{fundName}}</a></h6>
					<img :src="chart" height="300" width="100%">
					<p>{{ aims }}</p>
				</a-card>
			</a-col>
			<a-col class="col-content" :span="8" :xl="8">							
				<a-card :bordered="true" class="card-info">
					<pre>{{ citiCode }}</pre>
					<pre>{{ annualCharge }}</pre>
					<pre>{{ sectorName }}</pre>
					<pre>{{ unitType }}</pre>
					<pre>{{ paymentType }}</pre>
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>
// FT - GB0030281066:GBX
// FT -     75607414
// HL       3028106

export default ({
	props: {
		fundName: 		{ type: String, default: ""},
		citiCode:		{ type: String, default: ""},
		sedol:			{ type: String, default: ""},
		aims:     		{ type: String, default: ""},
		annualCharge:   { type: String, default: ""},
		sectorName:     { type: String, default: ""},
		unitType:     	{ type: String, default: ""},
		paymentType:    { type: String, default: ""},
	},
	computed: {},
	watch: {},
	data() {
		return {
			chart: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citiCode}&color=f65d1a&hide=&span=M200&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
		}
	},
	methods: {
		sourceLink() {
			return `https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/${this.sedol}`
		}
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
