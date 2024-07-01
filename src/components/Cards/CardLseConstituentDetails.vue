<template>
	<div v-if="viewReady">
		<a-tabs default-active-key="1">
			<a-tab-pane key="1" tab="Summary">
				<p>Bid: {{gConstituentDetails(epic).bid}}, Offer: {{gConstituentDetails(epic).offer}}, Vol: {{gConstituentDetails(epic).volume}}</p>
				<img :src="gConstituentDetails(epic).chartUrl" height="300" width="98%"/>
			</a-tab-pane>
			<a-tab-pane key="2" tab="Dividends">
				<iframe :src="dividends(epic)" style="width: 100%; height: 800px; border: 0"></iframe>
			</a-tab-pane>
			<a-tab-pane key="3" tab="Tradeview">
				<p>Bid: {{gConstituentDetails(epic).bid}}, Offer: {{gConstituentDetails(epic).offer}}, Vol: {{gConstituentDetails(epic).volume}}</p>
				<a :href="tradeView()" target="_blank">{{gConstituentDetails(epic).description}}</a>
			</a-tab-pane>
			<a-tab-pane key="4" tab="Tradeview Rating">
				<WidgetTradingViewBrokerAnalysis :symbol="fullSymbol(epic)" interval="1M"></WidgetTradingViewBrokerAnalysis>
			</a-tab-pane>
			<a-tab-pane key="5" tab="Broker Ratings">
				<div v-if="gBrokerRatings(epic) !== undefined">
					<a-table
						:loading="brokerRatingsUpdated"
						:columns="BROKER_RATINGS_Columns" 
						:data-source="gBrokerRatings(epic).data" 
						:pagination="false" 
						:rowKey="(record,i) => i">
					</a-table>
				</div>
			</a-tab-pane>
			<!--a-tab-pane key="6" tab="Rating Stats">
				<div v-if="gBrokerRatings(epic) !== undefined">
					<a-table
						:loading="brokerRatingsUpdated"
						:columns="BROKER_RATINGS_Columns" 
						:data-source="gBrokerRatings(epic).data" 
						:pagination="false" 
						:rowKey="(record,i) => i">
					</a-table>
				</div>
			</a-tab-pane-->
			<!--a-tab-pane key="5" tab="Financials">
				<WidgetTradingViewFinancials :symbol="fullSymbol(record.epic)"/>
			</a-tab-pane-->
		</a-tabs>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import WidgetTradingViewBrokerAnalysis from "@/components/Widgets/WidgetTradingViewBrokerAnalysis";
import { BROKER_RATINGS_Columns } from '@/common/table'

export default ({
	props: {
		epic: {
			type: String,
			default: ""
		}
	},
	components: {
		WidgetTradingViewBrokerAnalysis
	},
	watch: {
		constituentsDetails(o,n) {
			this.viewReady = this.constituentsDetailsUpdate = true
		},
		brokerRatings(o,n) {
			this.brokerRatingsUpdated = true
		}
	},
	computed: {
		...mapState("app", ["secrets"]),
		...mapState("lse",["constituentsDetails",]),
		...mapGetters("lse",["gConstituentDetails","gBrokerRatings"])
	},
	data() {
		return { 
			viewReady: false,
			constituentsDetailsUpdate:false,
			brokerRatingsUpdated: false,
			BROKER_RATINGS_Columns
		}
	},
	methods: {
		dividends() {
			return `https://www.dividenddata.co.uk/dividend-history.py?epic=${this.epic}` 
		},
		fullSymbol() {
			return "LSE:" + this.epic; 
		},
		tradeView() {
			return `https://www.tradingview.com/chart/${this.secrets.tradingviewid}?symbol=${this.fullSymbol()}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol()}`
		},
	},
	mounted() {
	  this.$store.dispatch("lse/getConstituentDetails",{epic: this.epic});
	  this.$store.dispatch("lse/getBrokerRatings",{epic: this.epic});
	}
})
</script>

<style>
</style>