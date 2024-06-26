import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'

import DefaultLayout from './layouts/Default.vue'
import DashboardLayout from './layouts/Dashboard.vue'
import DashboardRTLLayout from './layouts/DashboardRTL.vue'

import router from './router'
import store from "@/store";
import './scss/app.scss';

Vue.use(Antd);

//import { AgCharts } from "ag-charts-community";
//import { AgChartsVue } from "ag-charts-vue";

//Vue.use(AgCharts);
//Vue.use(AgChartsVue);
//Vue.component('ag-charts-vue', AgChartsVue)

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    // Dispatch the action when the Vue instance is created
    this.$store.dispatch('app/getCFVersion');
  }
}).$mount('#app')

