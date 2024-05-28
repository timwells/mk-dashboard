<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="Name">
          <a-input placeholder="Add Name" 
            v-decorator="[ 'name2', {rules: [{ required: true, message: 'Error!', whitespace: true}]} ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="url">
          <a-input placeholder="Add Url" 
            v-decorator="[ 'url2', {rules: [{ required: true, message: 'Error!', whitespace: true}]} ]" />
        </a-form-item>
      </a-col>
      <!--a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="执行人">
          <a-select
            placeholder="请选择执行人"
            v-decorator="[
              'owner2',
              {rules: [{ required: true, message: '请选择执行人'}]}
            ]" >
            <a-select-option value="黄丽丽">黄丽丽</a-select-option>
            <a-select-option value="李大刀">李大刀</a-select-option>
          </a-select>
        </a-form-item>
      </a-col-->
    </a-row>
    <!--a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="责任人">
          <a-select
            placeholder="请选择责任人"
            v-decorator="[
              'approver2',
              {rules: [{ required: true, message: '请选择责任人'}]}
            ]" >
            <a-select-option value="王伟">王伟</a-select-option>
            <a-select-option value="李红军">李红军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="提醒时间">
          <a-time-picker
            style="width: 100%"
            v-decorator="[
              'dateRange2',
              {rules: [{ required: true, message: '请选择提醒时间'}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="任务类型">
          <a-select
            placeholder="请选择任务类型"
            v-decorator="[ 'type2', {rules: [{ required: true, message: '请选择任务类型'}]} ]" >
            <a-select-option value="定时执行">定时执行</a-select-option>
            <a-select-option value="周期执行">周期执行</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row-->
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'TaskForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      console.log(this.form.fieldsStore.fields)
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>