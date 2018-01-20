<template>
  <div class="row main-row">
    <div class="col-12">
      <div class="auth-box text-center">
        <h2>Start Tracking Your Crypto Portfolio</h2>
        <a href="/login" title="Login" v-show="!loading && !authUser" class="btn btn-primary">Login or Register For Free</a>
        <a href="/portfolio" title="Go To Your Portfolio" v-show="!loading && authUser" class="btn btn-primary">Go To Your Portfolio</a>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'Home',

    data () {
      return {
        loading: true,
        authUser: null
      }
    },

    created () {
      firebase.auth().onAuthStateChanged((user) => {
        this.authUser = user
        this.loading = false
      })
    }
  }

</script>
