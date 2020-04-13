const cleanScreen = function () {
  process.stdout.write('\x1Bc')
}

module.exports = cleanScreen
