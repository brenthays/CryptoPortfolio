<template>
  <div class="row main-row">
    <div class="col-12">
      <div class="jumbotron text-center">
        <div>
          <h2>Track Your Cryptocurrency in Real Time</h2>
          <div class="row highlight">
            <div class="col-xs-12 col-md-2">

            </div>
            <div class="col-xs-12 col-md-4 item">
              <img src="../assets/images/coins.svg"/>
              <h5>Track All Your Coins in<br/>One Place</h5>
            </div>
            <div class="col-xs-12 col-md-4 item">
              <img src="../assets/images/realtime.svg"/>
              <h5>View Your Portfolio Value<br/>in Real Time</h5>
            </div>
            <div class="col-xs-12 col-md-2">

            </div>
          </div>
          <a href="/login" title="Sign Up for Free" class="btn btn-primary" v-show="!loading && !authUser">Sign Up For Free <i class="fa fa-caret-right"></i></a>
          <a href="/portfolio" title="Go To Your Portfolio" v-show="!loading && authUser" class="btn btn-primary">Go To Your Portfolio <i class="fa fa-caret-right"></i></a>
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
