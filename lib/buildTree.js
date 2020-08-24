const fn = require('./fn')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

const buildTree = function (op) {
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
  }
  const o = Object.assign(options, op)
  const deep = function (iPath, parentStr) {
    const list = readdirSync(iPath)
    let space = ''
    let iParentStr = ''

    if (!list.length) {
      return
    }
    iParentStr = parentStr.replace(/^(\s*)[a-zA-Z0-9._-]+/, '$1')
    space = iParentStr.split(/[-~]/)[0]
    // space = parentStr.replace(/(\s*\|)[-~]/, '$1');
    space = space.replace('`', ' ')

    if (/\w/gi.test(iParentStr)) {
      space += '  '
    }

    list.sort((a, b) => {
      const makeIndex = function (str) {
        if (/^\./.test(str)) {
          return 1
        } else if (~str.indexOf('.')) {
          return 2
        } else {
          return 3
        }
      }
      const aIdx = makeIndex(a)
      const bIdx = makeIndex(b)

      if (aIdx == bIdx) {
        return a.localeCompare(b)
      } else {
        return bIdx - aIdx
      }
    })

    list.forEach((filename, i) => {
      if (o.dirFilter && filename.match(o.dirFilter)) {
        return
      }
      const isDir = isDirectory(fn.formatUrl(path.join(iPath, filename)))
      const noDeep = ~o.dirNoDeep.indexOf(filename)
      let l1
      let l2
      let rStr = ''

      if (i == list.length - 1) {
        l1 = '`'
      } else {
        l1 = '|'
      }

      if (isDir) {
        if (noDeep) {
          l2 = '+'
        } else {
          l2 = '~'
        }
      } else {
        l2 = '-'
      }
      l1 = chalk.gray(l1)
      l2 = chalk.gray(l2)
      rStr = `${space + l1 + l2} ${filename}`

      r.push(rStr)

      if (isDir && !noDeep) {
        deep(fn.formatUrl(path.join(iPath, filename)), rStr)
      }
    })
  }
  const r = []
  let i = 0
  let len
  let space = ''
  let readdirSync
  let isDirectory

  if (o.dirList.length) {
    // 虚拟的
    // 处理下数据
    for (i = 0, len = o.dirList.length; i < len; i++) {
      o.dirList[i] = fn.formatUrl(
        path.join(o.dirList[i].replace(/[/\\]$|^[/\\]/, ''))
      )
    }
    if (o.path) {
      o.path = fn.formatUrl(path.join(o.path))
    }

    readdirSync = function (iPath) {
      let r = []
      if (o.path === '' && o.path == iPath) {
        o.dirList.forEach((oPath) => {
          const filename = oPath.split('/').shift()
          if (filename) {
            r.push(filename)
          }
        })
      } else {
        o.dirList.forEach((oPath) => {
          let filename
          if (oPath != iPath && oPath.substr(0, iPath.length) == iPath) {
            filename = oPath
              .substr(iPath.length + 1)
              .split('/')
              .shift()
            if (filename) {
              r.push(filename)
            }
          }
        })
      }

      // 排重
      if (r.length > 1) {
        r = Array.from(new Set(r))
      }

      // filter
      if (o.dirFilter) {
        r = r.filter((iPath) => (iPath.match(o.dirFilter) ? false : true))
      }

      return r
    }
    isDirectory = function (iPath) {
      let r = false
      for (let i = 0, len = o.dirList.length; i < len; i++) {
        if (
          o.dirList[i].substr(0, iPath.length) == iPath &&
          o.dirList[i].length > iPath.length
        ) {
          r = true
          break
        }
      }
      return r
    }
  } else {
    // 真实的
    readdirSync = function (iPath) {
      let list = []

      if (!fs.existsSync(iPath) || !fs.statSync(iPath).isDirectory()) {
        return list
      }

      try {
        list = fs.readdirSync(iPath)
      } catch (er) {}

      // filter
      if (o.dirFilter) {
        list = list.filter((iPath) => (iPath.match(o.dirFilter) ? false : true))
      }

      return list
    }

    isDirectory = function (iPath) {
      if (!fs.existsSync(iPath)) {
        return false
      }
      return fs.statSync(iPath).isDirectory()
    }
  }

  for (i = 0; i < o.frontSpace; i++) {
    space += ' '
  }

  if (o.frontPath) {
    const list = o.frontPath.split(/[\\/]/)
    list.forEach((str, i) => {
      let l1
      let l2
      if (i === 0) {
        l1 = ''
        l2 = ''
      } else {
        l1 = '`'
        l2 = '~ '
      }

      if (l1) {
        l1 = chalk.gray(l1)
      }
      if (l2) {
        l2 = chalk.gray(l2)
      }

      r.push(space + l1 + l2 + str)
      if (i > 0) {
        space += '   '
      }
    })
  } else if (o.path) {
    const iName = o.path.split(/[\\/]/).pop()
    r.push(space + iName)
  }

  deep(o.path, r.length && o.frontPath ? r[r.length - 1] : space)

  // 加点空格
  r.unshift('')
  r.push('')
  if (!o.silent) {
    console.log(r.join('\n'))
  }
  return r
}

module.exports = buildTree
