<template>
  <div v-if="boeIRates">
	<apexchart 
		height="auto" 
		:options="chartOptions" 
		:series="series">
	</apexchart>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default ({
	components: {},
	computed: {
		...mapState("wscrape", ["boeIRates"])	
	},
	data() {
		return {
            series: [{name: "Index", data: [] }],
            chartOptions: {
                chart: { height: 'auto', type: 'line', zoom: { enabled: false } },
                dataLabels: { enabled: false },
                stroke: { curve: 'straight',  width: 1 },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], 
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: []
                }
            }
		}
	},
	methods: {},
	mounted() {
		this.$store.dispatch("wscrape/getBoEIRates");
	}
})  
</script>

<style>

</style>