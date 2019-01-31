const print = require('../index.js');
// const chalk = require('chalk');

print.log.init({
  maxSize: 8,
  type: {
    concat: {name: 'Concat', color: 'cyan', bgColor: 'bgBlue'}
  }
});

print.log.setLogLevel(1);

print.log.warn('aaa');
print.log.info('111');
print.log.warn('bbb');
print.log.info('222');
print.log.info('333');
print.log.success('1');

print.log.success('2');
print.log.success('3');
