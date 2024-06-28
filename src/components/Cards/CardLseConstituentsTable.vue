<template>
	<!--a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}"-->
	<div v-if="gConstituents(constituents) != undefined">
		<div v-if="gConstituents(constituents) !== null">
			<a :href="gConstituents(constituents).webSource" target="_blank">Click for: lse constituents performance - 
				<span>{{gConstituents(constituents).source }} / {{gConstituents(constituents).created}}</span>
			</a>
			<span style="float:right;">
				Live <a-switch size="small" v-model="live" @click="liveToggle" />			
			</span>
		</div>
		<a-table
			:loading="loading"
			:columns="CONSTITUENT_PERFORMANCE_Columns" 
			:data-source="gConstituents(constituents).data" 
			:pagination="false" 
			:rowKey="(record,i) => i"
			:row-class-name="setRowClassName">

			<template slot="expandedRowRender" slot-scope="record">
				<CardLseConstituentDetails :epic="record.epic"></CardLseConstituentDetails>

				<!--iframe :src="epic(record)" style="width: 100%; height: 600px; border: 0"></iframe-->
				<!--a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="Summary">
						<pre>{{ gConstituentDetails(epic(record)) }}</pre>
					</a-tab-pane>
					<a-tab-pane key="2" tab="Tradeview">
						<a :href="tradeView(record.epic)" target="_blank">{{record.epic}}</a>
					</a-tab-pane>
					<a-tab-pane key="3" tab="Broker View">
						<WidgetTradingViewBrokerAnalysis :symbol="fullSymbol(record.epic)"/>
					</a-tab-pane>
					<a-tab-pane key="4" tab="Financials">
						<WidgetTradingViewFinancials :symbol="fullSymbol(record.epic)"/>
					</a-tab-pane>
				</a-tabs-->
			</template>
		</a-table>
	<!--/a-card-->
	</div>
</template>

<script>

// https://www.dividenddata.co.uk/dividend-history.py?epic=SVT

const epicCorrections = [
	{in:"T17",out:"TM17"},
	{in:"BAE",out:"BA."}
]

import {mapState, mapGetters } from "vuex";

//import WidgetTradingViewTechAnalysis from "@/components/Widgets/WidgetTradingViewTechAnalysis";
//mport WidgetTradingViewTechAnalysisTest from "@/components/Widgets/WidgetTradingViewTechAnalysisTest";
//import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
//import WidgetTradingViewFinancials from "@/components/Widgets/WidgetTradingViewFinancials";
import CardLseConstituentDetails from "@/components/Cards/CardLseConstituentDetails"

import { 
	CONSTITUENT_PERFORMANCE_Columns
} from '@/common/table'

export default ({
	props: {
		constituents: {
			type: String,
			default: ""
		}
	},
	components: {
		//WidgetTradingViewTechAnalysisTest,	
		//WidgetTradingViewTechAnalysis,
		//WidgetTradingViewBrokerAnalysis,
		//WidgetTradingViewFinancials,
		CardLseConstituentDetails
	},
	computed: {
		...mapState("lse",["constituentsPerformance"]),
		...mapGetters("lse",["gConstituents"]),
		...mapState("app", ["secrets"])
	},
	data() {
		return {
			CONSTITUENT_PERFORMANCE_Columns,
			loading: false,
			live: false
		}
	},
	methods: {
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
		epic(record) {
			return `https://www.dividenddata.co.uk/dividend-history.py?epic=${record.epic.split('.')[0]}` 
		},
		tradeView(epic) {
			return `https://www.tradingview.com/chart/${this.secrets.tradingviewid}?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			return "LSE:" + epic.split(".")[0]; 
		},
		liveToggle() {
			if(this.live) {
				this.$store.dispatch("lse/getConstituentsPeformance",{constituents: this.constituents, live: this.live})
				this.live = false;
			}
		}
	},
	mounted() {
	  this.$store.dispatch("lse/getConstituentsPeformance",{constituents: this.constituents, live: this.live})
	}
})

</script>

<style>
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