<template>
  <div class="footer">
    <b-modal
    id="contact-modal"
    title="Contact Us"
    ref="modalContact">
      <p>Have questions or feedback? Submit the form below.</p>
      <hr/>
      <form @submit.stop.prevent="submitFeedback" class="contact-form">
        <label for="contactContact">Your Contact Info</label>
        <input type="text" v-model="contact.contact" id="contactContact" class="form-control" placeholder="Name/Email"/>
        <label for="contactMessage">Message</label>
        <textarea v-model="contact.message" id="contactMessage" class="form-control"></textarea>
      </form>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-right" variant="primary" v-on:click="submitFeedback">
          Submit
        </b-btn>
        <b-btn class="float-right" variant="secondary" v-on:click="closeModal">
          Close
        </b-btn>
      </div>
    </b-modal>
    <b-modal
    id="donate-modal"
    title="Donate"
    ref="modalDonate">
      <p><strong>Bitcoin:</strong> 1LNpgPX36WGpBQGnStQyfXLstdHVPvyd2K</p>
      <p><strong>Ethereum:</strong> 0x0cf9541156Be3029224BC058e77D24F4B52349fE</p>
      <p><strong>Litecoin:</strong> Li2HWmbxzBE8EhfLALsbSnKVaejYvDyzdY</p>
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
          &nbsp;|&nbsp;
          <a href="#" v-b-modal.contact-modal>Contact Us</a>
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
        authUser: null,
        contact: {
          message: '',
          contact: ''
        }
      }
    },

    methods: {
      submitFeedback: function () {
        if (!this.contact.message.length) {
          this.$toastr.e('Add a message')
          return
        }

        let feedbackRef = firebase.database().ref('feedback')

        let app = this
        feedbackRef.push(this.contact).then(resp => {
          app.$toastr.s('Thank your contacting us!')
          this.closeModal()
        })
      },
      signOut: function () {
        firebase.auth().signOut()
      },
      closeModal: function () {
        this.$refs.modalDonate.hide()
        this.$refs.modalContact.hide()
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
