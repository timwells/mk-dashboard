<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Monte-Carlo">
			<a-row :gutter="24" type="flex">
				<a-col :span="4">
					<a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
						<a-form :form="form" @submit="handleSubmit">
							<a-form-item label='Initial Pot' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="initialPot" :formatter="formatNumber" :parser="parseNumber"/>
							</a-form-item>

							<a-form-item label='Annual Drwdwn' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="annualDrawdown" :formatter="formatNumber" :parser="parseNumber"/>
							</a-form-item>

							<a-form-item label='Mean Return' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="meanReturn"/>
							</a-form-item>

							<a-form-item label='stdDev' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="stdDev"/>
							</a-form-item>
						
							<a-form-item label='Years' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="years"/>
							</a-form-item>

							<a-form-item label='Start Year' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="startYear"/>
							</a-form-item>


							<a-form-item label='Iterations' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="iterations"/>
							</a-form-item>

							<a-form-item :wrapperCol="buttonLayout">
								<a-button htmlType="submit">Submit</a-button>
							</a-form-item>        
						</a-form>
					</a-card>
				</a-col>
				<a-col :span="20">
					<a-card v-if="results!=null" results:bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
						<CardTVMultiChartMtcl2 
							:datasets="results.runs"
							:probabilityOfDepletion="results.probabilityOfDepletion"	
							:averageYearsLasted="results.averageYearsLasted">
						</CardTVMultiChartMtcl2>						
					</a-card>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Portfolio">
			<h6>{{ getSymbols(portfolioName) }}</h6>
			<CardTVStockMultiChartFT :epics="getSymbols(portfolioName)"></CardTVStockMultiChartFT>
		</a-tab-pane>
		<a-tab-pane key="3" tab="Tabs 3">

		</a-tab-pane>
	</a-tabs>
</template>

<script>
import CardTVStockMultiChartFT from '@/components/Cards/CardTVStockMultiChartFT';
import CardTVMultiChartMtcl2 from '@/components/Cards/CardTVMultiChartMtcl2';
import { mapState, mapGetters } from "vuex";

export default ({
	components: {
		CardTVStockMultiChartFT,
		CardTVMultiChartMtcl2
	},
	watch: {
		portfolios(n,v) {
			// console.log(this.getSymbols("Tim"))
		}
	},
	computed: {
		...mapGetters("pensions",["getSymbols"]),
		...mapState("pensions",["portfolios"]),
		...mapState("mtcl",["results"])
	},
	data() {
		return {
			portfolioName: "Tim",
			formLayout: 'horizontal',
			form: this.$form.createForm(this),
		
			labelCol: { span: 12 },		
			wrapperCol: { 
				span: 8, 
				offset: 2,
			},
			buttonLayout: { 
				span: 8, 
				offset: 14,
			},


            initialPot: 500000.0,
            annualDrawdown: 25000.0,
            meanReturn: 0.03,
            stdDev :0.12,
			startYear: 2026,
            years: 30,
            iterations: 50,

/*
Age: 65
Retirment Age: 65
DC Pot: £250,000
Pension Growth Rate: 6%
Mortality Age: 90
State Pension Status: Full at 67
State Pension Growth rate: 2.5%
*/
		}
	},
	methods: {
		// Formatter: Add commas to the number
		formatNumber(value) {
			if (!value) return '';
			return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},
		// Parser: Remove commas for actual input value
		parseNumber(value) {
			return value ? value.replace(/,/g, '') : '';
		},
		handleSubmit (e) {
	    	e.preventDefault()    
			let _mcvalues = {
				initialPot: this.initialPot,
	            annualDrawdown: this.annualDrawdown,
    	        meanReturn: this.meanReturn,
        	    stdDev: this.stdDev,
            	years: this.years,
				startYear: this.startYear,
            	iterations: this.iterations,
			}
			this.$store.dispatch("mtcl/runSimulation", {simulationValues: _mcvalues})
		}
	},
	async mounted() {
    	this.$store.dispatch("pensions/getPortfolios")
	}
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>