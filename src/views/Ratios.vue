<template>
	<div>
		<a href="https://www.multpl.com/" target="_blank">Multpl - Market, financial, and economic data.</a>

		<a-row :gutter="24" type="flex">
			<!--div ref="shillerPE" :style="{ width: '100%', height: '450px' }"></div-->
		</a-row>
		<a-row :gutter="24" type="flex">
			<a-col :span="12" class="mb-12">
				<apexchart v-if="shillerPESeries!=null" 
					:options="shillerPEChartOpts" 
					:series="shillerPESeries"
					height="450">
				</apexchart>
			</a-col>
			<a-col :span="12" class="mb-12">
				<apexchart v-if="spPESeries!=null" 
					:options="spPEChartOpts" 
					:series="spPESeries"
					height="450">
				</apexchart>
			</a-col>
		</a-row>	
		<!--a-row :gutter="24" type="flex">
			<a-col :span="12" class="mb-12">
				<apexchart v-if="yr1TreasuryRateSeries!=null" 
					:options="yr1TreasuryRateChartOpts" 
					:series="yr1TreasuryRateSeries"
					height="450">
				</apexchart>
			</a-col>
			<a-col :span="12" class="mb-12">
				<apexchart v-if="yr10TreasuryRateSeries!=null" 
					:options="yr10TreasuryRateChartOpts" 
					:series="yr10TreasuryRateSeries"
					height="450">
				</apexchart>
			</a-col>
		</a-row-->	
	</div>
</template>

<script>
// https://www.multpl.com/
const DS_SHILLER_PE = "shiller-pe/table/by-year"
const DS_SP500_PE = "s-p-500-pe-ratio/table/by-month"
const DS_1YR_TREASURY_RATE = "1-year-treasury-rate/table/by-month"
const DS_10YR_TREASURY_RATE = "10-year-treasury-rate/table/by-month"

const _CHART = { type: 'line', zoom: { enabled: false } }
const _DATALABLES = { enabled: false }
const _STROKE = { curve: 'straight',  width: 2 }
const _TITLE = { text: '', align: 'left' }
const _GRID = { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5}}
const _XAXIS = { categories: null, tickAmount: 25 }

import { mapState, mapGetters } from "vuex";
//import { 
//	SciChartSurface, 
//	NumericAxis, 
//	XyDataSeries, 
//	FastLineRenderableSeries, 
//	EAutoRange,
//	RolloverModifier,
//	EWatermarkPosition
//} from 'scichart';

