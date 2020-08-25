const chalk = require('chalk')
const readline = require('readline')
const fn = require('./fn')
const log = require('./log')

const progress = {
  __mark: {
    iconIndex: 0,
    lastArgs: [],
    lastRowsCount: 0,
    intervalKey: 0
  },
  __source: {
    // 刷新频率
    interval: 100,
    logLevel: 1,
    silent: false,
    // icon
    icon: {
      // 加载时
      progress: {
        chats: ['⠧', '⠏', '⠹', '⠼'],
        color: chalk.gray
      },
      // 完成时
      finished: {
        chats: ['✓'],
        color: chalk.green
      },
      // 出错时
      error: {
        chats: ['✘'],
        color: chalk.red
      },
      warn: {
        chats: ['⚠'],
        color: chalk.yellow
      }
    }
  },
  init(op) {
    const self = this
    if (typeof op === 'object') {
      Object.keys(op).forEach((key) => {
        if (key in self.__source) {
          if (/object|array/.test(fn.type(self.__source[key]))) {
            self.__source[key] = Object.assign(self.__source[key], op[key])
          } else {
            self.__source[key] = op[key]
          }
        }
      })
    }
  },
  start(...args) {
    const { __source, __mark } = this
    if (__mark.intervalKey) {
      this.finished()
    }

    __mark.lastArgs = args.length ? args : ['start']
    this.log(...__mark.lastArgs)

    if (__source.logLevel !== 2) {
      __mark.intervalKey = setInterval(() => {
        this.log(...__mark.lastArgs)
      }, __source.interval)
    }
  },
  log(...args) {
    const { __source, __mark } = this
    const { icon } = __source
    const { chats } = icon.progress
    const printLogs = log.__buildArgs({
      prefix: ` ${icon.progress.color(
        chats[__mark.iconIndex++ % chats.length]
      )} `,
      subfix: ` ${icon.progress.color(' ')} `,
      argv: args
    })

    // print
    if (!this.__source.silent) {
      // back to pre log top
      if (this.__source.logLevel !== 2) {
        const stream = process.stderr
        let padding = __mark.lastRowsCount || 0
        while (padding) {
          readline.moveCursor(stream, 0, -1)
          readline.clearLine(stream, 1)
          padding--
        }
      }

      // back to front
      readline.clearLine(process.stderr, 1)
      readline.cursorTo(process.stderr, 0)

      // print
      console.log(printLogs.join('\n'))
      __mark.lastArgs = args
      __mark.lastRowsCount = printLogs.length
    }
    return args
  },
  end(type, args) {
    const { __source, __mark } = this
    const { icon } = __source
    const { chats, color } = icon[type]

    clearInterval(__mark.intervalKey)
    __mark.intervalKey = 0

    const printLogs = log.__buildArgs({
      prefix: ` ${color(chats[0])} `,
      subfix: ` ${color(' ')} `,
      argv: args
    })

    // print
    if (!this.__source.silent) {
      // back to pre log top
      if (this.__source.logLevel !== 2) {
        const stream = process.stderr
        let padding = __mark.lastRowsCount || 0
        while (padding) {
          readline.moveCursor(stream, 0, -1)
          readline.clearLine(stream, 1)
          padding--
        }
      }

      // back to front
      readline.clearLine(process.stderr, 1)
      readline.cursorTo(process.stderr, 0)

      // print
      console.log(printLogs.join('\n'))
    }

    __mark.lastArgs = []
    __mark.iconIndex = 0
    __mark.lastRowsCount = 0
  },
  error(...args) {
    this.end('error', args.length ? args : ['fail'])
  },
  warn(...args) {
    this.end('warn', args.length ? args : ['warn'])
  },
  finished(...args) {
    this.end('finished', args.length ? args : ['finished'])
  }
}

module.exports = progress
