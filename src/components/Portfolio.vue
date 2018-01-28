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
              <input type="number" step="0.0000000001" class="form-control" v-model="newCoin.quantity"/>
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
              <input type="number" step="0.0000000001" class="form-control" v-model="updateCoin.quantity"/>
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

        <div class="jumbotron text-center" v-if="totalPortfolioWorthUSD">
          <h3>Total Portfolio Value</h3>
          <h2>{{ totalPortfolioWorthUSD | currency }}</h2>
        </div>

        <div class="toolbar" v-show="portfolioData.length > 0">
          <div class="input-group better-input-group sort-select pull-left" v-show="portfolioData.length > 1">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fa fa-sort"></i></span>
            </div>
            <select class="form-control" v-model="sortSelected" v-on:change="sortPortfolioData">
              <option v-for="option in sortOptions" v-bind:value="option">{{ option.text }}</option>
            </select>
          </div>

          <button v-b-modal.add-coin-modal title="Add New Coin to Portfolio" class="btn btn-primary pull-right">
            <i class="fa fa-plus"></i> Add New Coin
          </button>
          <button class="btn btn-secondary pull-right" v-show="options.showRefresh" title="Refresh Data" v-on:click="refreshData">
            <i class="fa fa-refresh" v-bind:class="{'fa-spin': tableRefresh}"></i> Refresh
          </button>
          <div class="clearfix"></div>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover text-left">
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
              <tr v-for="coin in portfolioData" v-on:click="setUpdateCoin(coin)" class="pointer" v-b-modal.update-coin-modal>
                <td><strong>{{ coin.symbol }}</strong> - {{ coin.name }}</td>
                <td class="text-right">{{ coin.price_usd | currency }}</td>
                <td class="text-right">
                  {{ coin.quantity }}
                </td>
                <td class="text-right">{{ coin.value_usd | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { ModelSelect } from 'vue-search-select'
  import firebase from 'firebase'

  let db = firebase.database()
  let coinsRef = db.ref('coins')
  let portfolioRef = db.ref('portfolios')
  let optionsRef = db.ref('options')

  let sortOptions = [{
    text: 'Coin Name',
    attr: 'name',
    dir: 'asc'
  }, {
    text: 'Coin Rank',
    attr: 'rank',
    dir: 'asc'
  }, {
    text: 'Coin Price',
    attr: 'price_usd',
    dir: 'desc'
  }, {
    text: 'Portfolio Quantity',
    attr: 'quantity',
    dir: 'desc'
  }, {
    text: 'Portfolio Value',
    attr: 'value_usd',
    dir: 'desc'
  }]

  export default {
    name: 'Portfolio',

    firebase: {
      coins: coinsRef,
      options: {
        source: optionsRef,
        asObject: true
      }
    },

    data () {
      return {
        newCoin: {
          id: '',
          quantity: ''
        },
        updateCoin: {
          id: '',
          quantity: ''
        },
        authUser: null,
        portfolioReceived: false,
        coinDataReceived: false,
        selectedCoin: null,
        portfolioData: [],
        totalPortfolioWorthUSD: 0,
        totalPortfolioWorthBTC: 0,
        loading: true,
        tableRefresh: false,
        sortOptions: sortOptions,
        sortSelected: sortOptions[0]
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
        if (this.newCoin.quantity === '') {
          this.$toastr.e('Enter a quantity!')
          return
        }
        var q = parseFloat(this.newCoin.quantity)
        if (isNaN(q)) {
          this.$toastr.e('Enter a real quantity!')
          return
        }
        this.newCoin.id = this.selectedCoin
        this.newCoin.quantity = q

        // push to firebase
        var app = this
        portfolioRef.once('value', function (snapshot) {
          portfolioRef.push(app.newCoin).then(resp => {
            app.$toastr.s('Coin Saved')
            app.closeModal()
          })
        })
      },
      clearNewCoin: function () {
        this.newCoin = {id: '', quantity: ''}
        this.selectedCoin = null
      },
      setUpdateCoin: function (coin) {
        this.updateCoin = {
          id: coin.id,
          name: coin.name,
          quantity: coin.quantity,
          key: coin.key
        }
      },
      saveCoin: function (coin) {
        portfolioRef.child(coin.key).update(coin)
        this.$toastr.s('Coin Saved')
        this.closeModal()
      },
      removeCoin: function (coin) {
        portfolioRef.child(coin.key).remove()
        this.$toastr.s('Coin Removed')
        this.closeModal()
      },
      calculatePortfolioData: function () {
        let portfolio = this.portfolio
        let coins = this.coins
        let portfolioData = []
        let totalUSD = 0
        let totalBTC = 0

        portfolio.forEach(function (thisCoin) {
          coins.forEach(function (thisCoinData) {
            if (thisCoin.id === thisCoinData.id) {
              let thisPortfolioData = {
                key: thisCoin['.key'],
                id: thisCoinData.id,
                name: thisCoinData.name,
                price_usd: parseFloat(thisCoinData.price_usd),
                price_btc: parseFloat(thisCoinData.price_btc),
                symbol: thisCoinData.symbol,
                rank: parseInt(thisCoinData.rank),
                quantity: parseFloat(thisCoin.quantity),
                value_usd: thisCoin.quantity * thisCoinData.price_usd,
                value_btc: thisCoin.quantity * thisCoinData.price_btc
              }

              totalUSD += thisCoinData.price_usd ? thisCoin.quantity * thisCoinData.price_usd : 0
              totalBTC += thisCoinData.price_btc ? thisCoin.quantity * thisCoinData.price_btc : 0
              portfolioData.push(thisPortfolioData)
            }
          })
        })

        this.portfolioData = portfolioData
        this.totalPortfolioWorthUSD = totalUSD
        this.totalPortfolioWorthBTC = totalBTC
        this.sortPortfolioData()

        if (this.coinDataReceived && this.portfolioReceived) {
          this.loading = false
        }
      },
      closeModal: function () {
        this.clearNewCoin()
        this.$refs.modal.hide()
        this.$refs.modal2.hide()
      },
      sortPortfolioData: function () {
        let app = this
        this.portfolioData.sort(function (a, b) {
          if (app.sortSelected.dir === 'desc') {
            return a[app.sortSelected.attr] < b[app.sortSelected.attr]
          } else {
            return a[app.sortSelected.attr] > b[app.sortSelected.attr]
          }
        })
      }
    },

    components: {
      ModelSelect
    },

    mounted () {

    },

    created () {
      firebase.auth().onAuthStateChanged((user) => {
        this.authUser = user
        if (user) {
          portfolioRef = db.ref('portfolios').child(this.authUser.uid)
          this.$bindAsArray('portfolio', portfolioRef)
          coinsRef.on('value', resp => {
            this.coinDataReceived = true
            this.calculatePortfolioData()
          })
          portfolioRef.on('value', resp => {
            this.portfolioReceived = true
            this.calculatePortfolioData()
          })
        } else {
          window.location = '/'
        }
      })
    }

  }
</script>
