const print = require('../../')
if (process.stdout.columns !== 80) {
  throw new Error('请将 cmd 窗口设置为 80 宽度再进行测试')
}

test('print.borderBox(str, op)', () => {
  const checkMap = [
    {
      str: '123456789',
      op: {
        color: false,
        silent: true
      },
      result: ['', ' +-----------+', ' | 123456789 |', ' +-----------+', '']
    },
    {
      str: ['123456789', '123'],
      op: {
        silent: true,
        color: false
      },
      result: [
        '',
        ' +-----------+',
        ' | 123456789 |',
        ' |    123    |',
        ' +-----------+',
        ''
      ]
    },
    {
      str: ['123456789', '123'],
      op: {
        silent: true,
        color: false,
        align: 'left'
      },
      result: [
        '',
        ' +-----------+',
        ' | 123456789 |',
        ' | 123       |',
        ' +-----------+',
        ''
      ]
    },
    {
      str: ['123456789', '123'],
      op: {
        silent: true,
        color: false,
        align: 'right'
      },
      result: [
        '',
        ' +-----------+',
        ' | 123456789 |',
        ' |       123 |',
        ' +-----------+',
        ''
      ]
    },
    {
      str: ['123456789', '123'],
      op: {
        silent: true,
        color: false,
        align: 'center'
      },
      result: [
        '',
        ' +-----------+',
        ' | 123456789 |',
        ' |    123    |',
        ' +-----------+',
        ''
      ]
    },
    {
      str: ['123456789', '12'],
      op: {
        silent: true,
        color: false,
        align: 'center'
      },
      result: [
        '',
        ' +-----------+',
        ' | 123456789 |',
        ' |    12     |',
        ' +-----------+',
        ''
      ]
    },
    {
      str: ['1234567890'],
      op: {
        silent: true,
        color: false,
        align: 'center',
        maxSize: 8
      },
      result: [
        '',
        ' +----------+',
        ' | 12345678 |',
        ' |    90    |',
        ' +----------+',
        ''
      ]
    },
    {
      str: ['1234567890'],
      op: {
        silent: true,
        color: false,
        align: 'center',
        maxSize: 800
      },
      result: ['', ' +------------+', ' | 1234567890 |', ' +------------+', '']
    },
    {
      str: ['1234567890'],
      op: {
        silent: true,
        color: false,
        padding: 2
      },
      result: [
        '',
        ' +--------------+',
        ' |  1234567890  |',
        ' +--------------+',
        ''
      ]
    }
  ]

  if (process.stdout.columns === 80) {
    checkMap.push({
      str: [
        '1234567890',
        '1234567890',
        '1234567890',
        '1234567890',
        '1234567890',
        '1234567890',
        '1234567890',
        '1234567890'
      ].join(''),
      op: {
        silent: true,
        color: false
      },
      result: [
        '',
        ' +----------------------------------------------------------------------------+',
        ' | 12345678901234567890123456789012345678901234567890123456789012345678901234 |',
        ' |                                   567890                                   |',
        ' +----------------------------------------------------------------------------+',
        ''
      ]
    })
  }

  for (let i = 0, len = checkMap.length; i < len; i++) {
    let param = checkMap[i]
    let r = print.borderBox(param.str, param.op).map((str) => {
      return print.fn.decolor(str)
    })
    expect(r).toEqual(param.result)
  }
})
