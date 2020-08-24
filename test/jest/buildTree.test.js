const print = require('../../')
if (process.stdout.columns !== 80) {
  throw new Error('请将 cmd 窗口设置为 80 宽度再进行测试')
}

const path = require('path')
const extFs = require('yyl-fs')
const fs = require('fs')

const FRAG_PATH = path.join(__dirname, './__frag')
const fn = {
  frag: {
    async build() {
      if (fs.existsSync(FRAG_PATH)) {
        await extFs.removeFiles(FRAG_PATH)
      } else {
        await extFs.mkdirSync(FRAG_PATH)
      }
    },
    async destory() {
      if (fs.existsSync(FRAG_PATH)) {
        await extFs.removeFiles(FRAG_PATH, true)
      }
    }
  },
  async buildFile(iPath) {
    const dirname = path.dirname(iPath)
    if (!fs.existsSync(dirname)) {
      await extFs.mkdirSync(dirname)
    }
    fs.writeFileSync(iPath, '')
  }
}

test('print.buildTree({frontPath, path})', async () => {
  await fn.frag.build()

  await fn.buildFile(path.join(FRAG_PATH, 'js/index.js'))
  await fn.buildFile(path.join(FRAG_PATH, 'css/index.css'))
  await fn.buildFile(path.join(FRAG_PATH, 'html/index.html'))
  await fn.buildFile(path.join(FRAG_PATH, '.eslintrc'))
  await fn.buildFile(path.join(FRAG_PATH, 'yyl.config.js'))
  await fn.buildFile(path.join(FRAG_PATH, '.sass-cache/cache.js'))

  const checkMap = [
    {
      op: {
        silent: true,
        frontPath: '__frag',
        path: FRAG_PATH
      },
      result: [
        '',
        '  __frag',
        '  |~ css',
        '  |  `- index.css',
        '  |~ html',
        '  |  `- index.html',
        '  |~ js',
        '  |  `- index.js',
        '  |- yyl.config.js',
        '  |- .eslintrc',
        '  `~ .sass-cache',
        '     `- cache.js',
        ''
      ]
    },
    {
      op: {
        silent: true,
        frontPath: '__frag',
        path: FRAG_PATH,
        dirNoDeep: ['css']
      },
      result: [
        '',
        '  __frag',
        '  |+ css',
        '  |~ html',
        '  |  `- index.html',
        '  |~ js',
        '  |  `- index.js',
        '  |- yyl.config.js',
        '  |- .eslintrc',
        '  `~ .sass-cache',
        '     `- cache.js',
        ''
      ]
    },
    {
      op: {
        silent: true,
        frontPath: '__frag',
        path: FRAG_PATH,
        dirFilter: /\.sass-cache/
      },
      result: [
        '',
        '  __frag',
        '  |~ css',
        '  |  `- index.css',
        '  |~ html',
        '  |  `- index.html',
        '  |~ js',
        '  |  `- index.js',
        '  |- yyl.config.js',
        '  `- .eslintrc',
        ''
      ]
    },
    {
      op: {
        silent: true,
        path: 'yyl-print',
        dirList: [
          'yyl-print/images/1.png',
          'yyl-print/js/1.js',
          'yyl-print/js/lib/lib.js',
          'yyl-print/css/1.css',
          'yyl-print/html/1.html'
        ]
      },
      result: [
        '',
        '  yyl-print',
        '  |~ css',
        '  |  `- 1.css',
        '  |~ html',
        '  |  `- 1.html',
        '  |~ images',
        '  |  `- 1.png',
        '  `~ js',
        '     |~ lib',
        '     |  `- lib.js',
        '     `- 1.js',
        ''
      ]
    }
  ]

  checkMap.forEach((item) => {
    expect(print.fn.decolor(print.buildTree(item.op))).toEqual(item.result)
  })

  await fn.frag.destory()
})
