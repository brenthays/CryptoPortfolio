<!-- App.vue
  This component is the root component for our Vue application. It is rendered
  in the project root's index.html file with the <div id="app"> tag. The Firebase
  instance exists only within this component.
-->

<template>
  <div id="app">
    <!-- do this in a modal -->
    <b-modal
      id="add-coin-modal"
      title="Add a Coin"
      @ok="handleOk"
      @shown="clearNewCoin"
      ref="modal">
      <form @submit.stop.prevent="handleOk">
        <div class="form-group">
          <label>Select a Coin</label>
          <model-select class="form-control"
            :options="coins"
            v-model="selectedCoin"
            placeholder="Search for your coin">
          </model-select>
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" step="0.0000000001" class="form-control" v-model="newCoin.holdings"/>
        </div>
      </form>
    </b-modal>

    <div class="toolbar text-right" v-show="portfolioData.length > 0">
      <button class="btn btn-secondary" title="Refresh Data" v-on:click="refreshData">
        <i class="fa fa-refresh" v-bind:class="{'fa-spin': loading}"></i> Refresh
      </button>
      <button v-b-modal.add-coin-modal title="Add New Coin to Portfolio" class="btn btn-primary">
        <i class="fa fa-plus"></i> Add New Coin
      </button>
    </div>
    <table class="table table-bordered table-striped text-left">
      <thead class="thead-default" v-show="portfolioData.length > 0">
        <tr>
          <th>Name</th>
          <th class="text-right">Price</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="portfolioData.length == 0" class="no-results">
          <td colspan="4" class="text-center">
            <h2>Start Tracking Your Crypto Portfolio</h2>
            <button class="btn btn-primary" v-b-modal.add-coin-modal>
              Add Your First Coin
            </button>
          </td>
        </tr>
        <tr v-for="coin in portfolioData">
          <td><strong>{{ coin.symbol }}</strong> - {{ coin.name }}</td>
          <td class="text-right">{{ coin.price_usd | currency }}</td>
          <td class="text-right">
            {{ coin.holdings }}
          </td>
          <td class="text-right">{{ coin.value_usd | currency }}</td>
        </tr>
        <tr v-show="portfolioData.length > 0">
          <td colspan="3" class="text-right"><strong>Total Value</strong></td>
          <td class="text-right"><strong>{{ totalPortfolioWorthUSD | currency }}</strong></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  import Hello from './components/Hello'
  import { ModelSelect } from 'vue-search-select'

  // This line is new!
  import Firebase from 'firebase'

  /*
   * The config was copied and pasted straight from the Firebase Dashboard.
   * Simply click "Add Firebase to Your Web App" to access yours.
   */

  let config = {
    apiKey: 'AIzaSyDBk06u1SJ8WcRkH0WFh0FoECniW3vlurs',
    databaseURL: 'https://cryptoportfolio-f24dc.firebaseio.com/'
  }

  // Here we are initializing the Firebase connection.
  let app = Firebase.initializeApp(config)
  let db = app.database()

  // Accessing the greetings reference; .ref() takes a URL as its parameter.
  let coinsRef = db.ref('coins')

  export default {
    name: 'app',

    /*
     * This section is added to the original CLI-generated App component. This
     * is where VueFire comes into play, allowing us to link our Vue app to
     * Firebase data relatively simply. More information is on the GitHub page:
     *
     * https://github.com/vuejs/vuefire/
     */

    firebase: {
      coins: coinsRef
    },

    data () {
      return {
        newCoin: {
          id: '',
          holdings: ''
        },
        selectedCoin: null,
        portfolioData: [],
        totalPortfolioWorthUSD: 0,
        totalPortfolioWorthBTC: 0,
        loading: false,
        showAddNewCoin: false
      }
    },

    methods: {
      loadingComplete: function () {
        this.loading = false
      },
      // refresh data pulls coin market data and pushes it to our db
      refreshData: function (resource) {
        this.loading = true
        this.$http.get('https://api.coinmarketcap.com/v1/ticker/')
          .then(response => response.json())
          .then(json => {
            for (var i = 0; i < json.length; i++) {
              json[i].text = json[i].name
              json[i].value = json[i].id
            }
            coinsRef.set(json).then(response => {
              setTimeout(this.loadingComplete, 500)
            })
          })
      },
      // adds coin to portfolio
      addCoinToPortfolio: function () {
        if (!this.selectedCoin) {
          this.$toastr.e('Select a coin!')
          return
        }

        if (this.newCoin.holdings === '') {
          this.$toastr.e('Enter a quantity!')
          return
        }

        var q = parseFloat(this.newCoin.holdings)
        if (isNaN(q)) {
          this.$toastr.e('Enter a real quantity!')
          return
        }

        this.newCoin.id = this.selectedCoin
        this.newCoin.quantity = q

        let portfolio = this.$ls.get('portfolio') ? this.$ls.get('portfolio') : []
        let coinFound = false
        for (var i = 0; i < portfolio.length; i++) {
          if (portfolio[i].id === this.newCoin.id) {
            portfolio[i] = this.newCoin
            coinFound = true
            break
          }
        }

        if (!coinFound) portfolio.push(this.newCoin)
        this.$ls.set('portfolio', portfolio)

        this.$toastr.s('Coin Added')
        this.$refs.modal.hide()
        this.clearNewCoin()

        this.calculatePortfolioData()
      },
      handleOk: function (evt) {
        // Prevent modal from closing
        evt.preventDefault()
        this.addCoinToPortfolio()
      },
      clearNewCoin: function () {
        this.newCoin = {id: '', holdings: ''}
        this.selectedCoin = null
      },
      // calculates table data for portfolio-form
      calculatePortfolioData: function () {
        let portfolio = this.$ls.get('portfolio') ? this.$ls.get('portfolio') : []
        let portfolioData = []
        let totalUSD = 0
        let totalBTC = 0

        for (var i = 0; i < portfolio.length; i++) {
          let thisCoin = portfolio[i]
          for (var j = 0; j < this.coins.length; j++) {
            if (thisCoin.id === this.coins[j].id) {
              let thisCoinData = this.coins[j]
              let thisPortfolioData = {
                id: thisCoinData.id,
                name: thisCoinData.name,
                price_usd: thisCoinData.price_usd,
                price_btc: thisCoinData.price_btc,
                symbol: thisCoinData.symbol,
                rank: thisCoinData.rank,
                holdings: thisCoin.holdings,
                value_usd: thisCoin.holdings * thisCoinData.price_usd,
                value_btc: thisCoin.holdings * thisCoinData.price_btc
              }

              totalUSD += thisCoin.holdings * thisCoinData.price_usd
              totalBTC += thisCoin.holdings * thisCoinData.price_btc
              portfolioData.push(thisPortfolioData)
              break
            }
          }

          this.portfolioData = portfolioData
          this.totalPortfolioWorthUSD = totalUSD
          this.totalPortfolioWorthBTC = totalBTC
        }
      }
    },

    components: {
      Hello,
      ModelSelect
    },

    mounted () {
      console.log('inside sdfasdfasdf')
      this.refreshData()
      coinsRef.on('value', resp => {
        this.calculatePortfolioData()
      })
    }
  }
</script>
<style>
  @import './assets/styles/toastr.css';
  @import './assets/styles/main.css';

</style>
