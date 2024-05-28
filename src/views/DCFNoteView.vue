<template>
    <div>
      <a-row :gutter="24" type="flex">
		    <a-col :span="12" class="mb-12">
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

            <a-form-item
              label='Free Cash Flow' :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number 
                  v-decorator="[ 'fcf', 
                    { initialValue: 28841000, rules: [{ required: true, message: 'Error!'}]} ]"/>   
            </a-form-item>      
        
            <a-form-item>
              <a-button htmlType="submit">Submit</a-button>
            </a-form-item>        
          </a-form>
      </a-col>
      <a-col :span="12" class="mb-12">
        <pre v-if="dcf">{{dcf}}</pre>
      </a-col> 
    </a-row>
    <a-row>
      <a-col :span="24" class="mb-24">
        <pre v-if="financials">{{financials}}</pre>
      </a-col>
    </a-row> 
  </div>
</template>

<script>
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
import { mapState } from "vuex";

export default ({
	components: {},
  computed: {
    ...mapState("dcf", ["dcf"]),
    ...mapState("san", ["financials"]),
  },
  data() { 
    return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this),
        labelCol: { span: 8 },
        wrapperCol: { span: 4 }

        // labelCol: "{}",
        //wrapperCol: "{}"   
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