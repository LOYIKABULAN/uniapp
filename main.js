import App from './App'
import uView from 'uview-ui'
import store from 'store/index.js'
import dayjs from 'dayjs'
import login from "@/components/login/login.vue"
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.use(uView)
Vue.prototype.dayjs = dayjs;
Vue.component('login',login)
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
require('./config/request.js')(app)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif