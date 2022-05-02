const webpack = require('webpack')
const config = require('../webpack.config.js')

if (process.argv.length < 3) {
  console.error('parameter error.')
  process.exit(255)
}

const mode = process.argv[2]

if (!mode || (mode != 'development' && mode != 'production') ) {
  console.error('parameter error.')
  process.exit(255)
}

webpack(config(null, { mode: 'development' }), (err, stats) => {
  console.log(stats.toString({ colors: true }))
  if (stats.hasErrors()) {
    process.exit(255)
  }
  if (err) {
    console.log(err)
    process.exit(255)
  }
  process.exit(0)
})
