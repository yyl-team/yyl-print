const print = require('../../')
jest.setTimeout(30000)

if (process.stdout.columns !== 80) {
  throw new Error('请将 cmd 窗口设置为 80 宽度再进行测试')
}

test('print.help(op)', () => {
  const checkMap = [
    {
      op: {
        silent: true,
        usage: 'yyl-print',
        command: {
          init: 'init files',
          default: 'default system'
        },
        options: {
          '-v, --version': 'show version',
          '-p, --path': 'path to plugin'
        }
      },
      result: [
        '',
        '  Usage: yyl-print <options>',
        '',
        '  Options:',
        '    -v, --version  show version',
        '    -p, --path     path to plugin',
        '',
        ''
      ]
    }
  ]

  checkMap.forEach((item) => {
    const r = print.help(item.op)
    expect(print.fn.decolor(r)).toEqual(item.result)
  })
})
