<template>
    <div>
        <apexchart height="auto" :options="chartOptions" :series="series"></apexchart>
    </div> 
</template>

<script>
import { mapState } from "vuex";

export default {
	computed: {
    	...mapState("crypto", ["values","categories"]),
	},
    watch: {
        values(o,n) {
            if(o) this.updateChart()
        },
        categories(o,n) {
            if(o) this.updateChart()
        },
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
    methods: {
        updateChart() {
            this.chartOptions = { ...this.chartOptions, ...{ xaxis: { categories: this.categories } }};
            this.series = [{ name: "Index", data: this.values }]
        }
    },
    mounted() {
	    this.$store.dispatch("crypto/getIndex");
    }
}
</script>

<style>

</style>