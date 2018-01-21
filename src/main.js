// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'
import VueResource from 'vue-resource'
import VueLocalStorage from 'vue-ls'
import VueCurrencyFilter from 'vue-currency-filter'
import Toastr from 'vue-toastr'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'

Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(VueLocalStorage,
  {
    namespace: 'vuejs_'
  })
Vue.use(VueCurrencyFilter,
  {
    symbol: '$',
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.',
    symbolPosition: 'front',
    symbolSpacing: false
  })
Vue.use(Toastr)
Vue.use(BootstrapVue)
Vue.use(VueLodash, lodash)

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
