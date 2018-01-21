<template>
  <div id="app">
    <top-nav></top-nav>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import TopNav from './components/TopNav'

  // let app
  let config = {
    apiKey: 'AIzaSyDBk06u1SJ8WcRkH0WFh0FoECniW3vlurs',
    databaseURL: 'https://cryptoportfolio-f24dc.firebaseio.com',
    authDomain: 'cryptoportfolio-f24dc.firebaseapp.com',
    messagingSenderId: '122171976357'
  }
  firebase.initializeApp(config)

  export default {
    name: 'app',

    components: {
      TopNav
    }
  }
</script>
<style>
  @import './assets/styles/toastr.css';
  @import './assets/styles/main.css';

</style>
