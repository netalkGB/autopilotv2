const webpack = require('webpack')
const config = require('../webpack.config.js')

const mode = 'development'

const bundler = webpack(config(null, { mode }))

bundler.watch({
  aggregateTimeout: 300,
  poll: 150
}, (_err, stats) => {
  console.log(stats.toString({ colors: true }))
})
