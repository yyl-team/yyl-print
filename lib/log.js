const chalk = require('chalk')
const readline = require('readline')
const fn = require('./fn')
const { COLUMNS } = require('./const')

const log = {
  __mark: {
    preType: null,
    preRowCount: 0
  },
  source: {
    type: {
      success: {
        name: 'PASS',
        color: 'white',
        bgColor: 'bgCyan'
      },
      error: {
        name: 'ERR',
        color: 'white',
        bgColor: 'red'
      },
      warn: {
        name: 'WARN',
        color: 'white',
        bgColor: 'bgYellow'
      },
      add: {
        name: 'ADD',
        color: 'white',
        bgColor: 'bgBlue'
      },
      remove: {
        name: 'RM',
        color: 'white',
        bgColor: 'bgBlue'
      },
      update: {
        name: 'UPDT',
        color: 'white',
        bgColor: 'bgMagenta'
      },
      info: {
        name: 'INFO',
        color: 'gray',
        bgColor: 'bgBlack'
      },
      del: {
        name: 'DEL',
        color: 'white',
        bgColor: 'bgWhite'
      },
      cmd: {
        name: 'CMD>',
        color: 'white',
        bgColor: 'bgBlack'
      }
    },
    maxSize: 4,
    silent: false,
    logLevel: 2,
    keyword: {
      finished: 'green',
      failed: 'red',
      error: 'red',
      start: 'cyan',
      passed: 'green'
    },
    // logLevel 1 config
    mode1: {
      // 在白名单内的 type 不会折叠
      abridgeIgnores: ['success', 'error', 'warn'],
      // 不作输出的类型
      ignoreTypes: ['info']
    },
    // logLevel 1 config
    mode0: {
      // 允许输出的类型
      allowTypes: ['error']
    }
  },
  silent(bool) {
    const self = this
    self.source.silent = bool
  },
  setLogLevel(level) {
    const self = this
    self.source.logLevel = level
  },
  init(op) {
    const self = this
    if (typeof op === 'object') {
      Object.keys(op).forEach((key) => {
        if (key in self.source) {
          if (/object|array/.test(fn.type(self.source[key]))) {
            self.source[key] = Object.assign(self.source[key], op[key])
          } else {
            self.source[key] = op[key]
          }
        }
      })
    }

    const makeFn = function (key, ctx) {
      const fnName = key
      let iPrint = key
      let colorCtrl

      if (fnName === 'log') {
        throw 'print.msg.log can not be reset'
      }

      if (typeof ctx == 'object') {
        iPrint = ctx.name || key
        if (typeof ctx.color === 'function') {
          colorCtrl = ctx.color
        } else {
          colorCtrl = chalk[ctx.color] || chalk.write
          if (ctx.bgColor) {
            colorCtrl = colorCtrl[ctx.bgColor] || colorCtrl.bgBlack
          }
        }
      } else if (typeof ctx === 'function') {
        colorCtrl = ctx
      } else if (typeof ctx === 'string') {
        colorCtrl = chalk[ctx] || chalk.write
        colorCtrl = colorCtrl.bgBlack
      } else {
        colorCtrl = chalk.wrigt.bgBlack
      }

      if (iPrint.length > self.source.maxSize) {
        self.source.maxSize = iPrint.length
      }

      const blanks = fn.makeSpace(self.source.maxSize - iPrint.length)
      const prefix = colorCtrl(` ${iPrint}${blanks} `)
      const subfix = colorCtrl(
        ` ${fn.makeSpace(fn.getStrSize(iPrint))}${blanks} `
      )

      self[fnName] = function () {
        const iArgv = [...arguments]
        return self.log(arguments.callee.options, iArgv)
      }

      self[fnName].options = { prefix, subfix, type: key }
    }

    if (self.source.type) {
      Object.keys(self.source.type).forEach((key) => {
        makeFn(key, self.source.type[key])
      })
    }

    return self.source
  },
  log(op, argv) {
    const self = this
    let iArgv = []
    let prefix
    let subfix
    let type
    if (typeof op === 'object' && 'prefix' in op && 'subfix' in op) {
      prefix = op.prefix
      subfix = op.subfix
      type = op.type
    } else {
      // 非正常情况取默认值
      prefix = self.info.prefix
      subfix = self.info.subfix
      type = 'info'
      iArgv.push(op)
    }

    if (
      self.source.logLevel === 1 &&
      self.source.mode1.ignoreTypes.indexOf(type) !== -1
    ) {
      return
    }

    if (
      self.source.logLevel === 0 &&
      self.source.mode0.allowTypes.indexOf(type) === -1
    ) {
      return
    }

    const pfSize = fn.getStrSize(prefix)
    const cntSize = COLUMNS - pfSize - 2
    if (!fn.isArray(argv)) {
      iArgv.push(argv)
    } else {
      iArgv = iArgv.concat(argv)
    }

    let fArgv = []
    iArgv.forEach((ctx) => {
      let cnt
      const iType = fn.type(ctx)
      if (/^number|string|undefined$/.test(iType)) {
        cnt = `${ctx}`
        fArgv = fArgv.concat(fn.strWrap(cnt, cntSize))
      } else if (iType === 'error') {
        fArgv = fArgv.concat(fn.strWrap(ctx.stack, cntSize))
      } else if (iType === 'object') {
        fArgv = fArgv.concat(fn.strWrap(JSON.stringify(ctx, null, 2), cntSize))
      } else {
        fArgv.push(cnt)
      }
    })

    iArgv = fArgv

    const r = []
    const hightlightIt = function (str) {
      let rStr = str
      const { keyword } = self.source
      Object.keys(keyword).forEach((key) => {
        const colorCtrl = chalk[keyword[key]] || chalk.yellow
        rStr = fn.replaceKeyword(rStr, key, colorCtrl(key))
      })
      return rStr
    }
    iArgv.forEach((ctx, i) => {
      let front = prefix
      if (i !== 0) {
        front = subfix
      }
      if (typeof ctx === 'string') {
        r.push(`${front} ${hightlightIt(ctx)}`)
      } else {
        if (i === 0) {
          r.push(`${front}`)
        }
        r.push(ctx)
      }
    })

    if (self.source.logLevel === 1) {
      if (
        prefix === self.__mark.preType &&
        self.source.mode1.abridgeIgnores.indexOf(op.type) === -1
      ) {
        const stream = process.stderr
        let padding = self.__mark.preRowCount || 0
        while (padding) {
          readline.moveCursor(stream, 0, -1)
          readline.clearLine(stream, 1)
          padding--
        }
      }
    }

    self.__mark.preType = prefix
    self.__mark.preRowCount = r.length

    if (!self.source.silent) {
      readline.clearLine(process.stderr, 1)
      readline.cursorTo(process.stderr, 0)
      console.log(r.join('\n'))
    }
    return r
  }
}

log.init()

module.exports = log
