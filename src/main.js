import Vue from 'vue'
import App from './App.vue'
import wcrouter from './wcrouter'

Vue.config.productionTip = false

new Vue({
  wcrouter,
  render: h => h(App)
}).$mount('#app')
