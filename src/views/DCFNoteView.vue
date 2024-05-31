<template>
    <div>
      <a-tabs v-if="financials.length>0" default-active-key="1">
        <a-tab-pane key="1" tab="income-statement">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">

            <!--pre v-if="financials">{{ incomeStatement() }}</pre-->
            <!--pre v-if="financials">{{ incomeStatement() }}</pre-->           
            <!--pre v-if="financials">{{ incomeStatementTable() }}</pre-->

            <a-table
              :columns="incomeStatementTable().columns"
              :data-source="incomeStatementTable().data"
              :pagination="pagination"
              class='table table-small' style="margin: 6;">
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2" tab="cash-flow-statement">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <pre>{{ financials[1].data.statement }}</pre>
            <pre>{{ financials[1].data.map }}</pre>

          </a-card>
        </a-tab-pane>
        <a-tab-pane key="3" tab="balance-sheet">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <pre>{{ financials[2].data.statement }}</pre>
            <pre>{{ financials[2].data.map }}</pre>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="4" tab="ratios">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <pre>{{ financials[3].data.statement }}</pre>
            <pre>{{ financials[3].data.map }}</pre>
          </a-card>
        </a-tab-pane>
      </a-tabs>


      <!--a-row :gutter="24" type="flex">
		    <a-col :span="24" class="mb-24">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <a-table
              :columns="balanceSheetCols"
              :data-source="balanceSheetData"
              class='table table-small' style="margin: 6;">
            </a-table>
          </a-card>
        </a-col>  
      </a-row-->
      
      <a-row :gutter="24" type="flex">
		    <a-col :span="12" class="mb-12">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <a-form :form="form" @submit="handleSubmit">
              <a-form-item label='Discount Rate' :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number
                    v-decorator="[ 'discountRate', { initialValue: 0.1, 
                      rules: [{ required: true, message: 'Error!'}]}]"/>
              </a-form-item>

              <a-form-item label='Growth Rate' :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number 
                  v-decorator="[ 'growthRate', { initialValue: 0.04, 
                    rules: [{ required: true, message: 'Error!'}]} ]"/>
              </a-form-item>
              
              <a-form-item label='Term Growth Rate' :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number 
                  v-decorator="[ 'terminalGrowthRate', { initialValue: 0.02, 
                    rules: [{ required: true, message: 'Error!'}]} ]"/>        
              </a-form-item>

              <a-form-item label='Shares Outstanding' :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number 
                  v-decorator="[ 'sharesOutstanding', { initialValue: 1200000000, 
                    rules: [{ required: true, message: 'Error!'}]} ]"/>      
              </a-form-item>

              <a-form-item label='Net Debt' :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number 
                  v-decorator="[ 'netDebt', { initialValue: 10961000,
                    rules: [{ required: true, message: 'Error!'}]} ]"/>     
              </a-form-item>

              <a-form-item label='Free Cash Flow' :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input-number 
                  v-decorator="[ 'fcf', { initialValue: 28841000, 
                    rules: [{ required: true, message: 'Error!'}]} ]"/>   
              </a-form-item>      
          
              <a-form-item>
                <a-button htmlType="submit">Submit</a-button>
              </a-form-item>        
            </a-form>
        </a-card>
      </a-col>
      <a-col :span="12" class="mb-12">
        <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
          <pre v-if="dcf">{{dcf}}</pre>
        </a-card>
      </a-col> 
    </a-row>

    <!--a-row>
      <a-col :span="12" class="mb-12">
        <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
          <pre v-if="financials">{{financials[2].data.info.quote}}</pre>
        </a-card>
      </a-col>
      <a-col :span="12" class="mb-12">
        <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
          <pre v-if="financials">{{financials.length}}</pre>
          <pre v-if="financials">{{financials[0].data.statement}}</pre>
          <pre v-if="financials">{{financials[1].data.statement}}</pre>
          <pre v-if="financials">{{financials[2].data.statement}}</pre>
          <pre v-if="financials">{{financials[3].data.statement}}</pre>
        </a-card>
      </a-col>
    </a-row--> 
  </div>
</template>

<script>
// https://charts.ag-grid.com/vue/quick-start/


/* 
{
  "discountRate": 0.1,
  "growthRate": 0.04,
  "terminalGrowthRate": 0.02,
  "sharesOutstanding": 1200000000,
  "netDebt": 10841000,
  "fcf": 28841000
}
*/
import { mapState, mapGetters } from "vuex";

const balanceSheetCols = [
{
	title: 'Year',
	dataIndex: 'entity',
},
{
	title: '2023',
	dataIndex: 'y23',
},
{
	title: '2022',
	dataIndex: 'y22',
},
{
	title: '2021',
	dataIndex: 'y21',
},
{
	title: '2020',
	dataIndex: 'y20',
},
{
	title: '2019',
	dataIndex: 'y19',
}
];

const balanceSheetData = [
  {
    entity:"Cash & Equivalents",
    y23: 23.51,
    y22: 22
  },
  {
    entity:"*Cash & Cash Equivalents*",
    y23: 23.51,
    y22: 22
  },
  {
    entity:"Cash Growth",
    y23: "41.95%",
    y22: 22
  },
  {
    entity:"Receivables",
    y23: 20.74,
    y22: 22
  },
  {
    entity:"Inventory",
    y23: 1.85,
    y22: 22
  },
  {
    entity:"Other Current Assets",
    y23: 1.7,
    y22: 22
  },
]

export default ({
	components: {},
  computed: {
    ...mapState("dcf", ["dcf"]),
    ...mapState("san", ["financials"]),
    ...mapGetters("san",["incomeStatement","incomeStatementTable"])
  },
  data() { 
    return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this),

        labelCol: { span: 8 },
        wrapperCol: { span: 4 },

        balanceSheetCols,
        balanceSheetData,

        pagination: { pageSize: 300 },

    }
  },
  beforeCreate() {
		// Creates the form and adds to it component's "form" property.
		// this.dcfForm = this.$dcfForm.createForm(this, { name: 'dcf' });
	},
  methods: {
    handleSubmit (e) {
    e.preventDefault()    
    this.form.validateFields((err, values) => {
      if (!err) { console.log('Received values of form: ', values)}
  	    this.$store.dispatch("dcf/postDCF",{dcf:values});
      })
    },
  },
	mounted() {
    this.$store.dispatch("san/getFinancials",{exchange:"LON", symbol:"I3E"});
  }
})
</script>

<style scoped>
.ant-input-number {
  width: 120px;
}
</style>