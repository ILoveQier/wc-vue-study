import Vue from 'vue'
import App from './App.vue'
import wcrouter from './wcrouter'
import wcstore from './wcstore'

Vue.config.productionTip = false

new Vue({
  wcrouter,
  wcstore,
  render: h => h(App)
}).$mount('#app')
