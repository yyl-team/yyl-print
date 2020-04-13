const borderBox = require('./lib/borderBox')
const buildTree = require('./lib/buildTree')
const cleanScreen = require('./lib/cleanScreen')
const fn = require('./lib/fn')
const help = require('./lib/help')
const log = require('./lib/log')

const print = {
  borderBox,
  buildTree,
  cleanScreen,
  help,
  log,
  fn
}

module.exports = print
