import { start, finished } from "./lib/progress"

interface Fn {
  /**
   * 文字换行处理
   * @param  str    原始字符串
   * @param  size   文字换行尺寸
   * @param  indent 前置空格
   */
  strWrap(str: string, size: number, indent: number): string[]
  /**
   * 关键字替换
   * @param  str     待替换字符串
   * @param  keyword 待替换的关键字
   * @param  result  替换后的关键字
   */
  replaceKeyword(str: string, keyword: string, result: string): string
  /**
   * url 格式化 - '\' 转成 '/'
   * @param  url 待格式化 url
   */
  formatUrl(url: string): string
  /**
   * 去掉 url 协议
   * @param url 待格式化 url
   */
  hideProtocol(url: string): string
  /**
   * 检查 对象 类型
   * @param ctx 待检测对象
   */
  type(ctx: any): string
  /**
   * 检测对象是否数组
   * @param ctx 待检测对象
   */
  isArray(ctx: any): boolean
  /**
   * 填充字符
   * @param char 用于填充的字符
   * @param num 填充数量
   */
  buildChar(char: string, num: number): string
  /**
   * 填充空格
   * @param num 填充数量
   */
  makeSpace(num: number): string
  /**
   * 去色
   * @param ctx 待去色字符串
   */
  decolor(ctx: string): string
  /**
   * 字符串居中处理
   * @param str 待格式化字符串
   * @param op  选项
   */
  strAlign(str: string, op: { size: number, align: EAlignType}): string
  /**
   * 获取字符串长度（包含着色字符串）
   * @param str 原始字符串
   */
  getStrSize(str: string): number
  /**
   * 截取字符串长度（包含着色字符串）
   * @param str   原始字符串
   * @param begin 开始位置
   * @param len   截取长度
   */
  substr(str: string, begin: number, len: number): string
  /**
   * 截取字符串长度（包含着色字符串）
   * @param str   原始字符串
   * @param begin 开始位置
   */
  substr(str: string, begin: number): string
  /**
   * 字符串切割（包含着色字符串）
   * @param str 原始字符串
   * @param maxLen 每行最大容纳字符串数量
   */
  splitStr(str: string, maxLen: number): string[]
  cost: {
    /**
     * 计时开始
     */
    start(): void
    /**
     * 计时结束
     */
    end(): void
    /**
     * 时间格式化 返回 YYYY-MM-DD hh:mm:ss
     * @param time 传入时间
     */
    format(time: Date | number): string
    /**
     * 时间格式化 返回 end - start 的时间长度 YYYY-MM-DD hh:mm:ss
     */
    format(): string
    /**
     * 时间格式化 返回 hh:mm:ss
     * @param time 传入时间
     */
    timeFormat(time: Date | number): string
    /**
     * 时间格式化 返回 end - start 的时间长度 hh:mm:ss
     */
    timeFormat(): string
    /**
     * 时间格式化 返回 YYYY-MM-DD
     * @param time 传入时间
     */
    dateFormat(time: Date | number): string
    /**
     * 时间格式化 返回 end - start 的时间长度 YYYY-MM-DD
     */
    dateFormat(): string
  }
}

interface ProgressOption {
  /** 刷新间隔 */
  interval?: number
  /** log 等级 */
  logLevel?: number
  /** 静默模式 */
  silent?: boolean
  icon?: {
    progress?: {
      chats: string[],
      color: (...args: any) => any
    },
    finished?: {
      chats: string[]
      color: (...args: any) => any
    }
  }
}

/** 进度模块 */
interface Progress {
  /** 初始化 */
  init(op?:ProgressOption): void
  /** 开始执行 */
  start(...args: any[]): void
  /** 日志打印 */
  log(...args: any[]): void
  /** 执行完成 */
  finished(...args: any[]): void
}

interface Print {
  fn: Fn
  /**
   * 清除当前 终端屏幕
   */
  cleanScreen(): void
  /**
   * 显示帮助信息
   * @param op 选项
   */
  help(op: {
    usage: string,
    commands: { [key: string]: string}
    options: { [key: string]: string}
  }): string

  /**
   * 建立目录树
   * @param op 选项
   */
  buildTree(op: {
    path: string,
    dirList?: string[],
    frontPath?: string,
    frontSpace?: number,
    dirFilter?: RegExp,
    dirNoDeep?: [],
    silent?: boolean
  }): string[]

  /**
   * 打印带边框字符串
   * @param ctx 字符串
   * @param op  选项
   */
  borderBox(
    ctx: string,
    op?: {
      align?: EAlignType,
      padding?: number,
      maxSize?: number,
      color: boolean,
      silent: boolean
    }
  ): string[]

  log: {
    /**
     * 设置log 是否静默输出
     * @param isSilent 是否静默输出
     */
    silent(isSilent: boolean): void
    /**
     * 设置 log 等级
     * @param logLevel log 等级 0|1|2
     */
    setLogLevel(logLevel: LogLevel): void
    /**
     * log 初始化
     * @param op 选项
     */
    init(op: LogInitOptions): LogInitOptions
    /**
     * success 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    success(ctx: any | any[]): void
    /**
     * error 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    error(ctx: any | any[]): void
    /**
     * warn 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    warn(ctx: any | any[]): void
    /**
     * add 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    add(ctx: any | any[]): void
    /**
     * remove 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    remove(ctx: any | any[]): void
    /**
     * update 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    update(ctx: any | any[]): void
    /**
     * info 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    info(ctx: any | any[]): void
    /**
     * del 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    del(ctx: any | any[]): void
    /**
     * cmd 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    cmd(ctx: any | any[]): void
    /**
     * 自定义 类 log 打印
     * @param ctx 打印内容 any | any[]
     */
    [type: string]: (ctx: any | any[]) => void
  }
  progress: Progress
}

interface LogInitOptions {
  type?: {
    [type: string]: {
      name: string
      color: Color 
      bgColor?: Color
    }
  },
  maxSize?: number,
  silent?: boolean,
  logLevel?: LogLevel,
  keyword?: {
    [keyword: string]: string
  },
  // logLevel 1 config
  mode1?: {
    // 在白名单内的 type 不会折叠
    abridgeIgnores?: string[],
    // 不作输出的类型
    ignoreTypes?: string[]
  },
  // logLevel 1 config
  mode0?: {
    // 允许输出的类型
    allowTypes?: string[]
  }
}

type Color = () => string | string

enum LogLevel {
  SILENT = 0,
  NORMAL = 1,
  DETAIL = 2
}

enum EAlignType {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

declare const print: Print
export = print