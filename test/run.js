const print = require('../index.js');
// const chalk = require('chalk');

print.log.init({
  maxSize: 8,
  type: {
    concat: {name: 'Concat', color: 'cyan', bgColor: 'bgBlue'}
  }
});
