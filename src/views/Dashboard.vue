<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Sentiment">
			<!--pre>{{ sentiment.fear_and_greed }}</pre-->
			<a href="https://edition.cnn.com/markets/fear-and-greed" 
				target="_blank">Click for: 'CNN Market Insights' - <span v-if="sentiment!=null">{{ sentiment.fear_and_greed.timestamp }}</span></a>
			<a-row v-if="sentiment != null" :gutter="24">
				<a-col :span="24" :lg="12" :xl="6" class="mb-24">
					<WidgetCounter
						title='Fear & Greed Today'
						:value="sentiment.fear_and_greed.score" 
						prefix="" 
						suffix="%"
						:icon="icon1" 
						:status="rating(sentiment.fear_and_greed.score)"></WidgetCounter>
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
			<a-row v-if="sentiment != null" :gutter="24">
				<a-col :span="12" :lg="12" class="mb-12">
					<CardFearAndGreedLineChart
						:historicalData="sentiment.fear_and_greed_historical.data" 
						:score="sentiment.fear_and_greed_historical.score" 
						:rating="sentiment.fear_and_greed_historical.rating"/>
				</a-col>
				<a-col :span="12" :lg="12" class="mb-12">
					<CardVixLineChart v-if="sentiment!=null"
						:historicalData="sentiment.market_volatility_vix.data"
						:score="sentiment.market_volatility_vix.score" 
						:rating="sentiment.market_volatility_vix.rating"/>
				</a-col>
			</a-row>
			<a-row v-if="sentiment !=null" :gutter="24">
				<a-col :span="12" :lg="12" class="mb-12">
					<CardSP500MomentumLineChart
						:historicalData="sentiment.market_momentum_sp500.data"
						:historicalMA200Data="sentiment.market_momentum_sp500_MA200.data"
						:historicalMA100Data="sentiment.market_momentum_sp500_MA100.data"
						:historicalMA50Data="sentiment.market_momentum_sp500_MA50.data"
						:score="sentiment.market_momentum_sp500.score" 
						:rating="sentiment.market_momentum_sp500.rating"/>
				</a-col>
				<a-col :span="12" :lg="12" class="mb-12">
					<CardStockPriceStrengthLineChart
						:historicalData="sentiment.stock_price_strength.data"
						:score="sentiment.stock_price_strength.score" 
						:rating="sentiment.stock_price_strength.rating"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Liquidity & Debt">
			<a-tabs>
				<a-tab-pane key="1" tab="Liquidity">
					<CardLiquidityChart></CardLiquidityChart>
				</a-tab-pane>
				<a-tab-pane key="2" tab="Debt">
					<div style="width: 100%; height: 0; padding-bottom: 56.25%; position: relative;">
						<iframe 
							src="https://www.usdebtclock.org/index.html"
							style="position: absolute; width: 100%; height: 100%; border: none;"
							allowfullscreen>
						</iframe>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Money Mkts">
			<h6>{{ moneyMarkets }}</h6>
			<CardTVStockMultiChartFT :epics="moneyMarkets"></CardTVStockMultiChartFT>
		</a-tab-pane>
		<a-tab-pane key="4" tab="Oil Markets">
			<a-tabs>
				<a-tab-pane key="1" tab="Stocks">
					<h6>{{ oilSymbols }}</h6>
					<CardTVStockMultiChart :epics="oilSymbols"></CardTVStockMultiChart>
				</a-tab-pane>
				<a-tab-pane key="2" tab="ETFs">
					<h6>{{ oilEtfs }}</h6>
					<CardTVStockMultiChartFT></CardTVStockMultiChartFT>
				</a-tab-pane>
			</a-tabs>
		</a-tab-pane>
		<a-tab-pane key="5" tab="Metals & Markets">
			<a-tabs>
				<a-tab-pane key="1" tab="Metals">
					<h6>{{ preciousMetalSymbols }}</h6>
					<CardTVMetalsMultiChart :metals="preciousMetalSymbols"></CardTVMetalsMultiChart>
				</a-tab-pane>
				<a-tab-pane key="2" tab="Markets">
					<h6>{{ preciousMetalMinerSymbols }}</h6>
					<CardTVStockMultiChart :epics="preciousMetalMinerSymbols"></CardTVStockMultiChart>
				</a-tab-pane>
				<a-tab-pane key="3" tab="ETFs">
					<h6>{{ metalEtfs }}</h6>
					<CardTVStockMultiChartFT :epics="metalEtfs"></CardTVStockMultiChartFT>
				</a-tab-pane>
				<a-tab-pane key="4" tab="FxTop">
					<h5> £1 buys !ounces of XAU or XAG </h5>
					<a-row>
						<a-col :span="12">
							<img src="https://fxtop.com/php/imggraph.php?C1=GBP&C2=XAU&A=1&DD1=01&YYYY1=1980&YYYY2=2025&LANG=en&CJ=0&MM1Y=0&LARGE=&TR=ON" width="700" height="500">
						</a-col>
						<a-col :span="12">
							<img src="https://fxtop.com/php/imggraph.php?A=1&C1=XAU&C2=GBP&DD1=01&YYYY1=1980&YYYY2=2025&LANG=en&CJ=0&MM1Y=0&LARGE=&TR=ON" width="700" height="500">
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12">
							<img src="https://fxtop.com/php/imggraph.php?C1=GBP&C2=XAG&A=1&DD1=01&YYYY1=1980&YYYY2=2025&LANG=en&CJ=0&MM1Y=0&LARGE=&TR=ON" width="700" height="500">
						</a-col>
						<a-col :span="12">
							<img src="https://fxtop.com/php/imggraph.php?A=1&C1=XAG&C2=GBP&DD1=01&YYYY1=1980&YYYY2=2025&LANG=en&CJ=0&MM1Y=0&LARGE=&TR=ON" width="700" height="500">
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane key="5" tab="Gold F&G">
					<a-row type="flex" align="stretch">
						<a-col :span="12">
							<!--div style='width:400px;height:280px;border:0px solid #ccc;box-sizing: border-box;' -->
								<CardIndicatorInfo 
									url='https://cdn.jmbullion.com/fearandgreed/gauge.html' 
									type="iframe" height="458"/>		
							<!--/div-->
						</a-col>
						<a-col :span="12">
							<!--div style='width:400px;height:280px;border:0px solid #ccc;box-sizing: border-box;'-->
							<CardIndicatorInfo 
								url='https://cdn.jmbullion.com/fearandgreed/fearandgreed.html' 
								type="iframe" height="458"/>		
							<!--/div-->
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane key="6" tab="Chards">
					<CardIndicatorInfo 
						url='https://www.chards.co.uk/category/buy-coins/a/gold/britannia'								
						type="iframe" height="1200" scrolling="yes"/>		

				</a-tab-pane>
				</a-tabs>
		</a-tab-pane>
		<a-tab-pane key="6" tab="FED">
			<!--CardFedComposite v-if="composite.length>0" :dataset="composite"></CardFedComposite-->
			<CardIndicatorInfo url='https://fred.stlouisfed.org/graph/fredgraph.png?g=1JAHz&height=480' type='img'/>		
			<CardIndicatorInfo url='https://fred.stlouisfed.org/graph/fredgraph.png?g=1JAIC&height=480' type='img'/>
			<CardIndicatorInfo url='https://fred.stlouisfed.org/graph/fredgraph.png?g=1JAK9&height=480' type='img'/>
			<CardIndicatorInfo url='https://fred.stlouisfed.org/graph/fredgraph.png?g=1JJE4&height=480' type='img'/>
			<CardIndicatorInfo url='https://fred.stlouisfed.org/graph/fredgraph.png?g=1JJJe&height=490' type="img"/>
		</a-tab-pane>
		<!--a-tab-pane key="3" tab="LSE - Performance">
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
		</a-tab-pane-->
		<a-tab-pane key="7" tab="Funds">
			<a-row type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(1)" :key="i">			
					<CardChartFundInfo :title="e.title" :ticker="e.ticker" :sedol="e.sedol"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="8" tab="Equities">
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(e, i) in getGroup(2)" :key="i">			
					<CardChartEquityInfo :title="e.title" :ticker="e.ticker"/>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="9" tab="Bonds & Gilts">
			<a-tabs v-model="activeBondsGiltsTab">
				<a-tab-pane tab="Rates" key="0">
					<h6>{{ bonds }}</h6>
					<CardTVStockMultiChartCNBC :epics="bonds"></CardTVStockMultiChartCNBC>
				</a-tab-pane>
				<a-tab-pane tab="Bond Ladder" key="1">
					<BondsView></BondsView>

					<!--a-row :gutter="24" type="flex" align="stretch">
						<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(b, i) in gilts" :key="i">			
							<CardChartGiltInfo  :title="b.title" :id="b.id"/>
						</a-col>
					</a-row-->
				</a-tab-pane>
			</a-tabs>
		</a-tab-pane>
		<a-tab-pane key="10" tab="Commodities">
			<a-tabs v-model="activeCommoditiesTab">
				<a-tab-pane v-for="(g, gi) in commodities" :key="gi" :tab="g.commodityGroup">
					<a href="https://www.theglobaleconomy.com/" target="_blank">The Global Economy</a>
					<a-row :gutter="24" type="flex" align="stretch">
						<a-col :span="8" :lg="8" :xl="8" class="mb-8" v-for="(c, ci) in g.commodities" :key="ci">
							<a-card hoverable style="padding: 10px;">
								<a-card-meta>
									<template #title>
										<a :href="c.href" target="_blank">{{ c.name }}</a>
									</template>
									<template #description>
										<div>{{ c.measure }} | {{ c.period }} | {{ c.lastValue }}</div>
									</template>
								</a-card-meta>
								<template #cover>
										<img :src="c.chartUrl"/>
								</template>
							</a-card>
						</a-col>
					</a-row>
				</a-tab-pane>
			</a-tabs>
		</a-tab-pane>
		<a-tab-pane key="11" tab="BitCoin">
			<a-tabs v-model="activeBitCoinTab">
				<a-tab-pane tab="Rainbow" key="0">
					<CardIndicatorInfo url='https://www.blockchaincenter.net/static/rainbow-chart.html' height="900" type="iframe"/>		
				</a-tab-pane>
				<a-tab-pane tab="Fear & Greed" key="1">
					<CardIndicatorInfo url='https://charts.bgeometrics.com/graphics/fear_greed.html' type="iframe" height="600"/>		
				</a-tab-pane>
				<a-tab-pane tab="Price Log" key="2">
					<CardIndicatorInfo url='https://charts.bgeometrics.com/reports/bitcoin_price_g_log.html' type="iframe" height="600"/>							
				</a-tab-pane>
				<a-tab-pane tab="M2-Global" key="3">
					<CardIndicatorInfo url='https://charts.bgeometrics.com/graphics/m2_global.html' type="iframe" height="580"/>		
				</a-tab-pane>
				<a-tab-pane tab="M2-10w-Lead" key="4">
					<CardIndicatorInfo url='https://charts.bgeometrics.com/graphics/m2_global_10w.html' type="iframe" height="580"/>		
				</a-tab-pane>
				<a-tab-pane tab="Moving Ave." key="5">
					<CardIndicatorInfo url='https://charts.bgeometrics.com/graphics/moving_average.html' type="iframe" height="580"/>		
				</a-tab-pane>
				<a-tab-pane tab="SP500/Gold" key="6">
					<CardIndicatorInfo url='https://charts.bgeometrics.com/graphics/sp500_gold.html' type="iframe" height="580"/>		
				</a-tab-pane>
			</a-tabs>
		</a-tab-pane>

		<!--a-tab-pane key="11" tab="Allocation">
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12">
					<LazyYoutube
						ref="youtubeLazyVideo"
						:src='yt'
						max-width="720px"
						aspect-ratio="16:9"
						thumbnail-quality="standard"
					></LazyYoutube>
				</a-col>
				<a-col :span="12" :lg="12" :xl="12" class="mb-12">
					<img src="/images/Allocation2024.PNG" height="500" width="99%">
				</a-col>
			</a-row>
		</a-tab-pane-->

		<a-tab-pane key="12" tab="Chart Cycles">
			<img src="/images/stockcyclestages2.png" height="600" width="98%">
			<img src="/images/stockcyclestages4.webp" height="600" width="98%">
		</a-tab-pane>

		<a-tab-pane key="13" tab="Rise & Fall">
			<img src="/images/TheRise-FalloftheDollar.png" height="600" width="98%">
			<img src="/images/fallofthepound.webp" height="600" width="98%">
		</a-tab-pane>

		<!--a-tab-pane key="8" tab="FinViz-Sectors">
			<h5>Industry Forward PE - Ascending</h5>
			<a-row :gutter="24" type="flex" align="stretch">
				<a-col :span="12" :lg="12" :xl="12" class="mb-12" v-for="(ifpe, ifv) in industryforwardpe" :key="ifv">
					<a-card :bordered="true" class="header-solid h-full" :bodyStyle="{padding: 6}">
						<template #cover>
							<img :src="ifpe.img"/>
						</template>
					</a-card>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="9" tab="FinViz-News">
			<a-list  v-if="news.length>0" bordered header='News from https://finviz.com/news.ashx'>
				<a-list-item v-for="(newsItem, i) in news" :key="i">
					<a-list-item-meta>
						<template slot="title">
							<a :href="newsItem.href" target="_blank">{{ newsItem.headline }}</a>
						</template>
						<template slot="description">
							{{ newsItem.datetime }}
						</template>
					</a-list-item-meta>
				</a-list-item>
			</a-list>
		</a-tab-pane-->
	</a-tabs>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CardChartFundInfo from '../components/Cards/CardChartFundInfo' ;
