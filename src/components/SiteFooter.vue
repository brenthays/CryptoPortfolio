<template>
  <div class="footer">
    <div class="container">
      <div class="row footer-row">
        <div class="col-12 text-center">
          <!-- responsive -->
          <ins class="adsbygoogle"
            style="display:block; width: 100%"
            data-ad-client="ca-pub-1317079355092968"
            data-ad-slot="6004053934"
            data-ad-format="auto"></ins>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'SiteFooter',

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
    },

    mounted () {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }

</script>
