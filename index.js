const Kraken = require('./kraken')

const client = new Kraken()

// client.public('ticker', {pair:'xbtusd'})
client.public('Ticker', {pair:'xxbtzusd'})
