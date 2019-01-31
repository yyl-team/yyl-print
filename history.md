# 版本记录
## 0.5.1 (2019-01-31)
* [ADD] 新增 `print.log.init({ mode1 })` logLevel 1 配置
* [ADD] 新增 `print.log.init({ mode1.abridgeIgnores })` logLevel 1 配置
* [ADD] 新增 `print.log.init({ mode1.ignoreTypes })` logLevel 1 配置
* [DEL] 去掉 `print.log.init({ abridgeIgnores })` `abridgeIgnores` 变量 logLevel = 1 时 log 折叠的 排除名单

## 0.5.0 (2019-01-30)
* [ADD] 新增 `print.log.init({ abridgeIgnores })` `abridgeIgnores` 变量 logLevel = 1 时 log 折叠的 排除名单

## 0.4.0 (2019-01-28)
* [ADD] 新增 `print.cleanScreen()`

## 0.3.1 (2019-01-28)
* [FIX] 修复 `print.log.init(op)` 当 `op.type.any.text` 大于 4 长度时会报错的问题

## 0.3.0 (2019-01-13)
* [ADD] 新增 `print.buildTree()`
* [ADD] 新增 `print.help()`
* [ADD] 新增 `print.log` 新增 `logLevel 1` 模式

## 0.2.0 (2018-10-25)
* [ADD] 新增 `print.log`, `print.fn`

## 0.1.0 (2018-10-18)
* [ADD] 诞生
* [ADD] 新增 `print.borderBox()`

