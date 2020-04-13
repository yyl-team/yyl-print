const { COLUMNS } = require('./const')
const fn = require('./fn')
const chalk = require('chalk')

const borderBox = function (ctx, op) {
  const options = Object.assign(
    {
      align: 'center',
      padding: 1,
      maxSize: 0,
      silent: false
    },
    op
  )
  let strArr = []

  // 文字所占长度
  let contentWidth = 0
  let contentMaxWidth = COLUMNS - 4 - options.padding * 2
  if (options.maxSize && options.maxSize < contentMaxWidth) {
    contentMaxWidth = options.maxSize
  }

  if (typeof ctx === 'string') {
    strArr.push(ctx)
  } else if (fn.isArray(ctx)) {
    strArr = ctx
  } else {
    throw new Error(
      `print.borderBox(ctx) runing error, param ctx must be string or array: ${ctx}`
    )
  }

  let fragStrArr = []

  strArr.forEach((str) => {
    const strLen = fn.getStrSize(str)
    if (strLen > contentMaxWidth) {
      contentWidth = contentMaxWidth
      fragStrArr = fragStrArr.concat(fn.splitStr(str, contentMaxWidth))
    } else {
      if (strLen > contentWidth) {
        contentWidth = strLen
      }
      fragStrArr.push(str)
    }
  })

  strArr = fragStrArr

  const r = []
  const formatColor = (str) => {
    return chalk.yellow(str)
  }

  const headfootStr = ` ${formatColor(
    `+${fn.buildChar('-', contentWidth + options.padding * 2)}+`
  )}`
  const contentLeft = ` ${formatColor('|')}${fn.makeSpace(options.padding)}`
  const contentRight = `${fn.makeSpace(options.padding)}${formatColor('|')}`

  r.push('')
  r.push(headfootStr)
  strArr.forEach((str) => {
    const main = fn.strAlign(str, {
      align: options.align,
      size: contentWidth
    })
    r.push(`${contentLeft}${main}${contentRight}`)
  })
  r.push(headfootStr)
  r.push('')

  if (!options.silent) {
    console.log(r.join('\n'))
  }
  return r
}

module.exports = borderBox
