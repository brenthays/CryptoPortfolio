<template>
  <div class="row main-row">
    <div class="col-12">
      <div class="loader" v-show="loading">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div v-show="!loading">
        <b-modal
        id="add-coin-modal"
        title="Add a Coin"
        @shown="clearNewCoin"
        ref="modal">
          <form @submit.stop.prevent="addCoinToPortfolio">
            <div class="form-group">
              <label>Select a Coin</label>
              <model-select class="form-control"
              :options="coins"
              v-model="selectedCoin"
              placeholder="Search for the coin to add">
            </model-select>
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input type="number" step="0.0000000001" class="form-control" v-model="newCoin.holdings"/>
          </div>
          <button type="submit" name="button" style="display: none;"></button>
        </form>
        <div slot="modal-footer" class="w-100">
          <b-btn class="float-right" variant="primary" v-on:click="addCoinToPortfolio">
            Save
          </b-btn>
          <b-btn class="float-right" variant="secondary" v-on:click="closeModal">
            Cancel
          </b-btn>
        </div>
      </b-modal>

      <!-- update a coin modal -->
      <b-modal
      id="update-coin-modal"
      title="Update Coin"
      ref="modal2">
        <form @submit.stop.prevent="saveCoin(updateCoin)">
          <div class="form-group">
            <label>{{ updateCoin.name }} Quantity</label>
            <input type="number" step="0.0000000001" class="form-control" v-model="updateCoin.holdings"/>
          </div>
        </form>
        <div slot="modal-footer" class="w-100">
          <b-btn class="float-right" variant="primary" v-on:click="saveCoin(updateCoin)">
            Save
          </b-btn>
          <b-btn class="float-right" variant="danger" v-on:click="removeCoin(updateCoin)">
            Remove Coin
          </b-btn>
          <b-btn class="float-right" variant="secondary" v-on:click="closeModal">
            Cancel
          </b-btn>
        </div>
      </b-modal>

      <div class="toolbar text-right" v-show="portfolioData.length > 0">
        <button class="btn btn-secondary" title="Refresh Data" v-on:click="refreshData">
          <i class="fa fa-refresh" v-bind:class="{'fa-spin': tableRefresh}"></i> Refresh
        </button>
        <button v-b-modal.add-coin-modal title="Add New Coin to Portfolio" class="btn btn-primary">
          <i class="fa fa-plus"></i> Add New Coin
        </button>
      </div>
      <table class="table table-bordered table-striped table-hover text-left">
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
          <tr v-for="coin in portfolioData" v-on:click="setUpdateCoin(coin)" v-b-modal.update-coin-modal>
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

    </div>
  </div>
</template>

<script>
  import { ModelSelect } from 'vue-search-select'
  import firebase from 'firebase'

  /*
   * firebase config
   */

  let db = firebase.database()
  let coinsRef = db.ref('coins')

  export default {
    name: 'Portfolio',

    firebase: {
      coins: coinsRef
    },

    data () {
      return {
        newCoin: {
          id: '',
          holdings: ''
        },
        updateCoin: {
          id: '',
          holdings: ''
        },
        selectedCoin: null,
        portfolioData: [],
        totalPortfolioWorthUSD: 0,
        totalPortfolioWorthBTC: 0,
        loading: true,
        tableRefresh: false
      }
    },

    methods: {
      tableRefreshComplete: function () {
        this.tableRefresh = false
        this.loading = false
      },
      refreshData: function (resource) {
        this.tableRefresh = true
        this.$http.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
          .then(response => response.json())
          .then(json => {
            for (var i = 0; i < json.length; i++) {
              json[i].text = json[i].name
              json[i].value = json[i].id
            }
            coinsRef.set(json).then(response => {
              setTimeout(this.tableRefreshComplete, 500)
            })
          })
      },
      addCoinToPortfolio: function () {
        // validate
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

        // if the coin already exists, update it's value
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

        this.$toastr.s('Coin Saved')
        this.closeModal()
        this.calculatePortfolioData()
      },
      clearNewCoin: function () {
        this.newCoin = {id: '', holdings: ''}
        this.selectedCoin = null
      },
      setUpdateCoin: function (coin) {
        this.updateCoin = {
          id: coin.id,
          name: coin.name,
          holdings: coin.holdings
        }
      },
      saveCoin: function (coin) {
        this.newCoin = coin
        this.selectedCoin = coin.id
        this.addCoinToPortfolio()
      },
      removeCoin: function (coin) {
        let portfolio = this.$ls.get('portfolio') ? this.$ls.get('portfolio') : []
        let idx = null
        for (var i = 0; i < portfolio.length; i++) {
          if (portfolio[i].id === coin.id) {
            idx = i
            break
          }
        }
        if (idx !== null) {
          portfolio.splice(idx, 1)
          this.$ls.set('portfolio', portfolio)
          this.$toastr.s('Coin Removed')
          this.calculatePortfolioData()
          this.closeModal()
        }
      },
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
        }
        this.portfolioData = portfolioData
        this.totalPortfolioWorthUSD = totalUSD
        this.totalPortfolioWorthBTC = totalBTC
        this.loading = false
      },
      closeModal: function () {
        this.clearNewCoin()
        this.$refs.modal.hide()
        this.$refs.modal2.hide()
      }
    },

    components: {
      ModelSelect
    },

    mounted () {

    },

    created () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.refreshData()
          coinsRef.on('value', resp => {
            this.calculatePortfolioData()
          })
        } else {
          window.location = '/'
        }
      })
    }

  }
</script>
