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
 * @param  {Object} op.type     log 类型
 * @param  {Number} op.maxSize  标题最大字数限制
 * @param  {Number} op.silent   是否禁止自动打印
 * @param  {Number} op.logLevel 日志级别 0|1|2
 * @param  {Object} op.keyword  高亮关键字配置
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

## print.buildTree()
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
