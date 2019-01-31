# print SDK
## print.borderBox(ctx, op)
```
/**
 * @param {String|Array} ctx        待处理字符
 * @param {Object}       op         参数
 * @param {String}       op.align   对齐方式 left|center|right, 默认 center
 * @param {Number}       op.padding 左右空格 默认 1
 * @param {Number}       op.maxSize 最大长度限制， 默认 0 不限制
 * @param {Boolean}      op.color   是否输出带颜色 边框 默认 true
 *
 * @return {Promise}     promise.then((r) => {})
 *                       r [Array]  格式化后的字符串数组
 */
print.borderBox(ctx, op);
```

## print.log.init(op)
```
/**
 * log 初始化
 * @param  {Object} op 配置参数
 * @param  {Object} op.type                 log 类型
 * @param  {Number} op.maxSize              标题最大字数限制
 * @param  {Number} op.silent               是否禁止自动打印
 * @param  {Number} op.logLevel             日志级别 0|1|2
 * @param  {Object} op.keyword              高亮关键字配置
 * @param  {Object} op.mode1                loglevel = 1 时的配置
 * @param  {Array}  op.mode1.abridgeIgnores 在白名单内的 type 不会折叠, 默认值 ['success']
 * @param  {Array}  op.mode1.ignoreTypes    不作输出的类型列表, 默认值 ['info']
 */
print.log.init(op);
```
### 例子
```
// 配置 类型
print.log.init({
  type: {
    'test': {
      'name': 'TEST',
      'color': 'white',
      'bgColor': 'bgBlue'
    }
  }
});

// 配置关键字
print.log.init({
  keyword: {
    'hello': 'yellow'
  }
});
```
## print.log.setLogLevel(level)
```
/**
 * 配置 log 等级
 * @param  {Number} level log 等级 0|1|2
 * @return {Void}
 */
print.log.setLogLevel(level)
```
## print.log.silent(silent)
```
/**
 * 配置 log 是否静默输出
 * @param  {boolean} silent 是否静默输出
 * @return {Void}
 */
print.log.silent(silent);
```

## print.log.info(...argv)
```
/**
 * 打印log
 * @param  {Array} argv anything
 * @return {Array} log 输出的 数组
 */
print.log.info(...argv);
```
## print.log.success(...argv)
同上


## print.log.error(...argv)
同上

## print.log.warn(...argv)
同上

## print.log.add(...argv)
同上

## print.log.remove(...argv)
同上

## print.log.update(...argv)
同上

## print.log.del(...argv)
同上

## print.log.cmd(...argv)
同上

## print.help(op)
```
/**
 * 帮助文本输出
 * @param  {Object} op 设置参数
 *                     - usage   [string] 句柄名称
 *                     - commands [object] 操作方法列表 {key: val} 形式
 *                     - options  [object] 操作方法列表 {key: val} 形式
 * @return {Void}
 */
print.help(op)
```

## print.buildTree(op)
```
/**
 * 目录输出
 * @param  {String}  op.path       当前目录
 * @param  {Array}   op.dirList    虚拟目录列表
 * @param  {String}  op.frontPath  目录前缀
 * @param  {Number}  op.frontSpace 目录树前置空格数目
 * @param  {RegExp}  op.dirFilter  目录过滤
 * @param  {Array}   op.dirNoDeep  不展开的文件夹列表
 * @param  {Boolean} op.silent     不打印
 * @return {Array}   logs          需要打印的 字符串
 */
print.buildTree(op)
```

## print.cleanScreen()
```
/**
 * 清除当前cmd 内容
 * @return {Void}
 */
print.cleanScreen();
```

## print.fn.cost
计时用类
```
/**
 * 开始计时
 * @return {Date} now 当前时间
 */
print.fn.cost.start()
```

```
/**
 * 结束计时
 * @return {Date} now 当前时间
 */
print.fn.cost.end()
```

```
/**
 * 将耗时 格式化成 'x min x s x ms' 形式
 * @return {String} now 格式化后字符串
 */
print.fn.cost.format()
```
## print.fn.timeFormat()
```
/**
 * 将传入时间|当前时间格式化成 `00:00:00` 的形式
 * @param  {undefined|Date} 传入时间
 * @return {String}         格式化后字符串
 */
print.fn.timeFormat(d);
```

## print.fn.replaceKeyword(str, keyword, result)
```
/**
 * @param  {String} str     输入的文章
 * @param  {String} keyword 关键字
 * @param  {String} result  期望替换成的结果
 * @return {String} output  替换后的字符串
 */
print.fn.replacekeyword(str, keyword, result)
```

## print.fn.formatUrl(url)
```
/**
 * a\b\c => a/b/c
 * @param  {String} url 需要格式化的地址
 * @return {String} r   格式化后地址
 */
print.fn.formatUrl(url)
```

## print.fn.isArray(ctx)
```
/**
 * 判断是否 array 类型
 * @param  {Anything} ctx
 * @return {Boolean}  r
 */
print.fn.isArray(ctx)
```

## print.fn.buildChar(char, num)
```
/**
 * 生成 num 个 char 字符
 * @param  {String} char
 * @param  {Number} num
 * @return {String} r
 */
print.fn.buildChar(char, num)
```

## print.fn.makeSpace(num)
```
/**
 * 生成 num 个 空格
 * @param  {Number} num
 * @return {String} r
 */
print.fn.makeSpace(num)
```

## print.fn.decolor(ctx)
```
/**
 * 去掉字符串 颜色
 * @param  {String} ctx
 * @return {String} r   去色后结果
 */
print.fn.decolor(ctx)
```

## print.fn.strAlign(str, op)
```
/**
 * 格式化文字(居中, 左, 右)
 * @param  {String} str
 * @param  {Object} op       配置
 * @param  {Number} op.size  所占字符数
 * @param  {Number} op.align left|center|right
 * @return {Number} r        输出结果
 */
print.fn.strAlign(str, op)
```

## print.fn.getStrSize(str)
```
/**
 * 获取带颜色的字符串长度
 * @param  {String} str
 * @return {Number} length
 */
print.fn.getStrSize(str)
```

## print.fn.substr(str, begin, len)
```
/**
 * 截取带颜色文字的长度
 * @param  {String} str   带颜色字符串
 * @param  {Number} begin 开始位置
 * @param  {Number} len   长度
 * @return {String} r     截取后的字符串
 */
print.fn.substr(str, begin, len)
```

## print.fn.splitStr(str, maxLen)
```
/**
 * 切割文字为数组
 * @param  {String} str    字符
 * @param  {Number} maxLen 最大长度
 * @return {Array}  arr    切割结果
 */
print.fn.splitStr(str, maxLen)
```

## print.fn.hideProtocol(str)
```
/**
 * 去掉 url 上的 https or http
 * @param  {String} str
 * @return {String} 去掉后的字符串
 */
print.fn.hideProtocol(str)
```
