<template>
    <div>
        <apexchart height="600" :options="chartOptions" :series="series"></apexchart>
    </div> 
</template>

<script>
import { mapState } from "vuex";


/*
this.$refs.radar.updateSeries([{
      name: 'Series 1',
      data: [your_new_data_here] //ie [1,2,3,4]
}])
this.$refs.radar.updateOptions({
      xaxis: {
        categories: [your_new_categories_here] //ie ["a","b","c","d"]
      }
})
*/

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
            series: [{
                name: "Index",
                data: []
            }],
            chartOptions: {
                chart: { height: '600', type: 'line', zoom: { enabled: false } },
                dataLabels: { enabled: false },
                stroke: { curve: 'straight' },
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
            
            this.chartOption = {
                chart: { height: "600", type: 'line', zoom: { enabled: false } },
                dataLabels: { enabled: false },
                stroke: { curve: 'straight' },
                grid: { row: { colors: ['#f3f3f3', 'transparent'],  opacity: 0.5 } },
                xaxis: { categories: this.categories }
            }
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