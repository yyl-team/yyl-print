const chalk = require('chalk')
const fn = require('./fn')
const help = function (op) {
  if (!op) {
    return []
  }
  const accountMaxKeyLen = function (arr) {
    let maxLen = 0
    Object.keys(arr).forEach((key) => {
      if (maxLen < key.length) {
        maxLen = key.length
      }
    })
    return maxLen
  }
  const textIndent = function (txt, num) {
    let r = ''
    for (let i = 0, len = num; i < len; i++) {
      r += ' '
    }
    return r + txt
  }
  const compose = function (ikey, arr) {
    const r = []
    const maxkeyLen = accountMaxKeyLen(arr)
    let i
    let len
    r.push('')
    r.push(chalk.yellow(textIndent(`${ikey}:`, baseIndent)))

    Object.keys(arr).forEach((key) => {
      if (fn.isArray(arr[key])) {
        r.push(
          chalk.gray(textIndent(key, baseIndent * 2)) +
            textIndent(arr[key].shift(), maxkeyLen - key.length + 2)
        )
        for (i = 0, len = arr[key].length; i < len; i++) {
          r.push(textIndent(arr[key][i], maxkeyLen + 2 + baseIndent * 2))
        }
      } else {
        r.push(
          chalk.gray(textIndent(key, baseIndent * 2)) +
            textIndent(arr[key], maxkeyLen - key.length + 2)
        )
      }
    })

    r.push('')
    return r
  }
  const baseIndent = 2
  let r = []

  if (op.usage) {
    r.push(
      textIndent(
        `${chalk.yellow('Usage: ') + (op.usage || '')}${op.commands ? ' <commands>' : ''}${op.options ? ' <options>' : ''}`,
        baseIndent
      )
    )
  }

  if (op.commands) {
    r = r.concat(compose('Commands', op.commands))
  }

  if (op.options) {
    r = r.concat(compose('Options', op.options))
  }

  r.push('')
  r.unshift('')
  if (!op.silent) {
    console.log(r.join('\n'))
  }
  return r
}

module.exports = help
