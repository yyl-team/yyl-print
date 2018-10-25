const print = require('../index.js');

jest.setTimeout(30000);

test('print.borderBox(str, op)', () => {
  const checkMap = [{
    str: '123456789',
    op: {
      color: false
    },
    result: [
      '',
      ' +-----------+',
      ' | 123456789 |',
      ' +-----------+',
      ''
    ]
  }, {
    str: ['123456789', '123'],
    op: {
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
  }, {
    str: ['123456789', '123'],
    op: {
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
  }, {
    str: ['123456789', '123'],
    op: {
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
  }, {
    str: ['123456789', '123'],
    op: {
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
  }, {
    str: ['123456789', '12'],
    op: {
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
  }, {
    str: ['1234567890'],
    op: {
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
  }, {
    str: ['1234567890'],
    op: {
      color: false,
      align: 'center',
      maxSize: 800
    },
    result: [
      '',
      ' +------------+',
      ' | 1234567890 |',
      ' +------------+',
      ''
    ]
  }, {
    str: ['1234567890'],
    op: {
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
  }];

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
    });
  }

  for (let i = 0, len = checkMap.length; i < len; i++) {
    let param = checkMap[i];
    let r = print.borderBox(param.str, param.op).map((str) => {
      return print.fn.decolor(str);
    });
    expect(r).toEqual(param.result);
  }
});

test('print.log.info()', () => {
  print.log.silent(true);

  // init test
  print.log.init({
    type: {
      test: {
        name: 'TEST',
        color: 'white',
        bgColor: 'bgCyan'
      }
    }
  });

  expect(print.log.test('hello world').map(str => print.fn.decolor(str))).toEqual([' TEST  hello world']);


  // useage test
  const checkMap = [{
    argv: [123, undefined, 'hehe'],
    result: [
      ' INFO  123',
      '       undefined',
      '       hehe'
    ]
  }, {
    argv: [
      [
        1234567890,
        1234567890,
        1234567890,
        1234567890,
        1234567890,
        1234567890,
        1234567890,
        1234567890
      ].join(''),
      'hello'
    ],
    result: [
      ' INFO  123456789012345678901234567890123456789012345678901234567890123456789012',
      '       34567890',
      '       hello'
    ]
  }];

  checkMap.forEach((param) => {
    print.log.silent(true);
    const r = print.log.info(...param.argv).map((str) => {
      return print.fn.decolor(str);
    });
    expect(r).toEqual(param.result);
  });
});
