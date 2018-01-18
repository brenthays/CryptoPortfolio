import Vue from 'vue'
import Router from 'vue-router'

// components
import Portfolio from '../components/Portfolio'
import Login from '../components/Login'

Vue.use(Router)

// set up routes
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: Portfolio
    }
  ]
})
