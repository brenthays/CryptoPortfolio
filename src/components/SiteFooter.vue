<template>
  <div class="footer">
    <b-modal
    id="donate-modal"
    title="Donate"
    ref="modalDonate">
      <p>Bitcoin Address: 1LNpgPX36WGpBQGnStQyfXLstdHVPvyd2K</p>
      <p>Ethereum: 0x0cf9541156Be3029224BC058e77D24F4B52349fE</p>
      <p>Litecoin: Li2HWmbxzBE8EhfLALsbSnKVaejYvDyzdY</p>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-right" variant="secondary" v-on:click="closeModal">
          Close
        </b-btn>
      </div>
    </b-modal>
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
      <div class="row footer-row">
        <div class="col-12">
          <hr/>
        </div>
        <div class="col-12">
          <a href="#" v-b-modal.donate-modal>Donate</a>
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
      },
      closeModal: function () {
        this.$refs.modalDonate.hide()
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
