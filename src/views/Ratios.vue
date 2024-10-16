<template>
	<div>
		<a href="https://www.multpl.com/" target="_blank">Multpl - Market, financial, and economic data.</a>
		<a-tabs default-active-key="1">
			<a-tab-pane key="1" tab="Treasury Rate">
				<a-row type="flex" align="stretch">
					<a-col :span="24" :lg="24" :xl="24" class="mb-24">
						<CardTVMultiChartMtpl :datasets="treasuryRates"></CardTVMultiChartMtpl>
					</a-col>	
				</a-row>
			</a-tab-pane>
			<a-tab-pane key="2" tab="Shiller">
				<CardTVMultiChartMtpl :datasets="shillerData"></CardTVMultiChartMtpl>
			</a-tab-pane>
			<a-tab-pane key="3" tab="FED">
				<CardTVMultiChartFed :datasets="fedData"></CardTVMultiChartFed>
			</a-tab-pane>
			<a-tab-pane key="4" tab="ONS">
				<CardTVMultiChartOns :datasets="onsData"></CardTVMultiChartOns>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import CardTVMultiChartMtpl from '../components/Cards/CardTVMultiChartMtpl';
import CardTVMultiChartFed from '../components/Cards/CardTVMultiChartFed';
import CardTVMultiChartOns from '../components/Cards/CardTVMultiChartOns';

const TREASURY_RATE_DATA = [
  '1-year-treasury-rate/table/by-month',
  '2-year-treasury-rate/table/by-month',
  '3-year-treasury-rate/table/by-month',
  '5-year-treasury-rate/table/by-month',
  '10-year-treasury-rate/table/by-month',
  '20-year-treasury-rate/table/by-month',
  'inflation/table/by-month'
];

const SHILLER_DATA = [
  'shiller-pe/table/by-month',
  '10-year-treasury-rate/table/by-month',
  //'cpi/table/by-month'
]

const FED_DATA = [
    'seriesId=JHDUSRGDPBR&frequency=q&units=lin&scale=4.0',
    'seriesId=T10Y2Y&frequency=m&units=lin&scale=1.0',
	'seriesId=FEDFUNDS&frequency=m&units=lin&scale=1.0',
	'seriesId=VIXCLS&frequency=m&units=lin&scale=1.0'
]

const ONS_DATA = [
    'inflationandpriceindices/timeseries/d7bt/mm23/data',
]


export default ({
	components: {
		CardTVMultiChartMtpl,
		CardTVMultiChartFed,
		CardTVMultiChartOns
	},
	computed: {
	},
	data() {
		return {
			treasuryRates: TREASURY_RATE_DATA,
			shillerData: SHILLER_DATA,
			fedData: FED_DATA,
			onsData: ONS_DATA
		}
	},
	methods: {
	},
	async mounted() {
	},
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>