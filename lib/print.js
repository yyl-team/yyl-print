/* eslint no-control-regex: 0 */
const chalk = require('chalk');
const COLOR_REG = /(\u001b\[\d+m|\033\[[0-9;]+m)/g;

let COLUMNS = process.stdout.columns || 80;
process.stdout.on('resize', () => {
  COLUMNS = process.stdout.columns || 80;
});

const fn = {
  replaceKeyword(str, keyword, result) {
    return str
      .replace(new RegExp(` ${keyword}$`, 'g'), ` ${result}`)
      .replace(new RegExp(`^${keyword} `, 'g'), `${result} `)
      .replace(new RegExp(` ${keyword} `, 'g'), ` ${result} `)
      .replace(new RegExp(` ${keyword}([:,.]+)`, 'g'), ` ${result}$1`);
  },
  isArray(ctx) {
    return typeof ctx === 'object' && ctx.splice === Array.prototype.splice;
  },
  buildChar(char, num) {
    return new Array(num + 1).join(char);
  },
  makeSpace(num) {
    return this.buildChar(' ', num);
  },
  // 去色
  decolor(str) {
    return str.replace(COLOR_REG, '');
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
    const she = this;
    const options = Object.assign({
      size: 20,
      align: 'left'
    }, op);

    const strLen = she.getStrSize(str);
    if (strLen >= op.size) {
      return str;
    } else if (options.align === 'right') {
      return `${she.makeSpace(options.size - strLen)}${str}`;
    } else if (options.align === 'center') {
      const isStrOdd = strLen % 2;
      const isLenOdd = options.size % 2;
      let spaceLeft = 0;
      let spaceRight = 0;
      if (isStrOdd === isLenOdd) { // 同奇同偶
        spaceLeft = spaceRight = (options.size - strLen) / 2;
      } else {
        spaceLeft = Math.floor((options.size - strLen) / 2);
        spaceRight = spaceLeft + 1;
      }
      return `${she.makeSpace(spaceLeft)}${str}${she.makeSpace(spaceRight)}`;
    } else { // left
      return `${str}${she.makeSpace(options.size - strLen)}`;
    }
  },
  /**
   * 获取带颜色的字符串长度
   * @param  {String} str
   * @return {Number} length
   */
  getStrSize(str) {
    return fn.decolor(str).length;
  },

  /**
   * 截取带颜色文字的长度
   * @param  {String} str   带颜色字符串
   * @param  {Number} begin 开始位置
   * @param  {Number} len   长度
   * @return {String} r     截取后的字符串
   */
  substr(str, begin, len) {
    const dos = [];
    str.replace(COLOR_REG, (str) => {
      dos.push(str);
    });
    const strArr = str.split(COLOR_REG);
    const size = this.getStrSize(str);
    for (let i = 0; i < strArr.length;) {
      if (strArr[i].match(COLOR_REG)) {
        strArr.splice(i, 1);
      } else {
        i++;
      }
    }

    if (begin > size - 1) {
      return '';
    }

    if (len === undefined) {
      len = size - 1 - begin;
    } else if (begin + len > size - 1) {
      len = size - 1 - begin;
    }

    let r = '';
    let point = 0;
    let isBegin = false;
    let isEnd = false;
    strArr.forEach((iStr, i) => {
      if (isEnd) {
        return;
      }
      const strLen = iStr.length;

      if (!isBegin) {
        if (begin >= point && begin < point + strLen) {
          if (i % 2 != 0) {
            r = `${dos[i - 1]}`;
          }
          if (begin + len >= point && begin + len <= point + strLen) {
            r = `${r}${iStr.substr(begin - point, begin + len - point)}`;
            if (i % 2 != 0 && i < dos.length) {
              r = `${r}${dos[i]}`;
            }
            isEnd = true;
          } else {
            r = `${r}${iStr.substr(begin - point)}`;
          }

          isBegin = true;
        }
      } else {
        if (begin + len >= point && begin + len <= point + strLen) { // is end
          r = `${r}${dos[i - 1]}${iStr.substr(0, begin + len - point)}`;
          if (i % 2 != 0 && i < dos.length) {
            r = `${r}${dos[i]}`;
          }

          isEnd = true;
          return true;
        } else { // add it
          r = `${r}${dos[i - 1]}${iStr}`;
        }
      }

      point += strLen;
    });
    return r;
  },
  /**
   * 切割文字为数组
   * @param  {String} str    字符
   * @param  {Number} maxLen 最大长度
   * @return {Array}  arr    切割结果
   */
  splitStr(str, maxLen) {
    const r = [];
    const she = this;
    if (!str) {
      r.push('');
    } else if (she.getStrSize(str) <= maxLen) {
      r.push(str);
    } else { // 切割字符
      let fragStr = str;
      while (she.getStrSize(fragStr) > maxLen) {
        r.push(she.substr(fragStr, 0, maxLen));
        fragStr = she.substr(fragStr, maxLen);
      }
      if (she.getStrSize(fragStr) > 0) {
        r.push(fragStr);
      }
    }
    return r;
  }
};

const print = {
  /**
   * @param  {String|Array} ctx        待处理字符
   * @param  {Object}       op         参数
   * @param  {String}       op.align   对齐方式 left|center|right, 默认 center
   * @param  {Number}       op.padding 左右空格 默认 1
   * @param  {Number}       op.maxSize 最大长度限制， 默认 0 不限制
   * @param  {Boolean}      op.color   是否输出带颜色 边框 默认 true
   *
   * @return {Promise}      promise.then((r) => {})
   *                        r [Array]  格式化后的字符串数组
   */
  borderBox(ctx, op) {
    const options = Object.assign({
      align: 'center',
      padding: 1,
      maxSize: 0
    }, op);

    let strArr = [];

    // 文字所占长度
    let contentWidth = 0;
    let contentMaxWidth = COLUMNS - 4 - options.padding * 2;
    if (options.maxSize && options.maxSize < contentMaxWidth) {
      contentMaxWidth = options.maxSize;
    }

    if (typeof ctx === 'string') {
      strArr.push(ctx);
    } else if (fn.isArray(ctx)) {
      strArr = ctx;
    } else {
      throw new Error(`print.borderBox(ctx) runing error, param ctx must be string or array: ${ctx}`);
    }

    let fragStrArr = [];

    strArr.forEach((str) => {
      const strLen = fn.getStrSize(str);
      if (strLen > contentMaxWidth) {
        contentWidth = contentMaxWidth;
        fragStrArr = fragStrArr.concat(fn.splitStr(str, contentMaxWidth));
      } else {
        if (strLen > contentWidth) {
          contentWidth = strLen;
        }
        fragStrArr.push(str);
      }
    });

    strArr = fragStrArr;

    const r = [];
    const formatColor = (str) => {
      return chalk.yellow(str);
    };

    const headfootStr = ` ${formatColor(`+${fn.buildChar('-', contentWidth + options.padding * 2)}+`)}`;
    const contentLeft = ` ${formatColor('|')}${fn.makeSpace(options.padding)}`;
    const contentRight = `${fn.makeSpace(options.padding)}${formatColor('|')}`;


    r.push('');
    r.push(headfootStr);
    strArr.forEach((str) => {
      const main = fn.strAlign(str, {
        align: options.align,
        size: contentWidth
      });
      r.push(`${contentLeft}${main}${contentRight}`);
    });
    r.push(headfootStr);
    r.push('');

    return r;
  },
  log: {
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
          bgColor: 'bgBlue'
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
        'finished': 'green',
        'failed': 'red',
        'error': 'red',
        'start': 'cyan',
        'passed': 'green'
      }
    },
    silent(bool) {
      const self = this;
      self.source.silent = bool;
    },
    setLogLevel(level) {
      const self = this;
      self.source.logLevel = level;
    },
    init(op) {
      const self = this;
      if (typeof op === 'object') {
        if (op.type) {
          Object.assign(self.source.type, op.type);
        }
        if (op.maxSize) {
          Object.assign(self.source.maxSize, op.maxSize);
        }
        if (typeof op.silent === 'boolean') {
          Object.assign(self.source.silent, op.silent);
        }
        if (op.keyword) {
          Object.assign(self.source.keyword, op.keyword);
        }
      }

      const makeFn = function(key, ctx) {
        const fnName = key;
        let iPrint = key;
        let iColor = ctx;
        let bgColor = null;
        let colorCtrl;

        if (fnName === 'log') {
          throw 'print.msg.log can not be reset';
        }

        if (typeof ctx == 'object') {
          iPrint = ctx.name || key;
          iColor = ctx.color || 'white';
          bgColor = ctx.bgColor || 'bgBlack';
        }

        if (/^#/.test(iColor)) {
          colorCtrl = chalk.hex(iColor);
        } else {
          colorCtrl = chalk[iColor] || chalk.gray;
        }

        if (bgColor && colorCtrl[bgColor]) {
          colorCtrl = colorCtrl[bgColor];
        }

        const blanks = fn.makeSpace(self.source.maxSize - iPrint.length);
        const prefix = colorCtrl(` ${iPrint}${blanks} `);
        const subfix = colorCtrl(` ${fn.makeSpace(fn.getStrSize(iPrint))}${blanks} `);

        if (iPrint.length > self.source.maxSize) {
          self.source.maxSize = iPrint.length;
        }

        self[fnName] = function() {
          const iArgv = [...arguments];
          return self.log(arguments.callee.options, iArgv);
        };

        self[fnName].options = { prefix, subfix };
      };
      Object.keys(self.source.type).forEach((key) => {
        makeFn(key, self.source.type[key]);
      });
    },
    log(op, argv) {
      const self = this;
      let iArgv = [];
      let prefix;
      let subfix;
      if (typeof op === 'object' && 'prefix' in op && 'subfix' in op) {
        prefix = op.prefix;
        subfix = op.subfix;
      } else { // 非正常情况取默认值
        prefix = self.info.prefix;
        subfix = self.info.subfix;
        iArgv.push(op);
      }

      const pfSize = fn.getStrSize(prefix);
      const cntSize = COLUMNS - pfSize - 2;
      if (!fn.isArray(argv)) {
        iArgv.push(argv);
      } else {
        iArgv = iArgv.concat(argv);
      }

      const fArgv = [];
      iArgv.forEach((ctx) => {
        let cnt;
        const iType = typeof ctx;
        if (/^number|string|undefined$/.test(iType)) {
          cnt = `${ctx}`;
          if (fn.getStrSize(cnt) > cntSize) {
            let fragStr = cnt;
            while (fn.getStrSize(fragStr) > cntSize) {
              fArgv.push(fn.substr(fragStr, 0, cntSize));
              fragStr = fn.substr(fragStr, cntSize);
            }
            if (fn.getStrSize(fragStr) > 0) {
              fArgv.push(fragStr);
            }
          } else {
            fArgv.push(cnt);
          }
        } else {
          fArgv.push(cnt);
        }
      });

      iArgv = fArgv;

      const r = [];
      const hightlightIt = function (str) {
        let rStr = str;
        const { keyword } = self.source;
        Object.keys(keyword).forEach((key) => {
          const colorCtrl = chalk[keyword[key]] || chalk.yellow;
          rStr = fn.replaceKeyword(rStr, key, colorCtrl(key));
        });
        return rStr;
      };
      iArgv.forEach((ctx, i) => {
        let front = prefix;
        if (i !== 0) {
          front = subfix;
        }
        if (typeof ctx === 'string') {
          r.push(`${front} ${hightlightIt(ctx)}`);
        } else {
          if (i === 0) {
            r.push(`${front}`);
          }
          r.push(ctx);
        }
      });


      if (!self.source.silent) {
        console.log(r.join('\n'));
      }
      return r;
    }
  }
};

// 初始化
print.log.init();

print.fn = fn;

module.exports = print;
