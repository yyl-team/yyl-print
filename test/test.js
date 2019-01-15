const print = require('../index.js');
const path = require('path');
const fs = require('fs');
const extFs = require('yyl-fs');
const chalk = require('chalk');

jest.setTimeout(30000);
const FRAG_PATH = path.join(__dirname, './__frag');
const fn = {
  frag: {
    async build() {
      if (fs.existsSync(FRAG_PATH)) {
        await extFs.removeFiles(FRAG_PATH);
      } else {
        await extFs.mkdirSync(FRAG_PATH);
      }
    },
    async destory() {
      if (fs.existsSync(FRAG_PATH)) {
        await extFs.removeFiles(FRAG_PATH, true);
      }
    }
  },
  async buildFile(iPath) {
    const dirname = path.dirname(iPath);
    if (!fs.existsSync(dirname)) {
      await extFs.mkdirSync(dirname);
    }
    fs.writeFileSync(iPath, '');
  }
};

test('print.help(op)', () => {
  const checkMap = [{
    op: {
      silent: true,
      usage: 'yyl-print',
      command: {
        'init': 'init files',
        'default': 'default system'
      },
      options: {
        '-v, --version': 'show version',
        '-p, --path': 'path to plugin'
      }
    },
    result: [
      '',
      '  Usage: yyl-print <command>',
      '',
      '  Options:',
      '    -v, --version  show version',
      '    -p, --path     path to plugin',
      '',
      ''
    ]
  }];

  checkMap.forEach((item) => {
    const r = print.help(item.op);
    expect(print.fn.decolor(r)).toEqual(item.result);
  });
});

test('print.buildTree({frontPath, path})', async () => {
  await fn.frag.build();

  await fn.buildFile(path.join(FRAG_PATH, 'js/index.js'));
  await fn.buildFile(path.join(FRAG_PATH, 'css/index.css'));
  await fn.buildFile(path.join(FRAG_PATH, 'html/index.html'));
  await fn.buildFile(path.join(FRAG_PATH, '.eslintrc'));
  await fn.buildFile(path.join(FRAG_PATH, 'yyl.config.js'));
  await fn.buildFile(path.join(FRAG_PATH, '.sass-cache/cache.js'));

  const checkMap = [{
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
  }, {
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
  }, {
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
  }, {
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
  }];

  checkMap.forEach((item) => {
    expect(
      print.fn.decolor(
        print.buildTree(item.op)
      )
    ).toEqual(item.result);
  });

  await fn.frag.destory();
});

test('print.borderBox(str, op)', () => {
  const checkMap = [{
    str: '123456789',
    op: {
      color: false,
      silent: true
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }, {
    str: ['1234567890'],
    op: {
      silent: true,
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

  // init test
  print.log.init({
    type: {
      hello: {
        name: 'HELO',
        color: chalk.yellow.bold.bgWhite
      }
    }
  });

  expect(print.log.test('hello world')).toEqual([`${chalk.white.bgCyan(' TEST ')} hello world`]);
  expect(print.log.hello('hello world')).toEqual([`${chalk.yellow.bold.bgWhite(' HELO ')} hello world`]);


  // useage test
  const checkMap = [{
    argv: [123, undefined, 'hehe'],
    result: [
      `${chalk.white.bgCyan(' TEST ')} 123`,
      `${chalk.white.bgCyan('      ')} undefined`,
      `${chalk.white.bgCyan('      ')} hehe`
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
      `${chalk.white.bgCyan(' TEST ')} 123456789012345678901234567890123456789012345678901234567890123456789012`,
      `${chalk.white.bgCyan('      ')} 34567890`,
      `${chalk.white.bgCyan('      ')} hello`
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
        chalk.red(1234567890)
      ].join(''),
      'hello'
    ],
    result: [
      `${chalk.white.bgCyan(' TEST ')} 1234567890123456789012345678901234567890123456789012345678901234567890${chalk.red('12')}`,
      `${chalk.white.bgCyan('      ')} ${chalk.red('34567890')}`,
      `${chalk.white.bgCyan('      ')} hello`
    ]
  }];

  checkMap.forEach((param) => {
    print.log.silent(true);
    const r = print.log.test(...param.argv);
    expect(r).toEqual(param.result);
  });
});
