const axios = require('axios')
const crypto = require('crypto')
require('dotenv').config()

const serialize = (obj)=> {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const publicMethods = ['Time', 'Assets', 'AssetPairs', 'Ticker', 'OHLC', 'Depth', 'Trades', 'Spread']
const privateMethods = ['Balance', 'TradeBalance', '']
class Kraken {
  constructor() {
    this.API_KEY = process.env.API_KEY
    this.API_SECRET = process.env.API_SECRET
    this.URL = process.env.URL
    this.nonce = new Date().getTime() * 1000
  }

  messageSignature (endpoint, postData=undefined) {
    let path = `${this.URL}private/${endpoint}`
    let data = postData === undefined ?  `${this.nonce}` : `${this.nonce}${serialize(postData)}`
    let first = crypto.createHash('sha256').update(data).digest()
    let base64decode = Buffer.from(this.API_SECRET, 'base64')
    let second = crypto.createHmac('sha512', base64decode).update(first).digest()
    return second 
  }
 

  async public (endpoint, params = undefined) {
    if (publicMethods.includes(endpoint)) {
      let url =  `${this.URL}public/${endpoint}?${serialize(params)}`
        try {
          let response = await axios.get(url)
          console.log(response.data)
        } catch (e) {
          console.log(e)
        }
    } else {
      console.log(`\n${endpoint} is not a valid public method`)
    }
  }

  async private (endpoint, params = undefined) {

  }
 
}

module.exports = Kraken
