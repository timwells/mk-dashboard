<template>
	<a-card hoverable style="padding: 2px;">
    	<a-card-meta :title='title'>
      		<template #description>Citi Code: {{ticker}}</template>
    	</a-card-meta>
    	<template #cover>
			<img v-if="ticker.length>0" :src="url" alt="Performance Chart" />
    	</template>
  	</a-card>
</template>

<script>
export default ({
	props: {
		title: {
			type: String,
			default: "",
		},
		ticker: {
			type: String,
			default: "",
		}
	},
	computed: {
		chartUrl() {
		}
	},
	data() {
		return {
			url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&color=0047AB&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,
		}
	},
	methods: {
	}		
})
</script>

<style lang="scss">
img {
  transform: scale(0.95);
}
</style>