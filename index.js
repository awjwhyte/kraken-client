const Kraken = require('./kraken')


const client = new Kraken()

// client.public('ticker', {pair:'xbtusd'})
// client.public('Ticker', {pair:'xxbtzusd'})
// client.private('Balance')
client.private('TradeBalance')
// console.log('messageSignature: ',client.messageSignature('Balance'))
// console.log('\ngetMessageSignature',client.getMessageSignature('Balance'))
// console.log(process.env.API_SECRET)

