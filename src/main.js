
import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import DefaultLayout from './layouts/Default.vue'
import DashboardLayout from './layouts/Dashboard.vue'
import DashboardRTLLayout from './layouts/DashboardRTL.vue'
import GoogleTrend from './components/GoogleTrend/GoogleTrend.vue'
import router from './router'
import store from "@/store";

import './scss/app.scss';

Vue.use(Antd);

Vue.config.productionTip = false

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);

Vue.component('google-trend',GoogleTrend);


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')