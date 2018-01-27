<template>
  <div class="row main-row">
    <div class="col-12">
      <div class="loader" v-show="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="auth-box text-center" v-show="!loading">
        <h2>Login or Sign Up for Free</h2>
        <div id="firebaseui-auth-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firebaseui from 'firebaseui'

  export default {
    name: 'Login',

    data () {
      return {
        loading: true
      }
    },

    mounted () {
      var uiConfig = {
        signInSuccessUrl: '/portfolio',
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        tosUrl: '/',
        callbacks: {
          signInSuccess: function (currentUser, credential, redirectUrl) {
            console.log('signInSuccess')
            return true
          },
          uiShown: function () {
            console.log('uiShown')
          }
        }
      }
      var ui = new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    },

    created () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          window.location = '/portfolio'
        } else {
          this.loading = false
        }
      })
    }
  }

</script>