import CardChartEquityInfo from '../components/Cards/CardChartEquityInfo';
import CardChartIndexInfo from '../components/Cards/CardChartIndexInfo';
import CardChartBondInfo from '../components/Cards/CardChartBondInfo';
import CardIndicatorInfo from '../components/Cards/CardIndicatorInfo';
import CardChartGiltInfo from '../components/Cards/CardChartGiltInfo'

import CardLiquidityChart from '../components/Cards/CardLiquidityChart';


import CardFearAndGreedLineChart from '../components/Cards/CardFearAndGreedLineChart';
import CardVixLineChart from '../components/Cards/CardVixLineChart';
import CardSP500MomentumLineChart from '../components/Cards/CardSP500MomentumLineChart';
import CardStockPriceStrengthLineChart from '../components/Cards/CardStockPriceStrengthLineChart';

import CardTVStockMultiChart from '../components/Cards/CardTVStockMultiChart'
import CardTVMetalsMultiChart from '../components/Cards/CardTVMetalsMultiChart'
import CardTVStockMultiChartFT from '@/components/Cards/CardTVStockMultiChartFT'
import CardTVStockMultiChartCNBC from '@/components/Cards/CardTVStockMultiChartCNBC'

import CardLseConstituentsTable from '../components/Cards/CardLseConstituentsTable';

