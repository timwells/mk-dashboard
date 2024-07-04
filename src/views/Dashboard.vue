<template>
	<a-tabs v-if="markets" default-active-key="1">
		<a-tab-pane key="1" tab="Sentiment">
			<a href="https://edition.cnn.com/markets/fear-and-greed" target="_blank">Click for: 'CNN Market Insights' - <span v-if="sentiment">{{ sentiment.fear_and_greed.timestamp }}</span></a>
			<!--pre v-if="sentiment">{{ sentiment.fear_and_greed }}</pre-->
			<a-row v-if="sentiment" :gutter="24">
				<a-col :span="24" :lg="12" :xl="6" class="mb-24">
					<WidgetCounter 
						title='Fear & Greed Today'
						:value="sentiment.fear_and_greed.previous_close" 
						prefix="" 
						suffix="%"
						:icon="icon1" 
						:status="rating(sentiment.fear_and_greed.previous_close)"></WidgetCounter>
				</a-col>
				<a-col :span="24" :lg="12" :xl="6" class="mb-24">
					<WidgetCounter 
						title="Fear & Greed - 1 Week" 
						:value="sentiment.fear_and_greed.previous_1_week" 
						prefix="" 
						suffix="%" 
						:icon="icon1" 
						:status="rating(sentiment.fear_and_greed.previous_1_week)"></WidgetCounter>
				</a-col>
				<a-col :span="24" :lg="12" :xl="6" class="mb-24">
					<WidgetCounter 
						title="Fear & Greed - 1 Month" 
						:value="sentiment.fear_and_greed.previous_1_month" 
						prefix="" 
						suffix="%" 
						:icon="icon1" 
						:status="rating(sentiment.fear_and_greed.previous_1_month)"></WidgetCounter>
				</a-col>
				<a-col :span="24" :lg="12" :xl="6" class="mb-24">
					<WidgetCounter 
						title="Fear & Greed - 1 Year" 
						:value="sentiment.fear_and_greed.previous_1_year" 
						prefix="" 
						suffix="%" 
						:icon="icon1" 
						:status="rating(sentiment.fear_and_greed.previous_1_year)"></WidgetCounter>"			
				</a-col>
			</a-row>
			<a-row>
				<a-col v-if="sentiment!=null" :span="12" :lg="12" class="mb-12">
					<CardFearAndGreedLineChart 
						:historicalData="sentiment.fear_and_greed_historical.data" 
						:score="sentiment.fear_and_greed_historical.score" 
						:rating="sentiment.fear_and_greed_historical.rating"/>
				</a-col>
				<a-col v-if="sentiment!=null" :span="12" :lg="12" class="mb-12">
					<CardVixLineChart :historicalData="sentiment.market_volatility_vix.data"
						:score="sentiment.market_volatility_vix.score" 
						:rating="sentiment.market_volatility_vix.rating"/>
				</a-col>
			</a-row>
			<a-row>
				<a-col v-if="sentiment!=null" :span="12" :lg="12" class="mb-12">
					<CardSP500MomentumLineChart 
						:historicalData="sentiment.market_momentum_sp500.data"
						:historicalMA125Data="sentiment.market_momentum_sp500_MA125.data"
						:score="sentiment.market_momentum_sp500.score" 
						:rating="sentiment.market_momentum_sp500.rating"/>
				</a-col>
				<a-col v-if="sentiment!=null" :span="12" :lg="12" class="mb-12">
					<CardStockPriceStrengthLineChart :historicalData="sentiment.stock_price_strength.data"
						:score="sentiment.stock_price_strength.score" 
						:rating="sentiment.stock_price_strength.rating"/>
				</a-col>
			</a-row>

		</a-tab-pane>
		<a-tab-pane key="2" tab="Performance">
			<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">
				<div>
					<a href="https://www.lse.co.uk/share-prices/sectors/" target="_blank">Click for: lse sector performance - 
					<span v-if="sectorPerformance">({{sectorPerformance.source }}</span>
					<span v-if="sectorPerformance"> / {{sectorPerformance.created}}) </span>
					</a>
					<span style="float:right;">
						Live <a-switch size="small" v-model="live" @click="liveToggle" />			
					</span>
				</div>
				<a-table v-if="sectorPerformance"
					:columns="SECTOR_PERFORMANCE_Columns"
					:data-source="sectorPerformance.data"
					:pagination="false"
					:rowKey="(record,i) => i"
					class='table table-small' style="margin: 6"
					:row-class-name="setRowClassName">
					<div slot="expandedRowRender" slot-scope="record" style="margin:0">
						<CardLseConstituentsTable :constituents="record.constituents"></CardLseConstituentsTable>
					</div>
					<template slot="name" slot-scope="name">{{ name }}</template>
					<template slot="value" slot-scope="value">{{ value }}</template>
					<template slot="changePrice" slot-scope="changePrice">{{ changePrice }}</template>
					<template slot="changePercent" slot-scope="changePercent">{{ changePercent }}</template>
				</a-table>
			</a-card>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Funds">
			<a-row type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(1)" :key="i">			
					<CardChartFundInfo :title="e.title" :ticker="e.ticker" :sedol="e.sedol"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="4" tab="Equities">
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(2)" :key="i">			
					<CardChartEquityInfo :title="e.title" :ticker="e.ticker"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="5" tab="Index & Bonds">
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(3)" :key="i">			
					<CardChartIndexInfo v-if="e.type==='index'" :title="e.title" :ticker="e.ticker"/>
					<CardChartBondInfo v-if="e.type==='bond'" :title="e.title" :ticker="e.ticker"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		</a-tabs>
