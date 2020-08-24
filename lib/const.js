/* eslint-disable no-control-regex */
let COLUMNS = process.stdout.columns || 80
process.stdout.on('resize', () => {
  COLUMNS = process.stdout.columns || 80
})
module.exports.COLUMNS = COLUMNS

module.exports.COLOR_REG = /(\u001b\[\d+m|\033\[[0-9;]+m)+/g
