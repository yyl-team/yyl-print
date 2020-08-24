const print = require('../../')
const chalk = require('chalk')

if (process.stdout.columns !== 80) {
  throw new Error('请将 cmd 窗口设置为 80 宽度再进行测试')
}

test('print.log.info()', () => {
  print.log.silent(true)

  // init test
  print.log.init({
    type: {
      test: {
        name: 'TEST',
        color: 'white',
        bgColor: 'bgCyan'
      }
    }
  })

  // init test
  print.log.init({
    type: {
      hello: {
        name: 'HELO',
        color: chalk.yellow.bold.bgWhite
      }
    }
  })

  expect(print.log.test('hello world')).toEqual([
    `${chalk.white.bgCyan(' TEST ')} hello world`
  ])
  expect(print.log.hello('hello world')).toEqual([
    `${chalk.yellow.bold.bgWhite(' HELO ')} hello world`
  ])

  // useage test
  const checkMap = [
    {
      argv: [123, undefined, 'hehe'],
      result: [
        `${chalk.white.bgCyan(' TEST ')} 123`,
        `${chalk.white.bgCyan('      ')} undefined`,
        `${chalk.white.bgCyan('      ')} hehe`
      ]
    },
    {
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
        `${chalk.white.bgCyan(
          ' TEST '
        )} 123456789012345678901234567890123456789012345678901234567890123456789012`,
        `${chalk.white.bgCyan('      ')} 34567890`,
        `${chalk.white.bgCyan('      ')} hello`
      ]
    },
    {
      argv: [
        [
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          chalk.red(1234567890)
        ].join(''),
        'hello'
      ],
      result: [
        `${chalk.white.bgCyan(
          ' TEST '
        )} 1234567890123456789012345678901234567890123456789012345678901234567890${chalk.red(
          '12'
        )}`,
        `${chalk.white.bgCyan('      ')} ${chalk.red('34567890')}`,
        `${chalk.white.bgCyan('      ')} hello`
      ]
    },
    {
      argv: [
        [
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          1234567890,
          chalk.red.bold(1234567890)
        ].join(''),
        'hello'
      ],
      result: [
        `${chalk.white.bgCyan(
          ' TEST '
        )} 1234567890123456789012345678901234567890123456789012345678901234567890${chalk.red.bold(
          '12'
        )}`,
        `${chalk.white.bgCyan('      ')} ${chalk.red.bold('34567890')}`,
        `${chalk.white.bgCyan('      ')} hello`
      ]
    },
    {
      argv: [{ a: 1, b: 2 }],
      result: [
        `${chalk.white.bgCyan(' TEST ')} {`,
        `${chalk.white.bgCyan('      ')}   "a": 1,`,
        `${chalk.white.bgCyan('      ')}   "b": 2`,
        `${chalk.white.bgCyan('      ')} }`
      ]
    }
  ]

  checkMap.forEach((param) => {
    print.log.silent(true)
    const r = print.log.test(...param.argv)
    expect(r).toEqual(param.result)
  })
})
