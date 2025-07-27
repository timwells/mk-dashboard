<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Monte-Carlo">
			<a-row :gutter="24" type="flex">
				<a-col :span="6">
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
				<a-col :span="18">
					<a-card v-if="results2!=null" results:bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
						<a-row>
							<a-col :span="8"><a-statistic title="Depletion %" :value="results2.probabilityOfDepletion"/></a-col>
							<a-col :span="8"><a-statistic title="ShortFall.Max.Yrs" :value="results2.shortFalls.max" /></a-col>
							<a-col :span="8"><a-statistic title="ShortFall.Min.Yrs" :value="results2.shortFalls.min" /></a-col>
						</a-row>

						<CardTVMultiChartMtcl3 
							:datasets="results2.simulations"
							:probabilityOfDepletion="results2.probabilityOfDepletion"	
							:averageYearsLasted=0.0>
						</CardTVMultiChartMtcl3>
						
						<a-table 
							:columns="COLUMNS"
							:data-source="getSimulationsSummary()"
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
					</a-card>
				</a-col>
			</a-row>
		</a-tab-pane>

		<a-tab-pane key="2" tab="Portfolio">
			<h6>{{ getSymbols(portfolioName) }}</h6>
			<CardTVStockMultiChartFT :epics="getSymbols(portfolioName)"></CardTVStockMultiChartFT>
		</a-tab-pane>

		<a-tab-pane key="3" tab="Drawdown">
			<a-row :gutter="24" type="flex">
				<a-col :span="6">
					<h6>Model Variables</h6>
					<pre>{{ sdp.modelVariables }}</pre>
				</a-col>

				<a-col :span="18">
					<a-table v-if="sdp"
						:loading="loading"
						:columns="SDP_COLUMNS"
						:data-source="sdp.drawdownPlan" 
						:pagination="false"
						:rowKey="(record,i) => i"
						class='table table-small' style="margin: 0; background-color: white;">				
					</a-table>
				</a-col>
			</a-row>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import CardTVStockMultiChartFT from '@/components/Cards/CardTVStockMultiChartFT';
import CardTVMultiChartMtcl3 from '@/components/Cards/CardTVMultiChartMtcl3';
import { mapState, mapGetters } from "vuex";

const COLUMNS = [
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
const SDP_COLUMNS = [
	{
		title: 'Year',
		dataIndex: 'year',
	},
	{
		title: 'Age',
		dataIndex: 'age',
	},
	{
		title: 'Pot Start',
		dataIndex: 'pensionPotStart',
	},
	{
		title: 'Withdrawal',
		dataIndex: 'withdrawal',
	},
	{
		title: 'Tax',
		dataIndex: 'tax',
	},
	{
		title: 'Gift',
		dataIndex: 'gift',
	},
	{
		title: 'State Pension',
		dataIndex: 'statePension',
	},
	{
		title: 'Taxable Income',
		dataIndex: 'taxableIncome',
	},
	{
		title: 'Net Income After Tax & Gift',
		dataIndex: 'netIncomeAfterTaxAndGift',
	},
	{
		title: 'Pot Growth',
		dataIndex: 'pensionPotGrowth',
	},
	{
		title: 'Pot Final',
		dataIndex: 'pensionPotEnd',
	}
]

export default ({
	components: {
		CardTVStockMultiChartFT,
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
		
		...mapState("mtcl",[,"results2"]),
		...mapGetters("mtcl",["getSimulationsSummary"]),

		...mapState("mtcl",[,"sdp"]),


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

			// Model #2
			initialPortfolio: 600000,   // £500,000 starting value
			annualWithdrawal: 32000,    // £30,000 initial withdrawal
			inflationRate: 0.025,       // 2.5% annual inflation
			expectedReturn: 0.043,      // 5% annual expected return
			returnStdDev: 0.1,          // 10% return standard deviation
			simulationYears: 28, 		// Simulate 30 years
			startYear2: 2026,           // Simulate 30 years
			numSimulations: 50,         // Run x scenarios

			COLUMNS,
			SDP_COLUMNS

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

		this.$store.dispatch("mtcl/runSdpModel")
	}
})
</script>

<style lang="scss">
.ant-card-body {
    padding: 4px;
}
</style>