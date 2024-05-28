<template>
  <div>
    <!-- 
    {
      "discountRate": 0.1,
      "growthRate": 0.04,
      "terminalGrowthRate": 0.02,
      "sharesOutstanding": 1200000000,
      "netDebt": 10841000,
      "fcf": 28841000
    }
    -->
    <div>
      <a-row :gutter="24" type="flex">
		    <a-col :span="24" class="mb-24">
          <a-form :form="dcfForm">
            <a-form-item
              label='Discount Rate'
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 4 }"
              fieldDecoratorId="discountrate"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Discount Rate!' }]}">
              <a-input defaultValue="0.1" />
            </a-form-item>
            <a-form-item
              label='Growth Rate'
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 4 }"
              fieldDecoratorId="growthrate"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Growth Rate!' }]}">
              <a-input defaultValue="0.04" />
            </a-form-item>
            <a-form-item
              label='Terminal Growth Rate'
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 4 }"
              fieldDecoratorId="terminalgrowthrate"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Terminal Growth Rate!' }]}">
              <a-input defaultValue="0.02" />
            </a-form-item>

            <a-form-item
              label='Shares Outstanding'
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 4 }"
              fieldDecoratorId="sharesOutstanding"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Shares Outstanding!' }]}">
              <a-input defaultValue="1200000000" />
            </a-form-item>

            <a-form-item
              label='Net Debt'
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 4 }"
              fieldDecoratorId="netDebt"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Net Debt!' }]}">
              <a-input defaultValue="10841000" />
            </a-form-item>

            <a-form-item
              label='Free Cash Flow'
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 4 }"
              fieldDecoratorId="fcf"
              :fieldDecoratorOptions="{rules: [{ required: true, message: 'Please input your Free Clash low!' }]}">
              <a-input defaultValue="28841000" />
            </a-form-item>      
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>


<script>

export default ({
	components: {},
  data() { 
    return {
        formLayout: 'horizontal',
    }
  },
  beforeCreate() {
		// Creates the form and adds to it component's "form" property.
		this.dcfForm = this.$dcfForm.createForm(this, { name: 'dcf' });
	},
  methods: {
    handleSubmit (e) {
    e.preventDefault()
    this.form.validateFields((err, values) => {
      if (!err) { console.log('Received values of form: ', values)}
    })
  },
  handleSelectChange (value) {
    console.log(value)
    this.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    })
  },
  }    
})
</script>

<style>
p {
    font-size: 15px;
}
</style>