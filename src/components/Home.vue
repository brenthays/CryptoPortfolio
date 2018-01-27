<template>
  <div class="row main-row">
    <div class="col-12">
      <div class="auth-box text-center">
        <div>
          <h2>Track Your Cryptocurrency in Real Time</h2>
          <!-- <div class="row highlight">
            <div class="col-xs-12 col-md-2">

            </div>
            <div class="col-xs-12 col-md-4 item">
              <img src="../assets/images/coins.svg"/>
              <h3>Track All Your Coins in One Place</h3>
            </div>
            <div class="col-xs-12 col-md-4 item">
              <img src="../assets/images/realtime.svg"/>
              <h3>See Your Portfolio Value in Real Time</h3>
            </div>
            <div class="col-xs-12 col-md-4">

            </div>
          </div> -->
          <a href="/login" title="Sign Up for Free" class="btn btn-primary" v-show="!loading && !authUser">Sign Up For Free</a>
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
