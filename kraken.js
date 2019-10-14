const axios = require('axios')
const crypto = require('crypto')
require('dotenv').config()
const qs = require('qs')

const serialize = (obj)=> {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&")
}

const publicMethods = ['Time', 'Assets', 'AssetPairs', 'Ticker', 'OHLC', 'Depth', 'Trades', 'Spread']

const privateMethods = ['Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders', 'QueryOrders', 'TradesHistory', 
  'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers', 'TradeVolume', 
  'AddExport', 'ExportStatus', 'RetrieveReport', 'RemoveExport', 'AddOrder', 'CancelOrder']

class Kraken {
  constructor() {
    this.API_KEY = process.env.API_KEY
    this.API_SECRET = process.env.API_SECRET
    this.URL = process.env.URL
    this.nonce = new Date().getTime()* 10000
  }

  messageSignature (endpoint, postData = undefined) {
    const customPath = `/0/private/${endpoint}`
    const post =  postData === undefined ?  `${this.nonce}` : `${this.nonce}nonce=${this.nonce}&${serialize(postData)}`   
    const first = crypto.createHash('sha256').update(post).digest()
    const base64decode = Buffer.from(this.API_SECRET, 'base64')
    const second = crypto.createHmac('sha512', base64decode).update(`${customPath}${first}`).digest()
    const final = Buffer.from(second).toString('base64')
    return final  
  }

  async public (endpoint, params = undefined) {
    if (publicMethods.includes(endpoint)) {
      let url =  `${this.URL}/public/${endpoint}?${serialize(params)}`
        try {
          let response = await axios.get(url)
          console.log(response.data)
        } catch (e) {
          console.log(e)
        }
    } else {
      console.log(`\n${endpoint} is not a valid public endpoint`)
    }
  }

  async private (endpoint, params = undefined) {
    if (privateMethods.includes(endpoint)) {
      let url = params === undefined ? `${this.URL}/private/${endpoint}` : `${this.URL}/private/${endpoint}?${serialize(params)}`
      try {
        let response = await axios.post(url, {
          headers: {
            'User-Agent': 'kraken api axios- based Node JS client',
            'API-Key': this.API_KEY,
            'API-Sign': this.messageSignature(endpoint, params)
          }
        }, {
          timeout: 5000
        })
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log(`\n${endpoint} is not a valid private endpoint`)
    }
  }
 
}

module.exports = Kraken
