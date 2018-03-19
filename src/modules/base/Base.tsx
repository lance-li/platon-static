import * as React from 'react'
import { connect } from 'react-redux'
import { isPending, fixIosShimoBug } from 'utils/helpers'
import { Toast, Dialog } from 'react-weui'
import { set, alertMsg } from 'reduxutil/actions'
import { config } from '../helpers/JsConfig'
import AssetImg from '../../components/AssetImg'

const P = 'base'
const LOAD_KEY = `${P}.loading`
const SHOW_MODAL_KEY = `${P}.showModal`
const { Alert } = Dialog
import { toLower, get } from 'lodash'
import { pget } from 'utils/request'
import Activity from '../../components/Activity'
import UA from 'ua-device'
import './Base.less'
import $ from 'jquery'
require("../../components/progress/circle-progress.js")


$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName)
      if(callback) callback()
    })
    return this
  }
})

@connect(state => state)
export default class Main extends React.Component<any, any> {

  constructor() {
    super()
    this.state = {
      alert: {
        buttons: [
          {
            label: '我知道了',
            onClick: this.closeAnswer.bind(this)
          }
        ]
      },
      windowsClient: false,
      activityMsg: false,
      showPage: false
    }
    window.ENV.Detected = new UA(window.navigator.userAgent)
    window.ENV.osName = toLower(get(window, 'ENV.Detected.os.name'))
    window.ENV.osVersion = toLower(get(window, 'ENV.Detected.os.version.original'))
    window.ENV.systemInfo = window.ENV.osName + ':' + window.ENV.osVersion
    // fix ios系统进入石墨文档后再返回会触发签名失败的bug
    fixIosShimoBug()
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount() {
    let userInfoResult = await pget('/rise/customer/info')
    if(userInfoResult.code === 200) {
      window.ENV.userName = userInfoResult.msg.nickname
      window.ENV.headImgUrl = userInfoResult.msg.headimgurl
    }
    this.setState({ showPage: true })
    if(window.location.href.indexOf('/rise/static/guest/') === -1) {
      // 不是guest页面，判断这个用户是否可以看到活动提示
      pget('/rise/index/msg').then(res => {
        if(res.msg) {
          const { url, message } = res.msg
          this.setState({ activityMsg: true, url, message })
        }
      })
      pget(`/rise/customer/global/notify`).then(res => {
        if(res.code === 200) {
          this.setState({
            showGlobalNotify: res.msg.showGlobalNotify,
            expiredInSevenDays: res.msg.expiredInSevenDays,
            expired: res.msg.expired
          })
        }
      })
    }
  }

  componentWillUpdate() {
    //windows客户端显示返回按钮
    if(navigator.userAgent.indexOf('WindowsWechat') !== -1) {
      //排除不显示返回按钮的页面
      if(window.location.pathname !== '/rise/static/rise'
        && window.location.pathname !== '/rise/static/camp'
        && window.location.pathname !== '/rise/static/practice/warmup') {
        if(!this.state.windowsClient) {
          this.setState({ windowsClient: true })
        }
      } else {
        if(this.state.windowsClient) {
          this.setState({ windowsClient: false })
        }
      }
    }
  }

  componentDidMount() {
    config(['chooseWXPay'])
  }

  closeAnswer() {
    const { dispatch } = this.props
    dispatch(set(SHOW_MODAL_KEY, false))
  }

  handleClickGoRisePay() {
    window.location.href = `/pay/rise`
  }

  render() {
    if(!this.state.showPage) {
      return <div></div>
    }

    const { showGlobalNotify, expiredInSevenDays, expired } = this.state

    const renderGlobalNotify = () => {
      if(showGlobalNotify) {
        if(expiredInSevenDays) {
          return <div onClick={() => this.handleClickGoRisePay()} className="global-notify expire"/>
        } else if(expired) {
          return <div onClick={() => this.handleClickGoRisePay()} className="global-notify expired"/>
        }
      }
    }

    return (
      <div className={`${isPending(this.props, LOAD_KEY) ? 'over-hidden' : ''}`}>
        {renderGlobalNotify()}
        {this.props.children}
        <Toast show={isPending(this.props, LOAD_KEY)} icon="loading">
          <div style={{ fontSize: 13, paddingTop: 10 }}>加载中...</div>
        </Toast>
        <Alert {...this.state.alert}
               show={this.props.base.showModal}>
          <div className="global-pre" dangerouslySetInnerHTML={{ __html: this.props.base.alertMsg }}/>
        </Alert>
        {
          this.state.windowsClient &&
          <div
            style={{
              position: 'absolute', left: 5, top: 5, height: 30, width: 30, zIndex: 999, cursor: 'pointer',
              transparency: '10%'
            }}
            onClick={() => window.history.back()}>
            <AssetImg type="back_button" width={30} height={30} style={{ opacity: 0.3 }}/>
          </div>
        }
        {
          this.state.activityMsg && this.state.message &&
          <Activity url={this.state.url} message={this.state.message}/>
        }
      </div>
    )
  }
}
