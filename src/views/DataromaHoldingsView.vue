<template>
  <a-row :gutter="24" type="flex">
		<a-col :span="24" class="mb-24">
			<a-table v-if="holdingList(investor)"
				:columns="holdingsCols" 
				:data-source="holdingList(investor)" 
				:pagination=false
				:rowKey="(record,index) => index"

				class='table table-small' style="margin: 0; background-color: white;">
				
				<template slot="stock" slot-scope="stock">
					<p class="m-0 font-regular text-muted">{{ stock }}</p>
				</template>
				<template slot="portfolio" slot-scope="portfolio">
					<p class="m-0 font-regular text-muted">{{ portfolio }}</p>
				</template>
				<template slot="recentActivity" slot-scope="recentActivity">
					<p class="m-0 font-regular text-muted">{{ recentActivity }}</p>
				</template>
				<template slot="reportedPrice" slot-scope="reportedPrice">
					<p class="m-0 font-regular text-muted">{{ reportedPrice }}</p>
				</template>
				<template slot="value" slot-scope="value">
					<p class="m-0 font-regular text-muted">{{ value }}</p>
				</template>
				<template slot="currentPrice" slot-scope="currentPrice">
					<p class="m-0 font-regular text-muted">{{ currentPrice }}</p>
				</template>
				<template slot="deltaReportedPrice" slot-scope="deltaReportedPrice">
					<p class="m-0 font-regular text-muted">{{ deltaReportedPrice }}</p>
				</template>
				<template slot="weekLow" slot-scope="weekLow">
					<p class="m-0 font-regular text-muted">{{ weekLow }}</p>
				</template>
				<template slot="weekHigh" slot-scope="weekHigh">
					<p class="m-0 font-regular text-muted">{{ weekHigh }}</p>
				</template>
			</a-table>
		</a-col>
	</a-row>
</template>

<script>
const holdingsCols = [
	{ title: 'Stock', dataIndex: 'stock', scopedSlots: { customRender: 'stock' }},
	{ title: 'Portfolio %', dataIndex: 'portfolio', scopedSlots: { customRender: 'portfolio' }},
	{ title: 'Recent Activity', dataIndex: 'recentActivity', scopedSlots: { customRender: 'recentActivity' }},
	{ title: 'Share', dataIndex: 'share', scopedSlots: { customRender: 'share' }},
	{ title: 'Reported Price', dataIndex: 'reportedPrice', scopedSlots: { customRender: 'reportedPrice' }},
	{ title: 'Value', dataIndex: 'value', scopedSlots: { customRender: 'value' }},
	{ title: 'Current Price', dataIndex: 'currentPrice', scopedSlots: { customRender: 'currentPrice' }},
	{ title: 'Delta Reported Price', dataIndex: 'deltaReportedPrice', scopedSlots: { customRender: 'deltaReportedPrice' }},
	{ title: 'Week Low', dataIndex: 'weekLow', scopedSlots: { customRender: 'weekLow' }},
	{ title: 'Week High', dataIndex: 'weekHigh', scopedSlots: { customRender: 'weekHigh' }}
];

import { mapGetters } from "vuex";

export default ({
	props: {
		investor: {
			type: String,
			default: "",
		},
	},

	computed: {
		...mapGetters("drm",["holdings"]),
	},
	watch: {
	},
  	data() {
    	return {
			holdingsCols,
   		}
  	},
	methods: {
		holdingList(_investor) {
			let h;
			return (h = this.holdings(_investor)) ? h.data : null
		}
	},
	mounted() {
  		this.$store.dispatch("drm/getHoldings",{ investor: this.investor });
	}
})
</script>

<style>

</style>