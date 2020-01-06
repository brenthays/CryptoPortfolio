<template>

  <nav class="navbar navbar-expand-md navbar-dark bg-primary">
    <a class="navbar-brand" href="/">
      <i class="fa fa-bitcoin mr-1"></i>
      <i class="fa fa-arrow-right mr-1"></i>
      <i class="fa fa-usd"></i>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown" v-if="authUser !== null">
          <a href="#" class="nav-link dropdown-toggle" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ authUser.displayName }}</a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">
            <a class="dropdown-item" href="#" v-on:click="signOut">Sign Out</a>
          </div>
        </li>
        <li class="nav-item" v-if="authUser === null">
          <a class="nav-link" title="Sign Up" href="/login">Sign Up</a>
        </li>
        <li class="nav-item" v-if="authUser === null">
          <a class="nav-link" title="Login" href="/login">Login</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'TopNav',

    data () {
      return {
        authUser: null
      }
    },

    methods: {
      signOut: function () {
        firebase.auth().signOut()
      }
    },

    created () {
      firebase.auth().onAuthStateChanged((user) => {
        this.authUser = user
      })
    }
  }

</script>
