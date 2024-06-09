<template>
	<a-card hoverable style="padding: 2px;">
    	<a-card-meta :title='title'>
      		<template #description>Sedol: {{sedol}}</template>
    	</a-card-meta>
    	<template #cover>
			<img v-if="ticker.length>0" :src="url" alt="Performance Chart" />
    	</template>
  	</a-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default ({
	props: {
		title: {
			type: String,
			default: "",
		},
		ticker: {
			type: String,
			default: "",
		},
		sedol: {
			type: String,
			default: "",
		}
	},
	computed: {
    	...mapState("funds", ["fundDetails"]),
		...mapGetters("funds",["gfundDetail"]),
	},
	data() {
		return {
			url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&color=0047AB&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,
		}
	},
	methods: {
		details(key) {
			return this.gfundDetail(key)
		}
	},
	mounted() {
		// this.details(this.ticker)
    	console.log(`CardChartFundInfo:${this.title} - ${this.sedol}`);
	},
})
</script>

<style lang="scss">
img {
  transform: scale(0.95);
}

.price-divide {
    font-size: 1.3em;
    font-weight: bold;
    margin-right: 0.4em;
    padding-right: 0.4em;
    border-right: 0.13em solid #1e1d56;
}

</style>