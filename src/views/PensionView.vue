<template>
	<a-tabs default-active-key="2">
		<!--a-tab-pane key="1" tab="Monte-Carlo">
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
		</a-tab-pane-->

		<a-tab-pane key="2" tab="Monte-Carlo-2">
			<a-row :gutter="24" type="flex">
				<a-col :span="4">
					<a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
						<a-form :form="form" @submit="handleSubmit2">
							<a-form-item label='Initial Pot' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="initialPortfolio" :formatter="formatNumber" :parser="parseNumber"/>
							</a-form-item>

							<a-form-item label='Annual Drawdown' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="annualWithdrawal" :formatter="formatNumber" :parser="parseNumber"/>
							</a-form-item>

							<a-form-item label='Inflation Rate' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="inflationRate"/>
							</a-form-item>

							<a-form-item label='Expected Return' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="expectedReturn"/>
							</a-form-item>

							<a-form-item label='Return Std Dev' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="returnStdDev"/>
							</a-form-item>
						
							<a-form-item label='Years' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="simulationYears"/>
							</a-form-item>

							<a-form-item label='Start Year' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="startYear2"/>
							</a-form-item>

							<a-form-item label='Iterations' :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="numSimulations"/>
							</a-form-item>

							<a-form-item :wrapperCol="buttonLayout">
								<a-button htmlType="submit">Submit</a-button>
							</a-form-item>        
						</a-form>
					</a-card>
				</a-col>
				<a-col :span="20">
					<a-card v-if="results2!=null" results:bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
						<!--pre>{{ results2 }}</pre-->
						<CardTVMultiChartMtcl3 
							:datasets="results2.simulations"
							:probabilityOfDepletion="results2.probabilityOfDepletion"	
							:averageYearsLasted=0.0>
						</CardTVMultiChartMtcl3>
						
						<a-table 
							:columns="COLUMNS"
							:data-source="results2.simulations"
							:pagination="false"
							:rowKey="(record,i) => i"
							class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">
							
							<template slot="depleted" slot-scope="depleted">
								<p class="m-0 font-regular text-muted">{{ depleted }}</p>
							</template>
							<template slot="depletedYear" slot-scope="depletedYear">
								<p class="m-0 font-regular text-muted">{{ depletedYear }}</p>
							</template>
							<template slot="depletedShortfall" slot-scope="depletedShortfall">
								<p class="m-0 font-regular text-muted">{{ depletedShortfall }}</p>
							</template>
						</a-table>	

						<!--p v-for="(result,i) in results2.simulations" :key="i">depleted: {{ result.depleted }} | depletedYear: {{ result.depletedYear }} | depletedShortfall: {{ result.depletedShortfall }}</p--> 
					</a-card>
				</a-col>
			</a-row>
		</a-tab-pane>

		<a-tab-pane key="3" tab="Portfolio">
			<h6>{{ getSymbols(portfolioName) }}</h6>
			<CardTVStockMultiChartFT :epics="getSymbols(portfolioName)"></CardTVStockMultiChartFT>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import CardTVStockMultiChartFT from '@/components/Cards/CardTVStockMultiChartFT';
import CardTVMultiChartMtcl2 from '@/components/Cards/CardTVMultiChartMtcl2';
import CardTVMultiChartMtcl3 from '@/components/Cards/CardTVMultiChartMtcl3';
import { mapState, mapGetters } from "vuex";

const COLUMNS = [
	{
		title: 'Depleted',
		dataIndex: 'depleted',
		scopedSlots: { customRender: 'depleted' },
		sorter: (a, b) => (a.depleted === b.depleted ? 0 : a.depleted ? -1 : 1),
	},
	{
		title: 'Depleted Year',
		dataIndex: 'depletedYear',
		scopedSlots: { customRender: 'depletedYear' },
		sorter: (a, b) => a.depletedYear - b.depletedYear,
	},
	{
		title: 'Shortfall',
		dataIndex: 'depletedShortfall',
		scopedSlots: { customRender: 'depletedShortfall' },
		sorter: (a, b) => a.depletedShortfall - b.depletedShortfall,
	},
];

export default ({
	components: {
		CardTVStockMultiChartFT,
		CardTVMultiChartMtcl2,
		CardTVMultiChartMtcl3
	},
	watch: {
		portfolios(n,v) {
			// console.log(this.getSymbols("Tim"))
		}
	},
	computed: {
		...mapGetters("pensions",["getSymbols"]),
		...mapState("pensions",["portfolios"]),
		...mapState("mtcl",["results","results2"])
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

			// Model #1
            initialPot: 500000.0,
            annualDrawdown: 25000.0,
            meanReturn: 0.03,
            stdDev :0.12,
			startYear: 2026,
            years: 30,
            iterations: 50,

			// Model #2
			initialPortfolio: 800000,   // £500,000 starting value
			annualWithdrawal: 35000,    // £30,000 initial withdrawal
			inflationRate: 0.025,       // 2.5% annual inflation
			expectedReturn: 0.05,       // 5% annual expected return
			returnStdDev: 0.1,          // 10% return standard deviation
			simulationYears: 30, 
			startYear2: 2026,            // Simulate 30 years
			numSimulations: 50,         // Run x scenarios

			COLUMNS,

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
		},

		handleSubmit2(e) {
			e.preventDefault()    
			let _mcvalues = {
				initialPortfolio: this.initialPortfolio,
	            annualWithdrawal: this.annualWithdrawal,
				inflationRate: this.inflationRate,
    	        expectedReturn: this.expectedReturn,
        	    returnStdDev: this.returnStdDev,
            	simulationYears: this.simulationYears,
				startYear: this.startYear2,
            	numSimulations: this.numSimulations,
			}
			this.$store.dispatch("mtcl/runSimulation2", {simulationValues: _mcvalues})
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