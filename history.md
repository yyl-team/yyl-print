# 版本记录
## 0.9.1 (2020-08-25)
* feat: 新增 `print.lite()` 方法
## 0.9.0 (2020-08-24)
* feat: 新增 `print.progress` 方法
## 0.8.0 (2020-04-13)
* feat: 模块重新划分

## 0.7.5 (2019-12-11)
* fix: 修复 print.borderBox(, op) 不传 op 会报错问题

## 0.7.4 (2019-09-25)
* feat: 添加 对应 types 文件

## 0.7.3 (2019-03-11)
* fix: 修复 `fn.substr()` 对于 `chalk.red.bold('hhh')` 类型分割错误问题

## 0.7.2 (2019-03-04)
* feat: 调整 `print.log.init(config)` 中 `config.mode1.abridgeIgnores` 默认参数为 `['success', 'error', 'warn']`
* feat: 调整 `print.log.update` 默认色

## 0.7.1 (2019-02-20)
* fix: 添加 `chalk` 依赖

## 0.7.0 (2019-02-19)
* feat: 新增 `print.fn.dateFormat()` 方法

## 0.6.4 (2019-02-14)
* fix: 修复 在 `docker` 环境下 bug

## 0.6.3 (2019-02-11)
* fix: 修复 `print.log.init()` `mode1`, `mode0`, `logLevel` 设置不生效问题

## 0.6.2 (2019-02-01)
* fix: 修复 `print.log.info()` 当 当前行 有文字时， 显示不正确问题

## 0.6.1 (2019-02-01)
* feat: 新增 `print.log.init({ mode0 })` logLevel 0 配置
* feat: 新增 `print.log.init({ mode0.allowTypes })` logLevel 0 配置

## 0.6.0 (2019-02-01)
* feat: 新增 `print.fn.strWrap()` 方法
* feat: 新增 `print.log.info()` 对 error 对象， object 对象的输出支持

## 0.5.2 (2019-01-31)
* feat: 补全 `print.fn` 方法
* feat: 新增 `print.fn.cost.start()` 方法
* feat: 新增 `print.fn.cost.end()` 方法
* feat: 新增 `print.fn.cost.format()` 方法
* feat: 新增 `print.fn.timeFormat()` 方法
* feat: 新增 `print.fn.hideProtocol()` 方法
* feat: 新增 `print.fn.replaceKeyword()` 方法
* feat: 新增 `print.fn.formatUrl()` 方法
* feat: 新增 `print.fn.isArray()` 方法
* feat: 新增 `print.fn.buildChar()` 方法
* feat: 新增 `print.fn.makeSpace()` 方法
* feat: 新增 `print.fn.decolor()` 方法
* feat: 新增 `print.fn.strAlign()` 方法
* feat: 新增 `print.fn.getStrSize()` 方法
* feat: 新增 `print.fn.substr()` 方法
* feat: 新增 `print.fn.splitStr()` 方法
* feat: 新增 `print.fn.splitStr()` 方法

## 0.5.1 (2019-01-31)
* feat: 新增 `print.log.init({ mode1 })` logLevel 1 配置
* feat: 新增 `print.log.init({ mode1.abridgeIgnores })` logLevel 1 配置
* feat: 新增 `print.log.init({ mode1.ignoreTypes })` logLevel 1 配置
* [DEL] 去掉 `print.log.init({ abridgeIgnores })` `abridgeIgnores` 变量 logLevel = 1 时 log 折叠的 排除名单

## 0.5.0 (2019-01-30)
* feat: 新增 `print.log.init({ abridgeIgnores })` `abridgeIgnores` 变量 logLevel = 1 时 log 折叠的 排除名单

## 0.4.0 (2019-01-28)
* feat: 新增 `print.cleanScreen()`

## 0.3.1 (2019-01-28)
* fix: 修复 `print.log.init(op)` 当 `op.type.any.text` 大于 4 长度时会报错的问题

## 0.3.0 (2019-01-13)
* feat: 新增 `print.buildTree()`
* feat: 新增 `print.help()`
* feat: 新增 `print.log` 新增 `logLevel 1` 模式

## 0.2.0 (2018-10-25)
* feat: 新增 `print.log`, `print.fn`

## 0.1.0 (2018-10-18)
* feat: 诞生
* feat: 新增 `print.borderBox()`