import CardFedComposite from '@/components/Cards/CardFedComposite';

import WidgetCounter from '../components/Widgets/WidgetCounter' ;

import { SECTOR_PERFORMANCE_Columns } from '@/common/table'


import BondsView from './BondsView.vue';


// https://skyandtelescope.org/wp-content/uploads/ises-solar-cycle-sunspot-2-900x515.jpg
// https://www.researchgate.net/publication/370171428/figure/fig3/AS:11431281152708626@1682119597484/Prediction-of-Solar-Cycle-25.png

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
		CardChartGiltInfo,
		
		CardFearAndGreedLineChart,
		CardIndicatorInfo,

		CardLiquidityChart,

		CardVixLineChart,
		CardSP500MomentumLineChart,
		CardStockPriceStrengthLineChart,
		CardFedComposite,

		CardLseConstituentsTable,
		WidgetCounter,

		CardTVStockMultiChart,
		CardTVMetalsMultiChart,
		CardTVStockMultiChartFT,
		CardTVStockMultiChartCNBC,	
	
		BondsView
	},
	computed: {
    	...mapState("markets", ["markets"]),
		...mapGetters("markets",["getGroup"]),
    	...mapState("cnn", ["sentiment"]),
		...mapState("lse", ["sectorPerformance"]),
    	...mapState("tge", ["commodities"]),
    	...mapState("fviz", ["news","industryforwardpe"]),
		...mapState("fedinfo", [
			//"sahmrealtime",
			//"unrate",
			//"sahmrealtimeunrate",
			//"indicators",
			//"apiunrate",
			"composite"
		])
	},
	watch: {
	},
	data() {
		return {
			icon1: ICON1,
			SECTOR_PERFORMANCE_Columns,
			loading: true,
			live: false,
			activeCommoditiesTab: 0,
			activeBitCoinTab: "0",
			activeBondsGiltsTab: "0", 


			oilSymbols: ["BP.","SHEL","HBR","SQZ","RKH"],
			oilEtfs: [],
			// preciousMetalSymbols: ["gold","silver","platinum","palladium"],
			preciousMetalSymbols: ["gold","silver"],
			preciousMetalMinerSymbols: ["FRES","HOC","GGP","PAF","SRB"],// "WPM",],//"PAAS"],
			metalEtfs: ["REGB:LSE:GBP","GJGB:LSE:GBP","URNG:LSE:GBP","NUCG:LSE:GBP","GDGB:LSE:GBP"],
			moneyMarkets: ["GB00BFYDWM59:GBP","GB00B8XYYQ86:GBP","GB0033029413:GBP"],
			uraniumMetalSymbols:["BKY","YCA","AURA","KAP"],
			// bonds:["UK30Y-GB","UK10Y-GB","UK2Y-GB","US30Y-USD","US10Y-USD","US2Y-USD",".MOVE"],
			bonds:["UK30Y-GB","UK10Y-GB","UK2Y-GB","US30Y-USD","US10Y-USD","US2Y-USD"],
			yt: 'https://www.youtube.com/watch?v=B4Nhkja0hFs',

			gilts: [

				{ title :"Treasury 0.125% 30/01/2026 (T26) Gilt",id:"296369819"},
				{ title :"Treasury 0.125% 31/01/2028 (TN28) Gilt",id:"297585712"},
				{ title :"Treasury 6% 07/12/2028 (TR28) Gilt",id:"200190"},
				{ title :"Treasury 0.375% 22/10/2030 (TG30) Gilt",id:"294258755"},
			]

// Crypto
//https://api.fool.com/quotes/v4/historical/charts/220472?start=2014-10-14&end=2024-10-10&precision=Week&apikey=6cbf5f34-ba40-4108-a1ab-d951c608955e

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
		},
	},
	mounted() {
	    this.$store.dispatch("markets/getMarkets");
		this.$store.dispatch("cnn/getSentiment");

		//this.$store.dispatch("lse/getSectorPeformance",{live:this.cacheState});
	    this.$store.dispatch("tge/getCommodities",{live:this.cacheState});

		//this.$store.dispatch("fviz/getIndustryForwardPE",{live:true});
		//this.$store.dispatch("fviz/getNews",{live:true});

		this.$store.dispatch("fedinfo/getComposite");
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


.video-container {
  max-width: 800px; /* adjust the max width as needed */
  margin: 0 auto;
}
.vue-plyr video {
  width: 100%;
  height: auto;
}
</style>

