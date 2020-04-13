const path = require('path')
const { COLOR_REG } = require('./const')

const fn = {
  strWrap(str, size, indent) {
    const r = []
    const lines = `${str}`
      .trim()
      .split(/[\r\n]+/)
      .map((t) => (indent !== undefined ? t.trim() : t))

    let columnSize = 0
    let lineIndent = 0
    let lineNum = 0
    const addLineNum = function () {
      lineNum++
      if (lineNum === 1) {
        lineIndent = 0
        columnSize = size
      } else {
        lineIndent = indent || 0
        columnSize = size - lineIndent
      }
    }
    addLineNum()
    lines.forEach((line) => {
      if (fn.getStrSize(line) > columnSize) {
        let fragStr = line

        while (fn.getStrSize(fragStr) > columnSize) {
          r.push(
            `${fn.makeSpace(lineIndent)}${fn.substr(fragStr, 0, columnSize)}`
          )
          fragStr = fn.substr(fragStr, columnSize)
          addLineNum()
        }
        if (fn.getStrSize(fragStr) > 0) {
          r.push(`${fn.makeSpace(lineIndent)}${fragStr}`)
          addLineNum()
        }
      } else {
        r.push(`${fn.makeSpace(lineIndent)}${line}`)
        addLineNum()
      }
    })

    return r
  },
  replaceKeyword(str, keyword, result) {
    return str
      .replace(new RegExp(` ${keyword}$`, 'g'), ` ${result}`)
      .replace(new RegExp(`^${keyword} `, 'g'), `${result} `)
      .replace(new RegExp(` ${keyword} `, 'g'), ` ${result} `)
      .replace(new RegExp(` ${keyword}([:,.]+)`, 'g'), ` ${result}$1`)
  },
  formatUrl(url) {
    return url.split(path.sep).join('/')
  },
  hideProtocol(str) {
    if (typeof str === 'string') {
      return str.replace(/^http[s]?:/, '')
    } else {
      return str
    }
  },
  type(ctx) {
    return Object.prototype.toString
      .call(ctx)
      .replace(/^\[object (\w+)\]$/, '$1')
      .toLowerCase()
  },
  isArray(ctx) {
    return typeof ctx === 'object' && ctx.splice === Array.prototype.splice
  },
  buildChar(char, num) {
    return new Array(num + 1).join(char)
  },
  makeSpace(num) {
    return this.buildChar(' ', num)
  },
  // 去色
  decolor(ctx) {
    if (fn.isArray(ctx)) {
      return ctx.map((str) => str.replace(COLOR_REG, ''))
    } else {
      return ctx.replace(COLOR_REG, '')
    }
  },
  /**
   * 格式化文字(居中, 左, 右)
   * @param  {String} str
   * @param  {Object} op       配置
   * @param  {Number} op.size  所占字符数
   * @param  {Number} op.align left|center|right
   * @return {Number} r        输出结果
   */
  strAlign(str, op) {
    const she = this
    const options = Object.assign(
      {
        size: 20,
        align: 'left'
      },
      op
    )

    const strLen = she.getStrSize(str)
    if (strLen >= op.size) {
      return str
    } else if (options.align === 'right') {
      return `${she.makeSpace(options.size - strLen)}${str}`
    } else if (options.align === 'center') {
      const isStrOdd = strLen % 2
      const isLenOdd = options.size % 2
      let spaceLeft = 0
      let spaceRight = 0
      if (isStrOdd === isLenOdd) {
        // 同奇同偶
        spaceLeft = spaceRight = (options.size - strLen) / 2
      } else {
        spaceLeft = Math.floor((options.size - strLen) / 2)
        spaceRight = spaceLeft + 1
      }
      return `${she.makeSpace(spaceLeft)}${str}${she.makeSpace(spaceRight)}`
    } else {
      // left
      return `${str}${she.makeSpace(options.size - strLen)}`
    }
  },
  /**
   * 获取带颜色的字符串长度
   * @param  {String} str
   * @return {Number} length
   */
  getStrSize(str) {
    return fn.decolor(str).length
  },

  /**
   * 截取带颜色文字的长度
   * @param  {String} str   带颜色字符串
   * @param  {Number} begin 开始位置
   * @param  {Number} len   长度
   * @return {String} r     截取后的字符串
   */
  substr(str, begin, len) {
    const dos = []
    str.replace(COLOR_REG, (str) => {
      dos.push(str)
    })
    const strArr = str.split(COLOR_REG)
    const size = this.getStrSize(str)
    for (let i = 0; i < strArr.length; ) {
      if (strArr[i].match(COLOR_REG)) {
        strArr.splice(i, 1)
      } else {
        i++
      }
    }

    if (begin > size - 1) {
      return ''
    }

    if (len === undefined) {
      len = size - 1 - begin
    } else if (begin + len > size - 1) {
      len = size - 1 - begin
    }

    let r = ''
    let point = 0
    let isBegin = false
    let isEnd = false
    strArr.forEach((iStr, i) => {
      if (isEnd) {
        return
      }
      const strLen = iStr.length

      if (!isBegin) {
        if (begin >= point && begin < point + strLen) {
          if (i % 2 != 0) {
            r = `${dos[i - 1]}`
          }
          if (begin + len >= point && begin + len <= point + strLen) {
            r = `${r}${iStr.substr(begin - point, begin + len - point)}`
            if (i % 2 != 0 && i < dos.length) {
              r = `${r}${dos[i]}`
            }
            isEnd = true
          } else {
            r = `${r}${iStr.substr(begin - point)}`
          }

          isBegin = true
        }
      } else {
        if (begin + len >= point && begin + len <= point + strLen) {
          // is end
          r = `${r}${dos[i - 1]}${iStr.substr(0, begin + len - point)}`
          if (i % 2 != 0 && i < dos.length) {
            r = `${r}${dos[i]}`
          }

          isEnd = true
          return true
        } else {
          // add it
          r = `${r}${dos[i - 1]}${iStr}`
        }
      }

      point += strLen
    })
    return r
  },
  /**
   * 切割文字为数组
   * @param  {String} str    字符
   * @param  {Number} maxLen 最大长度
   * @return {Array}  arr    切割结果
   */
  splitStr(str, maxLen) {
    const r = []
    const she = this
    if (!str) {
      r.push('')
    } else if (she.getStrSize(str) <= maxLen) {
      r.push(str)
    } else {
      // 切割字符
      let fragStr = str
      while (she.getStrSize(fragStr) > maxLen) {
        r.push(she.substr(fragStr, 0, maxLen))
        fragStr = she.substr(fragStr, maxLen)
      }
      if (she.getStrSize(fragStr) > 0) {
        r.push(fragStr)
      }
    }
    return r
  },
  // 计时类函数
  cost: {
    source: {
      begin: 0,
      total: 0
    },
    start() {
      this.source.begin = new Date()
      return this.source.begin
    },
    end() {
      this.source.total = new Date() - this.source.begin
      return this.source.total
    },
    format(total) {
      const cost = total || this.source.total
      const min = Math.floor(cost / 1000 / 60)
      const sec = Math.floor(cost / 1000) % 60
      const us = cost % 1000
      let r = ''
      if (min) {
        r = `${r}${min}min`
      }
      if (sec) {
        r = `${r} ${sec}s`
      }
      if (us) {
        r = `${r} ${us}ms`
      }
      r = r.trim()
      return r
    }
  },
  timeFormat(t) {
    let r
    if (t) {
      r = new Date(t)
    } else {
      r = new Date()
    }
    if (isNaN(r)) {
      throw `print.timeFormat(t) error, t: ${t} is Invalid Date`
    }

    return `${r}`.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1')
  },
  dateFormat(t) {
    let r
    const self = this
    if (t) {
      r = new Date(t)
      if (typeof t === 'string' && !/:/.test(t)) {
        r.setHours(0, 0, 0, 0)
      }
    } else {
      r = new Date()
    }
    if (isNaN(r)) {
      throw `print.dateFormat(t) error, t: ${t} is Invalid Date`
    }

    const year = r.getFullYear()
    let mon = r.getMonth() + 1
    if (mon < 10) {
      mon = `0${mon}`
    }
    let date = r.getDate()
    if (date < 10) {
      date = `0${date}`
    }

    return `${year}-${mon}-${date} ${self.timeFormat(r)}`
  }
}
module.exports = fn
