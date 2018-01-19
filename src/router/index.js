import Vue from 'vue'
import Router from 'vue-router'

// components
import Portfolio from '../components/Portfolio'
import Login from '../components/Login'
// import firebase from 'firebase'

Vue.use(Router)

// set up routes
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
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

// firebase.auth().onAuthStateChanged((user) => {
//   let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   let authPage = to.matched.some(record => record.meta.authPage)
//   if (requiresAuth && !user) router.push('/')
//   if (authPage && user) router.push('portfolio')
// })

export default router
