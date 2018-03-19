import * as _ from 'lodash'
import DateTimeFormat = Intl.DateTimeFormat

export function isPending(state, key): boolean {
  return _.get(state, '$view.$pending') ? _.get(state, '$view.$pending')[key] : false
}

export function changeTitle(title) {
  document.title = title
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'display: none; width: 0; height: 0;'
  iframe.src = 'https://static.iqycamp.com/images/logo.png'
  //iframe.src = require('./img/text_delete.png');
  const listener = () => {
    setTimeout(() => {
      iframe.removeEventListener('load', listener)
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 0)
    }, 0)
  }
  iframe.addEventListener('load', listener)
  document.body.appendChild(iframe)
}

var chnUnitChar = ['', '十', '百', '千']
var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

function SectionToChinese(section) {
  var strIns = '', chnStr = ''
  var unitPos = 0
  var zero = true
  while(section > 0) {
    var v = section % 10
    if(v === 0) {
      if(!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos++
    section = Math.floor(section / 10)
  }
  return chnStr
}

export function scroll(target, container, delta) {
  if(document.querySelector(target)) {
    let y = document.querySelector(target).offsetTop
    if(!!delta) {
      y = y + delta
    }
    if(document.querySelector(container)) {
      document.querySelector(container).scrollTop = y
    }
  }
}

export function scrollToHeight(target, height) {
  if(document.querySelector(target)) {
    let y = document.querySelector(target).offsetTop
    window.scrollTo(0, y + height)
  }
}

// 数字转汉字
export function NumberToChinese(num) {
  var unitPos = 0
  var strIns = '', chnStr = ''
  var needZero = false

  if(num === 0) {
    return chnNumChar[0]
  }

  while(num > 0) {
    var section = num % 10000
    if(needZero) {
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = SectionToChinese(section)
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = (section < 1000) && (section > 0)
    num = Math.floor(num / 10000)
    unitPos++
  }

  return chnStr
}

// 字符串截取方法
export function splitText(text: string, length: number) {
  if(text) {
    let cleanText = removeHtmlTags(text)
    return cleanText.length <= length ? text : cleanText.slice(0, length) + '...'
  }
}

export function removeHtmlTags(str) {
  str = _.trim(str)
  // 去除 html 标签
  str = str.replace(/(&lt;)(&#47;)?[^(&gt;)]*(&gt;)/g, '')
  str = str.replace(/<\/?[^>]*>/g, '')
  // 去除实体字符
  str = str.replace(/&[^;]+;/g, '')
  return str
}

export function filterHtmlTag(content) {
  return _.isString(content) ? content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '') : ''
}

/**
 * 描述：ios系统，1.点击石墨外链，进入石墨,2.点击系统返回按钮,3.此时签名会失败，支付会报url（石墨的）未注册
 * 解决方案：如果监听到ios的后退操作，并且configUrl已经是石墨的url了（下面的方法update的configUrl)
 * 就刷新页面
 */
export function fixIosShimoBug() {
  if(window.ENV.osName === 'ios') {
    window.addEventListener('popstate', function(e) {
      if(window.ENV.configUrl.indexOf('shimo.im') != -1) {
        // alert("刷新:" + window.location.href + "," + document.referrer + ":" + document.title);
        window.location.href = window.location.href
      }
    })
  }
}

/**
 * 跳转到其他外链地址
 * @param url 检查一下这个外链是不是shimo，如果是石墨，并且是ios系统，就修改configUrl
 */
export function goOtherWeb(url) {
  if(window.ENV.osName === 'ios' && url.indexOf('shimo.im') != -1) {
    window.ENV.configUrl = url
  }
  window.location.href = url
}

export class GoodsType {
  public static SYSTEMATISM = 'systematism'
  public static FRAG_COURSE = 'fragment_rise_course'
  public static FRAG_MEMBER = 'fragment_member'
  public static FRAG_CAMP = 'fragment_camp'
}

export class CouponCategory {
  /**
   * 只能用来购买会员
   */
  public static ONLY_MEMBERSHIP = 'ELITE_RISE_MEMBER'
  /**
   * 只能用来够买线下工作坊
   */
  public static ONLY_WORKSHOP = 'OFF_LINE_WORKSHOP'
}

/**
 * 支付按钮状态
 */
class ButtonStatus {
  /**
   * 需要支付的按钮组
   */
  private paymentGroup: [number]
  /**
   * 不需要支付的按钮组
   */
  private notPaymentGroup: [number]

  constructor() {
    this.paymentGroup = []
    this.notPaymentGroup = [1, 2, 3, 4, 5, 6]
  }

  /**
   * 按钮状态是否有效
   * @param status 按钮状态
   * @returns {boolean} 按钮状态是否有效
   */
  public isValid(status: number): boolean {
    if(status === -1) {
      return false
    }
    for(let i = 0; i < this.paymentGroup.length; i++) {
      if(status === this.paymentGroup[i]) {
        return true
      }
    }
    for(let i = 0; i < this.notPaymentGroup.length; i++) {
      if(status === this.notPaymentGroup[i]) {
        return true
      }
    }
    return false
  }

  /**
   * 是否必须刷新
   * @param status 按钮状态
   * @returns {boolean} 是否要刷新
   */
  public mustRefresh(status: number): boolean {
    for(let i = 0; i < this.paymentGroup.length; i++) {
      if(status === this.paymentGroup[i]) {
        /** 如果：LandingPage的url不是空 && LandingPage的url不是当前的url && 是ios系统，则刷新页面  */
        return !_.isEmpty(window.ENV.configUrl) && window.ENV.configUrl !== window.location.href && window.ENV.osName === 'ios'
      }
    }
    return false
  }
}

export let buttonStatus = new ButtonStatus()

function scrollLimit(e) {
  let _this = this
  if(_this.scrollTop >= _this.scrollHeight - _this.clientHeight - 1) {
    _this.scrollTop = _this.scrollHeight - _this.clientHeight - 1
  } else if(_this.scrollTop <= 1) {
    _this.scrollTop = 1
  }
}

export function unScrollToBorder(selector) {
  let dom = document.querySelector(selector)
  if(dom) {
    dom.addEventListener('scroll', scrollLimit)
    return () => {
      dom.removeEventListener('scroll', scrollLimit)
    }
  } else {
    // return 空函数，防止报错
    return () => {}
  }
}

export function randomStr(len) {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = $chars.length
  var pwd = ''
  for(let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function isAndroid() {
  return window.navigator.userAgent.indexOf('Android') > 0
}

export function isIos() {
  return window.navigator.userAgent.indexOf('iPhone') > 0 || window.navigator.userAgent.indexOf('iPad') > 0
}

export function formatDate(date, fmt) {
  if(date instanceof Date) {
    var o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds() //毫秒
    }
    if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for(var k in o)
      if(new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    return fmt
  } else {
    throw 'first param is not a date'
  }
}

