<template>
  <nav class="navbar navbar-toggleable-md navbar-inverse bg-inverse">
    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="/">Simple Crypto Portfolio</a>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" v-if="authUser !== null">
          <a class="nav-link" title="Sign Out" href="#" v-on:click="signOut">Sign Out</a>
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
