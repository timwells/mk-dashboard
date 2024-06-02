<template>
    <div>
      <a-tabs v-if="financials" default-active-key="1">
        <a-tab-pane key="1" tab="DCF Model">
          <a-row :gutter="24" type="flex">
            <a-col :span="24" class="mb-24">
              <a-card :bordered="true" class="header-solid h-full">
                <div>{{ financialDCFData() }}</div>
              </a-card>
            </a-col>
          </a-row>

          <a-row :gutter="24" type="flex">
            <a-col :span="8" class="mb-8">
              <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item label='Discount Rate %' :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <!--a-input-number v-model="_discountRate" v-decorator="[ 'discountRate', { initialValue: 0.1, rules: [{ required: true, message: 'Error!'}]}]"/-->
                      <a-input-number v-model="discountRate"/>
                    </a-form-item>

                    <a-form-item label='Growth Rate %' :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <!-- <a-input-number v-decorator="[ 'growthRate', { initialValue: 0.04, rules: [{ required: true, message: 'Error!'}]} ]"/> -->
                      <a-input-number v-model="growthRate"/>
                    </a-form-item>
              
                    <a-form-item label='Term Growth Rate' :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <!-- <a-input-number v-decorator="[ 'terminalGrowthRate', { initialValue: 0.02, rules: [{ required: true, message: 'Error!'}]} ]"/>         -->
                      <a-input-number v-model="terminalGrowthRate"/>
                    </a-form-item>

                    <a-form-item label='Shares Outstanding' :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <!-- <a-input-number v-decorator="[ 'sharesOutstanding', { initialValue: 1200000000, rules: [{ required: true, message: 'Error!'}]} ]"/>       -->
                      <a-input-number v-model="sharesOutstanding"/>
                    </a-form-item>

                    <a-form-item label='Net Debt' :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <!-- <a-input-number v-decorator="[ 'netDebt', { initialValue: 10961000, rules: [{ required: true, message: 'Error!'}]} ]"/>      -->
                      <a-input-number v-model="netDebt"/>
                    </a-form-item>

                    <a-form-item label='Free Cash Flow' :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <!-- <a-input-number v-decorator="[ 'fcf', { initialValue: 28841000, rules: [{ required: true, message: 'Error!'}]} ]"/>    -->
                      <a-input-number v-model="fcf"/>
                    </a-form-item>      
          
                    <a-form-item>
                      <a-button htmlType="submit">Submit</a-button>
                    </a-form-item>        
                </a-form>
              </a-card>
            </a-col>

            <a-col :span="16" class="mb-16">
              <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
                <pre v-if="dcf">{{dcf}}</pre>
              </a-card>
            </a-col> 
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="2" tab="Income Statement">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <a-table v-if="financials"
              :columns="financialTableColumns()"
              :data-source="financialTableData(sanTypes.INCOME)"
              :pagination="pagination"
              class='table' style="margin: 0; background-color: white;">
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Cash Flow Statement">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <a-table v-if="financials"
              :columns="financialTableColumns()"
              :data-source="financialTableData(sanTypes.CASH_FLOW)"
              :pagination="pagination"
              class='table table-small' style="margin: 0; background-color: white;">
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="4" tab="Balance Sheet">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <a-table v-if="financials"
              :columns="financialTableColumns()"
              :data-source="financialTableData(sanTypes.BALANCE_SHEET)"
              :pagination="pagination"
              class='table table-small' style="margin: 0; background-color: white;">
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="5" tab="Ratios">
          <a-card :bordered="true" class="header-solid h-full" :bodyStyle="{paddingTop: '8px',}">
            <a-table v-if="financials"
              :columns="financialTableColumns()"
              :data-source="financialTableData(sanTypes.RATIOS)"
              :pagination="pagination"
              class='table table-small' style="margin: 0; background-color: white;">
            </a-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
  </div>
</template>

<script>
// https://charts.ag-grid.com/vue/quick-start/

import { mapState, mapGetters } from "vuex";

export default ({
	components: {
  },
  computed: {
    ...mapState("dcf", ["dcf"]),
    ...mapState("san", ["financials","sanTypes"]),
    ...mapGetters("san",
    [
        "incomeStatement",
        "financialTableColumns",
        "financialTableData",
        "financialDCFData"
    ])
  },
  watch: {
    financials(newVal,oldVal) {
      this.sharesOutstanding = this.financialDCFData().shareswa,
      this.netDebt = this.financialDCFData().debt
      this.fcf = this.financialDCFData().fcf
    }
  },
  data() { 
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      labelCol: { span: 8 },
      wrapperCol: { span: 4 },
      pagination: { pageSize: 300 },

      // Defaults
      discountRate: 0.1,
      growthRate: 0.04,
      terminalGrowthRate: 0.02,

      // Determined
      sharesOutstanding: 0,
      netDebt:0,
      fcf: 0,
    }
  },
  beforeCreate() {
		// Creates the form and adds to it component's "form" property.
		// this.dcfForm = this.$dcfForm.createForm(this, { name: 'dcf' });
	},
  methods: {
    handleSubmit (e) {
      e.preventDefault()    
      let _dcf = {
        discountRate: this.discountRate,
        growthRate: this.growthRate,
        terminalGrowthRate: this.terminalGrowthRate,
        sharesOutstanding: this.sharesOutstanding,
        netDebt: this.netDebt,
        fcf: this.fcf
      }

      this.$store.dispatch("dcf/postDCF",{dcf:_dcf});

    /*
    this.form.validateFields((err, values) => {
      if (!err) { console.log('Received values of form: ', values) }      
       this.$store.dispatch("dcf/postDCF",{dcf:values});
      })
    */
    },
  },
	mounted() {
    // this.$store.dispatch("san/getFinancials",{exchange:"LON", symbol:"I3E"});
    // this.$store.dispatch("san/getFinancials",{exchange:"LON", symbol:"PRU"});
    this.$store.dispatch("san/getFinancials",{exchange:"LON", symbol:"NG"});

  }
})
</script>

<style scoped>
.ant-input-number { width: 120px; }

.ant-table table { font-size: 18px; }
</style>