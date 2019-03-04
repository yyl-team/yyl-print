/* eslint no-control-regex: 0 */
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const COLOR_REG = /(\u001b\[\d+m|\033\[[0-9;]+m)/g;

let COLUMNS = process.stdout.columns || 80;
process.stdout.on('resize', () => {
  COLUMNS = process.stdout.columns || 80;
});

const fn = {
  strWrap(str, size, indent) {
    const r = [];
    const lines = `${str}`
      .trim()
      .split(/[\r\n]+/)
      .map((t) => indent !== undefined ? t.trim(): t);

    let columnSize = 0;
    let lineIndent = 0;
    let lineNum = 0;
    const addLineNum = function () {
      lineNum++;
      if (lineNum === 1) {
        lineIndent = 0;
        columnSize = size;
      } else {
        lineIndent = indent || 0;
        columnSize = size - lineIndent;
      }
    };
    addLineNum();
    lines.forEach((line) => {
      if (fn.getStrSize(line) > columnSize) {
        let fragStr = line;

        while (fn.getStrSize(fragStr) > columnSize) {
          r.push(`${fn.makeSpace(lineIndent)}${fn.substr(fragStr, 0, columnSize)}`);
          fragStr = fn.substr(fragStr, columnSize);
          addLineNum();
        }
        if (fn.getStrSize(fragStr) > 0) {
          r.push(`${fn.makeSpace(lineIndent)}${fragStr}`);
          addLineNum();
        }
      } else {
        r.push(`${fn.makeSpace(lineIndent)}${line}`);
        addLineNum();
      }
    });

    return r;
  },
  replaceKeyword(str, keyword, result) {
    return str
      .replace(new RegExp(` ${keyword}$`, 'g'), ` ${result}`)
      .replace(new RegExp(`^${keyword} `, 'g'), `${result} `)
      .replace(new RegExp(` ${keyword} `, 'g'), ` ${result} `)
      .replace(new RegExp(` ${keyword}([:,.]+)`, 'g'), ` ${result}$1`);
  },
  formatUrl(url) {
    return url.split(path.sep).join('/');
  },
  hideProtocol(str) {
    if (typeof str === 'string') {
      return str.replace(/^http[s]?:/, '');
    } else {
      return str;
    }
  },
  type(ctx) {
    return Object.prototype.toString.call(ctx).replace(/^\[object (\w+)\]$/, '$1').toLowerCase();
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
  decolor(ctx) {
    if (fn.isArray(ctx)) {
      return ctx.map((str) => str.replace(COLOR_REG, ''));
    } else {
      return ctx.replace(COLOR_REG, '');
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
  },
  // 计时类函数
  cost: {
    source: {
      begin: 0,
      total: 0
    },
    start() {
      this.source.begin = new Date();
      return this.source.begin;
    },
    end() {
      this.source.total = new Date() - this.source.begin;
      return this.source.total;
    },
    format(total) {
      const cost = total || this.source.total;
      const min = Math.floor(cost / 1000 / 60);
      const sec = Math.floor(cost / 1000) % 60;
      const us = cost % 1000;
      let r = '';
      if (min) {
        r = `${r}${min}min`;
      }
      if (sec) {
        r = `${r} ${sec}s`;
      }
      if (us) {
        r = `${r} ${us}ms`;
      }
      r = r.trim();
      return r;
    }
  },
  timeFormat(t) {
    let r;
    if (t) {
      r = new Date(t);
    } else {
      r = new Date();
    }
    if (isNaN(r)) {
      throw `print.timeFormat(t) error, t: ${t} is Invalid Date`;
    }

    return `${r}`.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1');
  },
  dateFormat(t) {
    let r;
    const self = this;
    if (t) {
      r = new Date(t);
      if (typeof t === 'string' && !(/:/.test(t))) {
        r.setHours(0, 0, 0, 0);
      }
    } else {
      r = new Date();
    }
    if (isNaN(r)) {
      throw `print.dateFormat(t) error, t: ${t} is Invalid Date`;
    }

    const year = r.getFullYear();
    let mon = r.getMonth() + 1;
    if (mon < 10) {
      mon = `0${mon}`;
    }
    let date = r.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    return `${year}-${mon}-${date} ${self.timeFormat(r)}`;
  }
};

const print = {
  cleanScreen() {
    process.stdout.write('\x1Bc');
  },
  /**
   * 帮助文本输出
   * @param  {Object} op 设置参数
   *                     - usage   [string] 句柄名称
   *                     - commands [object] 操作方法列表 {key: val} 形式
   *                     - options  [object] 操作方法列表 {key: val} 形式
   * @return {Void}
   */
  help(op) {
    if (!op) {
      return [];
    }
    const accountMaxKeyLen = function(arr) {
      let maxLen = 0;
      for (const key in arr) {
        if (arr.hasOwnProperty(key) && maxLen < key.length) {
          maxLen = key.length;
        }
      }
      return maxLen;
    };
    const textIndent = function(txt, num) {
      let r = '';
      for (let i = 0, len = num; i < len; i++) {
        r += ' ';
      }
      return r + txt;
    };
    const compose = function(ikey, arr) {
      const r = [];
      const maxkeyLen = accountMaxKeyLen(arr);
      let i;
      let len;
      r.push('');
      r.push(chalk.yellow(textIndent(`${ikey}:`, baseIndent)));

      for (const key in arr) {
        if (arr.hasOwnProperty(key)) {
          if (fn.isArray(arr[key])) {
            r.push(
              chalk.gray(textIndent(key, baseIndent * 2)) +
              textIndent(arr[key].shift(), maxkeyLen - key.length + 2)
            );
            for (i = 0, len = arr[key].length; i < len; i++) {
              r.push(textIndent(arr[key][i], maxkeyLen + 2 + baseIndent * 2));
            }
          } else {
            r.push(
              chalk.gray(textIndent(key, baseIndent * 2)) +
              textIndent(arr[key], maxkeyLen - key.length + 2)
            );
          }
        }
      }

      r.push('');
      return r;
    };
    const baseIndent = 2;
    let r = [];

    if (op.usage) {
      r.push(
        textIndent(`${chalk.yellow('Usage: ') + (op.usage || '')  } <command>`, baseIndent)
      );
    }

    if (op.commands) {
      r = r.concat(compose('Commands', op.commands));
    }

    if (op.options) {
      r = r.concat(compose('Options', op.options));
    }

    r.push('');
    r.unshift('');
    if (!op.silent) {
      console.log(r.join('\n'));
    }
    return r;
  },
  /**
   * 目录输出
   */
  buildTree(op) {
    const options = {
      // 当前目录
      path: '',
      // 虚拟目录列表
      dirList: [],
      // 目录前缀
      frontPath: '',
      // 目录树前置空格数目
      frontSpace: 2,
      // 目录过滤
      dirFilter: null,
      // 不展开的文件夹列表
      dirNoDeep: [],
      silent: false
    };
    const o = Object.assign(options, op);
    const deep = function(iPath, parentStr) {
      const list = readdirSync(iPath);
      let space = '';
      let iParentStr = '';


      if (!list.length) {
        return;
      }
      iParentStr = parentStr.replace(/^(\s*)[a-zA-Z0-9._-]+/, '$1');
      space = iParentStr.split(/[-~]/)[0];
      // space = parentStr.replace(/(\s*\|)[-~]/, '$1');
      space = space.replace('`', ' ');

      if (/\w/ig.test(iParentStr)) {
        space += '  ';
      }

      list.sort((a, b) => {
        const makeIndex = function(str) {
          if (/^\./.test(str)) {
            return 1;
          } else if (~str.indexOf('.')) {
            return 2;
          } else {
            return 3;
          }
        };
        const aIdx = makeIndex(a);
        const bIdx = makeIndex(b);

        if (aIdx == bIdx) {
          return a.localeCompare(b);
        } else {
          return bIdx - aIdx;
        }
      });

      list.forEach((filename, i) => {
        if (o.dirFilter && filename.match(o.dirFilter)) {
          return;
        }
        const isDir = isDirectory(fn.formatUrl(path.join(iPath, filename)));
        const noDeep = ~o.dirNoDeep.indexOf(filename);
        let l1;
        let l2;
        let rStr = '';

        if (i == list.length - 1) {
          l1 = '`';
        } else {
          l1 = '|';
        }

        if (isDir) {
          if (noDeep) {
            l2 = '+';
          } else {
            l2 = '~';
          }
        } else {
          l2 = '-';
        }
        l1 = chalk.gray(l1);
        l2 = chalk.gray(l2);
        rStr = `${space + l1 + l2  } ${  filename}`;

        r.push(rStr);

        if (isDir && !noDeep) {
          deep(fn.formatUrl(path.join(iPath, filename)), rStr);
        }
      });
    };
    const r = [];
    let i = 0;
    let len;
    let space = '';
    let readdirSync;
    let isDirectory;

    if (o.dirList.length) { // 虚拟的
      // 处理下数据
      for (i = 0, len = o.dirList.length; i < len; i++) {
        o.dirList[i] = fn.formatUrl(path.join(o.dirList[i].replace(/[/\\]$|^[/\\]/, '')));
      }
      if (o.path) {
        o.path = fn.formatUrl(path.join(o.path));
      }

      readdirSync = function(iPath) {
        let r = [];
        if (o.path === '' && o.path == iPath) {
          o.dirList.forEach((oPath) => {
            const filename = oPath.split('/').shift();
            if (filename) {
              r.push(filename);
            }
          });
        } else {
          o.dirList.forEach((oPath) => {
            let filename;
            if (oPath != iPath && oPath.substr(0, iPath.length) == iPath) {
              filename = oPath.substr(iPath.length + 1).split('/').shift();
              if (filename) {
                r.push(filename);
              }
            }
          });
        }


        // 排重
        if (r.length > 1) {
          r = Array.from(new Set(r));
        }

        // filter
        if (o.dirFilter) {
          r = r.filter((iPath) => iPath.match(o.dirFilter) ? false : true);
        }

        return r;
      };
      isDirectory = function(iPath) {
        let r = false;
        for (let i = 0, len = o.dirList.length; i < len; i++) {
          if (
            o.dirList[i].substr(0, iPath.length) == iPath &&
            o.dirList[i].length > iPath.length
          ) {
            r = true;
            break;
          }
        }
        return r;
      };
    } else { // 真实的
      readdirSync = function(iPath) {
        let list = [];

        if (!fs.existsSync(iPath) || !fs.statSync(iPath).isDirectory()) {
          return list;
        }

        try {
          list = fs.readdirSync(iPath);
        } catch (er) {}

        // filter
        if (o.dirFilter) {
          list = list.filter((iPath) => iPath.match(o.dirFilter) ? false : true);
        }

        return list;
      };

      isDirectory = function(iPath) {
        if (!fs.existsSync(iPath)) {
          return false;
        }
        return fs.statSync(iPath).isDirectory();
      };
    }


    for (i = 0; i < o.frontSpace; i++) {
      space += ' ';
    }


    if (o.frontPath) {
      const list = o.frontPath.split(/[\\/]/);
      list.forEach((str, i) => {
        let l1;
        let l2;
        if (i === 0) {
          l1 = '';
          l2 = '';
        } else {
          l1 = '`';
          l2 = '~ ';
        }

        if (l1) {
          l1 = chalk.gray(l1);
        }
        if (l2) {
          l2 = chalk.gray(l2);
        }

        r.push(space + l1 + l2 + str);
        if (i > 0) {
          space += '   ';
        }
      });
    } else if (o.path) {
      const iName = o.path.split(/[\\/]/).pop();
      r.push(space + iName);
    }

    deep(o.path, r.length && o.frontPath ? r[r.length - 1] : space);

    // 加点空格
    r.unshift('');
    r.push('');
    if (!op.silent) {
      console.log(r.join('\n'));
    }
    return r;
  },

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
      maxSize: 0,
      silent: false
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

    if (!op.silent) {
      console.log(r.join('\n'));
    }
    return r;
  },
  log: {
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
        'finished': 'green',
        'failed': 'red',
        'error': 'red',
        'start': 'cyan',
        'passed': 'green'
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
        Object.keys(op).forEach((key) => {
          if (key in self.source) {
            if (/object|array/.test(fn.type(self.source[key]))) {
              self.source[key] = Object.assign(self.source[key], op[key]);
            } else {
              self.source[key] = op[key];
            }
          }
        });
      }

      const makeFn = function(key, ctx) {
        const fnName = key;
        let iPrint = key;
        let colorCtrl;

        if (fnName === 'log') {
          throw 'print.msg.log can not be reset';
        }

        if (typeof ctx == 'object') {
          iPrint = ctx.name || key;
          if (typeof ctx.color === 'function') {
            colorCtrl = ctx.color;
          } else {
            colorCtrl = chalk[ctx.color] || chalk.write;
            if (ctx.bgColor) {
              colorCtrl = colorCtrl[ctx.bgColor] || colorCtrl.bgBlack;
            }
          }
        } else if (typeof ctx === 'function') {
          colorCtrl = ctx;
        } else if (typeof ctx === 'string') {
          colorCtrl = chalk[ctx] || chalk.write;
          colorCtrl = colorCtrl.bgBlack;
        } else {
          colorCtrl = chalk.wrigt.bgBlack;
        }

        if (iPrint.length > self.source.maxSize) {
          self.source.maxSize = iPrint.length;
        }

        const blanks = fn.makeSpace(self.source.maxSize - iPrint.length);
        const prefix = colorCtrl(` ${iPrint}${blanks} `);
        const subfix = colorCtrl(` ${fn.makeSpace(fn.getStrSize(iPrint))}${blanks} `);



        self[fnName] = function() {
          const iArgv = [...arguments];
          return self.log(arguments.callee.options, iArgv);
        };

        self[fnName].options = { prefix, subfix, type: key };
      };

      if (self.source.type) {
        Object.keys(self.source.type).forEach((key) => {
          makeFn(key, self.source.type[key]);
        });
      }

      return self.source;
    },
    log(op, argv) {
      const self = this;
      let iArgv = [];
      let prefix;
      let subfix;
      let type;
      if (typeof op === 'object' && 'prefix' in op && 'subfix' in op) {
        prefix = op.prefix;
        subfix = op.subfix;
        type = op.type;
      } else { // 非正常情况取默认值
        prefix = self.info.prefix;
        subfix = self.info.subfix;
        type = 'info';
        iArgv.push(op);
      }

      if (
        self.source.logLevel === 1 &&
        self.source.mode1.ignoreTypes.indexOf(type) !== -1
      ) {
        return;
      }

      if (
        self.source.logLevel === 0 &&
        self.source.mode0.allowTypes.indexOf(type) === -1
      ) {
        return;
      }

      const pfSize = fn.getStrSize(prefix);
      const cntSize = COLUMNS - pfSize - 2;
      if (!fn.isArray(argv)) {
        iArgv.push(argv);
      } else {
        iArgv = iArgv.concat(argv);
      }

      let fArgv = [];
      iArgv.forEach((ctx) => {
        let cnt;
        const iType = fn.type(ctx);
        if (/^number|string|undefined$/.test(iType)) {
          cnt = `${ctx}`;
          fArgv = fArgv.concat(fn.strWrap(cnt, cntSize));
        } else if (iType === 'error') {
          fArgv = fArgv.concat(fn.strWrap(ctx.stack, cntSize));
        } else if (iType === 'object') {
          fArgv = fArgv.concat(fn.strWrap(JSON.stringify(ctx, null, 2), cntSize));
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

      if (self.source.logLevel === 1) {
        if (
          prefix === self.__mark.preType &&
          self.source.mode1.abridgeIgnores.indexOf(op.type) === -1
        ) {
          const stream = process.stderr;
          let padding = self.__mark.preRowCount || 0;
          while (padding) {
            readline.moveCursor(stream, 0, -1);
            readline.clearLine(stream, 1);
            padding--;
          }
        }
      }

      self.__mark.preType = prefix;
      self.__mark.preRowCount = r.length;

      if (!self.source.silent) {
        readline.clearLine(process.stderr, 1);
        readline.cursorTo(process.stderr, 0);
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
