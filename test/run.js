const print = require('../index.js');

// print.borderBox([
//   '0123456789',
//   '0123456789',
//   '0123456789',
//   '0123456789',
//   '0123456789',
//   '0123456789',
//   '0123456789',
//   '0123456789'
// ].join('')).then((r) => {
//   console.log(r.join('\n'));
// });

let padding = 0;
let inKey = setInterval(() => {
  padding++;
  if (padding < 10) {
    print.log.info(123, undefined, 'hehe', padding);
  } else {
    clearInterval(inKey);
    print.log.success('run finished');
  }
}, 1000);