export default ({
	components: {
	},
	computed: {
    	...mapState("mtpl", ["mtplDataSets"]),
		...mapGetters("mtpl",["gMtplDataSetExists"]),
	},
	watch: {
		mtplDataSets(o,n) {
			let index
			index = this.gMtplDataSetExists(DS_SHILLER_PE)
			
			if(index > -1) {
				this.shillerPESeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.v)}]
				this.shillerPEChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.dts);
				this.shillerPEChartOpts.title.text = n[index].ds

				/*

				const yValues = n[index].rows.map(e => e.v)
				const xValues = n[index].rows.map((v,i) => v.dto)

				const xyDataSeries = new XyDataSeries(this.sciCSObj.wasmContext, { xValues, yValues });
				const lineSeries = new FastLineRenderableSeries(this.sciCSObj.wasmContext, {
					dataSeries: xyDataSeries,
					stroke: "#0000ff", // Blue line
					strokeThickness: 1,
	      		});

				lineSeries.dataSeries.appendRange(xValues, yValues);

				this.sciCSObj.sciChartSurface.renderableSeries.add(lineSeries);
				*/
			}
			index = this.gMtplDataSetExists(DS_SP500_PE)
			if(index > -1) {
				this.spPESeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.v)}]
				this.spPEChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.dts);
				this.spPEChartOpts.title.text = n[index].ds
			}
			index = this.gMtplDataSetExists(DS_1YR_TREASURY_RATE)
			if(index > -1) {
				this.yr1TreasuryRateSeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.c)}]
				this.yr1TreasuryRateChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.dts);
				this.yr1TreasuryRateChartOpts.title.text = n[index].ds
			}
			index = this.gMtplDataSetExists(DS_10YR_TREASURY_RATE)
			if(index > -1) {
				this.yr10TreasuryRateSeries = [{ name: n[index].ds, data: n[index].rows.map(e => e.v)}]
				this.yr10TreasuryRateChartOpts.xaxis.categories = n[index].rows.map((v,i) => v.dts);
				this.yr10TreasuryRateChartOpts.title.text = n[index].ds
			}
		}
    },
	data() {
		return {
			xValues:[],
			yValues: [],			
			sciCSObj: null, // Initialize the SciChartSurface variable,

			shillerPESeries: null,
			shillerPEChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
			spPESeries: null,
			spPEChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
			yr1TreasuryRateSeries: null,
			yr1TreasuryRateChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
			yr10TreasuryRateSeries: null,
			yr10TreasuryRateChartOpts: { chart: _CHART, dataLabels: _DATALABLES, title: Object.assign({}, _TITLE),
                stroke: _STROKE, grid: _GRID, xaxis: Object.assign({}, _XAXIS) // Adjust tick amount to space labels
			},
		}
	},
	methods: {
		async initSciChart() {
			// Initialize SciChart
			// const { sciChartSurface, wasmContext } = await SciChartSurface.create(this.$refs.shillerPE);
			// this.sciCSObj = await SciChartSurface.create(this.$refs.shillerPE);
	
			// this.sciCSObj.sciChartSurface.background = "#ffffff";
			// this.sciCSObj.sciChartSurface.watermarkPosition = EWatermarkPosition.TopLeft
      
			// Add X and Y Axes
			// const xAxis = new DateTimeAxis(this.sciCSObj.wasmContext);// Set up the x-axis with date formatting options
			
			
			// const xAxis = new NumericAxis(this.sciCSObj.wasmContext);
			// xAxis.labelProvider.formatLabel = (dataValue) => {
    			//const date = new Date(dataValue);
    			// Customize the date format as needed
    			//return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
			//};

			/*
			const xAxis = new DateTimeNumericAxis(wasmContext, {
  				axisTitle: "X Axis / DateTime",
  				// We need to specify some visibleRange to see these two dates
  				// SciChart.js expects linux timestamp / 1000
  				// visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
  				visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
			});
			*/

/*
			const rolloverModifier = new RolloverModifier({
				showTooltip: true,
				tooltipDataTemplate: (seriesInfo) => {
				const { formattedXValue, formattedYValue } = seriesInfo;
				const date = new Date(Number(formattedXValue));
				const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
				return `Date: ${dateStr}, Value: ${formattedYValue}`;
				},
				rolloverLineStroke: "#ff6600",
				tooltipColor: "#ff6600"
			});
*/
			//this.sciCSObj.sciChartSurface.chartModifiers.add(rolloverModifier);

			/*
			xAxis.drawMajorBands = false;
			xAxis.drawMajorGridLines = false;
			xAxis.drawMinorGridLines = false;
			*/

			//xAxis.majorGridLineStyle = { stroke: "#d3d3d3", strokeThickness: 1 };
			//xAxis.minorGridLineStyle = { stroke: "#d3d3d3", strokeThickness: 0.5 };
			/*	
			const yAxis = new NumericAxis(this.sciCSObj.wasmContext);
			yAxis.drawMajorBands = false;
			yAxis.autoRange = EAutoRange.Always;
			yAxis.axisAlignment = 'Left'; // Align Y-Axis to the left
			yAxis.drawMajorGridLines = true;
			yAxis.drawMinorGridLines = false;
			*/
			//yAxis.majorGridLineStyle = { stroke: "#d3d3d3", strokeThickness: 1 };
			//yAxis.minorGridLineStyle = { stroke: "#d3d3d3", strokeThickness: 0.5 };
		
			//this.sciCSObj.sciChartSurface.xAxes.add(xAxis);
			//this.sciCSObj.sciChartSurface.yAxes.add(yAxis);

			// Create a linear data set
			//const xValues = [0, 1, 2, 3, 4, 5];
			//const yValues = [0, 1, 4, 9, 16, 25];

			// Create DataSeries and RenderableSeries
			//const xyDataSeries = new XyDataSeries(this.sciCSObj.wasmContext, { xValues, yValues });

			/*
			const lineSeries = new FastLineRenderableSeries(this.sciCSObj.wasmContext, {
				dataSeries: xyDataSeries,
				stroke: "#0000ff", // Blue line
				strokeThickness: 1,
	      	});
			*/

			// this.sciCSObj.sciChartSurface.renderableSeries.add(lineSeries);
		},
	},
	async mounted() {
		// this.initSciChart();
		this.$store.dispatch("mtpl/getMtplData",{ds: DS_SHILLER_PE});
		//this.$store.dispatch("wscrape/getMtplData",{ds: DS_SP500_PE})
		//this.$store.dispatch("wscrape/getMtplData",{ds: DS_1YR_TREASURY_RATE})
		//this.$store.dispatch("wscrape/getMtplData",{ds: DS_10YR_TREASURY_RATE})
	},
})


</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>