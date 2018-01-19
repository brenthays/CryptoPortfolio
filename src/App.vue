<!-- App.vue
  This component is the root component for our Vue application. It is rendered
  in the project root's index.html file with the <div id="app"> tag. The firebase
  instance exists only within this component.
-->

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import firebase from 'firebase'

  // let app
  let config = {
    apiKey: 'AIzaSyDBk06u1SJ8WcRkH0WFh0FoECniW3vlurs',
    databaseURL: 'https://cryptoportfolio-f24dc.firebaseio.com',
    authDomain: 'cryptoportfolio-f24dc.firebaseapp.com',
    messagingSenderId: '122171976357'
  }
  firebase.initializeApp(config)
  firebase.auth().onAuthStateChanged((user) => {
    console.log('authstatechanged', user)
    if (user) {
      console.log('loggedin', user)
      // this.authUser = user
    }
  })

  export default {
    name: 'app'
  }
</script>
<style>
  @import './assets/styles/toastr.css';
  @import './assets/styles/main.css';

</style>
