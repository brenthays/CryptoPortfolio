const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// exports.refreshData = functions.https.onRequest((request, response) => {
//   $http.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
//     .then(response => response.json())
//     .then(json => {
//       var coinsRef = admin.database().ref('/coins')
//
//       for (var i = 0; i < json.length; i++) {
//         json[i].text = json[i].name
//         json[i].value = json[i].id
//       }
//       coinsRef.set(json).then(coinResponse => {
//         response.send('Coins updated!')
//       })
//     })
// })
