const print = require('../index.js');

print.borderBox([
  '0123456789',
  '0123456789',
  '0123456789',
  '0123456789',
  '0123456789',
  '0123456789',
  '0123456789',
  '0123456789'
].join('')).then((r) => {
  console.log(r.join('\n'));
});
