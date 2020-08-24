const print = require('../../')
if (process.stdout.columns !== 80) {
  throw new Error('请将 cmd 窗口设置为 80 宽度再进行测试')
}

test('print.fn.cost', () => {
  print.fn.cost.start()
  print.fn.cost.end()
  print.fn.cost.format()

  expect(print.fn.cost.format(2000)).toEqual('2s')
  expect(print.fn.cost.format(2100)).toEqual('2s 100ms')
  expect(print.fn.cost.format(62100)).toEqual('1min 2s 100ms')
})

test('print.fn.timeFormat(d)', () => {
  expect(print.fn.timeFormat('2018/10/1 12:00:00')).toEqual('12:00:00')
})

test('print.fn.hideProtocol(url)', () => {
  const testMap = {
    'https://www.yy.com': '//www.yy.com',
    'http://www.yy.com': '//www.yy.com',
    'http://www.yy.com?prototype=http': '//www.yy.com?prototype=http'
  }

  Object.keys(testMap).forEach((key) => {
    expect(print.fn.hideProtocol(key)).toEqual(testMap[key])
  })
})

test('print.fn.type(ctx)', () => {
  expect(print.fn.type([])).toEqual('array')
  expect(print.fn.type({})).toEqual('object')
  expect(print.fn.type(1)).toEqual('number')
  expect(print.fn.type('a')).toEqual('string')
  expect(print.fn.type(new Error(123))).toEqual('error')
})

test('print.fn.strWrap(str, size, indent)', () => {
  const checkingMap = [
    {
      argu: ['01234567890123456789', 10],
      result: ['0123456789', '0123456789']
    },
    {
      argu: ['01234567890123456789', 10, 2],
      result: ['0123456789', '  01234567', '  89']
    },
    {
      argu: ['0123456789012\r\n    34567890123456789', 10, 2],
      result: ['0123456789', '  012', '  34567890', '  12345678', '  9']
    },
    {
      argu: ['0123456789012\r\n    34567890123456789', 10],
      result: ['0123456789', '012', '    345678', '9012345678', '9']
    }
  ]
  checkingMap.forEach((item) => {
    expect(print.fn.strWrap(...item.argu)).toEqual(item.result)
  })
})

test('print.fn.dateFormat(d)', () => {
  const checkingMap = [
    {
      argu: ['2019-01-01'],
      result: '2019-01-01 00:00:00'
    },
    {
      argu: [new Date('2019-01-01 00:00:00')],
      result: '2019-01-01 00:00:00'
    },
    {
      argu: ['2019/01/01'],
      result: '2019-01-01 00:00:00'
    },
    {
      argu: ['2019/01/01 01:02:03'],
      result: '2019-01-01 01:02:03'
    }
  ]

  checkingMap.forEach((item) => {
    expect(print.fn.dateFormat(...item.argu)).toEqual(item.result)
  })
})
