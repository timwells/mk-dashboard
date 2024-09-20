<template>
	<div>Oil Price</div>
</template>

<script>
import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
export default ({
	components: {
	},
	watch: {
	},
	computed: {
	},
	data() {
		return {
        }
    },
	created() {
	},
	beforeMount() {
	    // Generate a unique ID when the component is created
    	// this.chartId = `id-tvc-${Math.random().toString(36).slice(2, 11)}`;		
	},
	mounted() {
		//const chartElement = document.getElementById(this.chartId);
	
		// Create the chart
		//this.chart = createChart(chartElement, this.chartProperties)

		// Create a line series and set initial data
		//this.myMap3 = this.chart.addLineSeries({color:'purple',lineWidth:1,title:"myMap3"});
		//this.myMap4 = this.chart.addLineSeries({color:'blue',lineWidth:1,title:"myMap4"});
		//this.myMap5 = this.chart.addLineSeries({color:'orange',lineWidth:1,title:"myMap5 ESG"});
		//this.myMap6 = this.chart.addLineSeries({color:'green',lineWidth:1,title:"myMap6"});
		//this.myMap7 = this.chart.addLineSeries({color:'red',lineWidth:1,title:"myMap7"});
		//this.lindT = this.chart.addLineSeries({color:'black',lineWidth:1,title:"lindsT"});

		//this.$store.dispatch("ft/getMyMapfunds");
  	},
  	beforeDestroy() {
    	//if (this.chart) {
      	//	this.chart.remove(); // Clean up the chart on component destruction
    	//}
  	},
})

</script>