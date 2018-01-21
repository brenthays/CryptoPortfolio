<template>
  <div class="row main-row">
    <div class="col-12">
      <div class="auth-box text-center">
        <div v-if="!loading && !authUser">
          <h2>Start Tracking Your Crypto Portfolio</h2>
          <a href="/login" title="Login" class="btn btn-primary">Login or Register For Free</a>
        </div>
        <div v-if="!loading && authUser">
          <h2>Welcome Back, {{ authUser.displayName }}</h2>
          <a href="/portfolio" title="Go To Your Portfolio" v-show="!loading && authUser" class="btn btn-primary">Go To Your Portfolio</a>
        </div>
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
