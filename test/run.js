const print = require('../')
const chalk = require('chalk')

console.log('print', print)

console.log([chalk.bold.red('hhhh')])
console.log(print.fn.substr(chalk.bold.red('hhhh'), 0, 2))

print.log.info(
  [
    1234567890,
    1234567890,
    1234567890,
    1234567890,
    1234567890,
    1234567890,
    1234567890,
    chalk.red.bold(1234567890)
  ].join('')
)
// print.log.info('777');
// print.log.warn('111');
// print.log.warn('222');
// print.log.warn('333');
// print.log.warn('444');
// print.log.success('888');
// print.log.success('999');
