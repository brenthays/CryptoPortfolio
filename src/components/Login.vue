<template>
  <div class="auth-box text-center">
    <h2>Start Tracking Your Crypto Portfolio</h2>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firebaseui from 'firebaseui'

  export default {
    name: 'Login',

    firebase: {

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
    }
    //
    // created () {
    //   // firebase.auth().onAuthStateChanged((user) => {
    //   //   console.log('authstatechanged', user)
    //   //   if (user) {
    //   //     console.log('loggedin', user)
    //   //     this.authUser = user
    //   //   }
    //   // })
    // }
  }

</script>
