<template>
	<div>
		<!-- Markets -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="12" :xl="8" class="mb-24" v-for="(market, index) in markets" :key="index">
				<CardChartInfo :title="market.title" :ticker="market.ticker"></CardChartInfo>
			</a-col>
		</a-row>
	</div>
</template>

<script>
	// Card Chart Info.
	import CardChartInfo from '../components/Cards/CardChartInfo' ;

const markets = [
	{
		title: "BLACKROCK MYMAP 6 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQM"
	},
	{
		title: "BLACKROCK MYMAP 5 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQK"
	},
	{
		title: "BLACKROCK MYMAP 4 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQI"
	},
	{
		title: "BLACKROCK MYMAP 3 CLASS D - ACCUMULATION (GBP)",
		ticker: "FQCQG"
	},
	{
		title: "BLACKROCK MYMAP 5 SELECT ESG CLASS D - ACCUMULATION (GBP)",
		ticker: "FR2QB"
	}
]

export default ({
	components: {
		CardChartInfo,
	},
	data() {
		return {
			markets
		}
	},
})

</script>

<style lang="scss">
</style>