const print = require('../index.js');
// const extFs = require('yyl-fs');
// const fs = require('fs');
// const path = require('path');
const chalk = require('chalk');

print.log.setLogLevel(1);

print.log.success('hello world');

let padding = 1;
setInterval(() => {
  print.log.success([
    '1234567890',
    '1234567890',
    '1234567890',
    '1234567890',
    '1234567890',
    '1234567890',
    '1234567890',
    chalk.red('1234567890'),
    padding++
  ].join(''));
  if (padding % 20 === 0) {
    print.log.info('match 20');
  }
}, 100);
