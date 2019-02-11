const print = require('../index.js');
const chalk = require('chalk');
print.log.init({
  logLevel: 1,
  mode1: {
    ignoreTypes: []
  }
});
print.log.info([
  1234567890,
  1234567890,
  1234567890,
  1234567890,
  1234567890,
  1234567890,
  1234567890,
  chalk.red(1234567890)
].join(''));
print.log.info('777');
print.log.success('888');