</template>

<script>

import { mapState, mapGetters } from "vuex";

import CardChartFundInfo from '../components/Cards/CardChartFundInfo' ;
import CardChartEquityInfo from '../components/Cards/CardChartEquityInfo';
import CardChartIndexInfo from '../components/Cards/CardChartIndexInfo';
import CardChartBondInfo from '../components/Cards/CardChartBondInfo';

import CardFearAndGreedLineChart from '../components/Cards/CardFearAndGreedLineChart';
import CardVixLineChart from '../components/Cards/CardVixLineChart';
import CardSP500MomentumLineChart from '../components/Cards/CardSP500MomentumLineChart';
import CardStockPriceStrengthLineChart from '../components/Cards/CardStockPriceStrengthLineChart';

import CardLseConstituentsTable from '../components/Cards/CardLseConstituentsTable';
import WidgetCounter from '../components/Widgets/WidgetCounter' ;

import { SECTOR_PERFORMANCE_Columns } from '@/common/table'

/*
text-danger: Red color.
text-success: Green color.
text-warning: Yellow color.
text-info: Blue color.
*/

const ICON1 = 
`<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z" fill="#111827"/>
	<path d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z" fill="#111827"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z" fill="#111827"/>
</svg>`

export default ({
	components: {
		CardChartFundInfo,
		CardChartEquityInfo,
		CardChartIndexInfo,
		CardChartBondInfo,

		CardFearAndGreedLineChart,
		CardVixLineChart,
		CardSP500MomentumLineChart,
		CardStockPriceStrengthLineChart,

		WidgetCounter,
		CardLseConstituentsTable
	},
	computed: {
    	...mapState("markets", ["markets"]),
		...mapGetters("markets",["getGroup"]),
    	...mapState("cnn", ["sentiment"]),
    	...mapState("lse", ["sectorPerformance"]),
	},
	watch: {
        sectorPerformance(nn, prv) {
			// console.log(nn,nn)
			// if(nn || prv) { this.loading = false; }
		}
	},
	data() {
		return {
			icon1: ICON1,
			SECTOR_PERFORMANCE_Columns,
			loading: true,
			live: false
		}
	},
	methods: {
		rating(fg) {
			if((fg >= 0.0) && (fg <= 40.0)) { return "danger"} 
			if((fg >= 41.0) && (fg <= 60.0)) { return "warning"	} 
			if((fg >= 61.0) && (fg <= 100.0)) { return ""}
			return ""
		},
		setRowClassName(record) {
 			return this.getClassName(record.changePercent);
    	},
    	getClassName(changePercent) {
      		switch (true) {
        		case changePercent > 2.0: return 'green-bold-font';
        		case changePercent > 0.5: return 'green-font';

				case changePercent < -2.0: return 'red-bold-font';
        		case changePercent < -0.5: return 'red-font';

				default: return 'blue-font';
      		}
    	},
		liveToggle() {
			if(this.live) {
				this.$store.dispatch("lse/getSectorPeformance",{live:this.live});
				this.live = false;
			}
		}
	},
	mounted() {
	    this.$store.dispatch("markets/getMarkets");
	    this.$store.dispatch("cnn/getSentiment");
	    this.$store.dispatch("lse/getSectorPeformance",{live:this.cacheState});
	}
})
</script>

<style lang="scss">
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 9px 25px;
}

.red-font {
  color: red !important;
}
.red-bold-font {
  color: red !important;
  font-weight: bold !important;
}

.green-font {
  color: green !important;
}

.green-bold-font {
  color: green !important;
  font-weight: bold !important;
}

.blue-font {
  color: blue !important;
}
</style>

