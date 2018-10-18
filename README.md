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
