const print = require('../index.js');
const chalk = require('chalk');
print.log.init({
  logLevel: 1,
  mode1: {
    abridgeIgnores: ['success', 'warn']
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
print.log.warn('111');
print.log.warn('222');
print.log.warn('333');
print.log.warn('444');
print.log.success('888');
print.log.success('999');
