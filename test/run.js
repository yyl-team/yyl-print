const { progress } = require('../')
progress.start('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

setTimeout(() => {
  progress.error('ok')
}, 2000)
