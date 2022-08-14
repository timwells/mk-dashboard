<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<WidgetTradingView v-if="symbol" :symbol="symbol"/>
			</a-col>
		</a-row>
	</a-card>
</template>

<script>
import WidgetTradingView from '@/components/Widgets/WidgetTradingView.vue'

export default ({
	props: {
		symbol: {
			type: String,
			default: null,
		}
	},
	components: {
		WidgetTradingView
	},
	data() {
		return {}
	},
	methods: {},
	mounted() {
		console.log("mounted:",this.symbol);
	}	
})
</script>