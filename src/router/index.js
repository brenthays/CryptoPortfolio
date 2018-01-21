import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Portfolio from '../components/Portfolio'
import Login from '../components/Login'

Vue.use(Router)

// set up routes
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        authPage: true
      }
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: Portfolio,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

export default router
