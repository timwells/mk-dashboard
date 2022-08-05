<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<WidgetTradingViewBrokerAnalysis v-if="symbol" :symbol="symbol"/>
			</a-col>
		</a-row>
	</a-card>
</template>

<script>
import WidgetTradingViewBrokerAnalysis from '@/components/Widgets/WidgetTradingViewBrokerAnalysis.vue'

export default ({
	props: {
		symbol: {
			type: String,
			default: null,
		}
	},
	components: {
		WidgetTradingViewBrokerAnalysis
	},
	data: () => ({}),
	methods: {}		
})
</script>