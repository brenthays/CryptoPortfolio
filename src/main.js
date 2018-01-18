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
import firebase from 'firebase'
import router from './router'

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

let app
let config = {
  apiKey: 'AIzaSyDBk06u1SJ8WcRkH0WFh0FoECniW3vlurs',
  databaseURL: 'https://cryptoportfolio-f24dc.firebaseio.com',
  authDomain: 'cryptoportfolio-f24dc.firebaseapp.com',
  messagingSenderId: '122171976357'
}
firebase.initializeApp(config)
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      el: '#app',
      template: '<App/>',
      components: { App }
    })
  }
  console.log('authstatechanged', user)
  if (user) {
    console.log('loggedin', user)
    // this.authUser = user
  }
})

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })
