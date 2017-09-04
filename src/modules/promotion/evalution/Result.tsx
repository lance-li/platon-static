import * as React from 'react';
import { connect } from "react-redux";
import { submitEva, shareResult } from "./async"
import { startLoad, endLoad, alertMsg } from "../../../redux/actions";
import { Dialog } from 'react-weui'
import AssetImg from '../../../components/AssetImg'
import './Result.less'
import { mark } from 'utils/request'

const { Alert } = Dialog

@connect(state => state)
export class Result extends React.Component<any,any> {
  constructor(props) {
    super(props)
    this.state = {
      initialScale: 0,
      backgroundPicWidth: 750,
      backgroundPicHeight: 1334,
      percent: 0,
      learnFreeLimit: false,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    window.addEventListener('popstate', (e) => {
      this.setState({ showQuit: true })
    })
    const { score } = this.props.location.query
    const { dispatch } = this.props
    this.fit()
    dispatch(startLoad())
    submitEva(score).then(res => {
      dispatch(endLoad())
      const { code, msg } = res
      if(code === 200) {
        const { learnFreeLimit, result, suggestion, percent } = msg
        this.setState({ learnFreeLimit, result, suggestion, percent })
      } else {
        dispatch(alertMsg(msg))
      }
    }).catch(e => {
      dispatch(endLoad())
      dispatch(alertMsg(e))
    })
  }

  componentDidMount() {
    history.pushState({ page: 'next' }, 'state', '#ending')
  }

  fit() {
    let windowHeight = window.innerHeight
    let windowWidth = window.innerWidth
    let pageHeight = this.state.backgroundPicHeight
    let pageWidth = this.state.backgroundPicWidth

    let initialScale = 0
    if(pageWidth / pageHeight > windowWidth / windowHeight) {
      initialScale = windowHeight / pageHeight
    } else {
      initialScale = windowWidth / pageWidth
    }

    this.setState({ initialScale })
  }

  share() {
    const { score } = this.props.location.query
    const { percent, learnFreeLimit } = this.state
    mark({ module: '打点', function: '测评', action: '点击页面领取海报按钮' })
    this.context.router.push({pathname:'/rise/static/eva/share', query: {score, percent, learnFreeLimit}})
  }

  sendMsg(){
    const {dispatch} = this.props
    const { score } = this.props.location.query
    const { percent, learnFreeLimit } = this.state
    dispatch(startLoad())
    shareResult(score, percent).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        wx.closeWindow()
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(e => {
      dispatch(endLoad())
      dispatch(alertMsg(e))
    })
  }

  render() {
    const {
      initialScale, backgroundPicHeight, backgroundPicWidth, learnFreeLimit,
      result, suggestion, percent
    } = this.state
    const quitProps = {
      buttons: [
        {
          label: '确定', onClick: () => {
          this.sendMsg()
        }
        }
      ]
    }
    return (
      <div className="eva-result">
        <div className="head">
          <AssetImg url="https://static.iqycamp.com/images/eva_report_head4.png" height={119} width={302}/>
        </div>
        <div className="result">
          <AssetImg url="https://static.iqycamp.com/images/eva_result_hr_3.png" height={57} width={174} marginTop={-30}/>
          <div className="text-result">
            你的洞察力天赋打败了{percent}%的人！
          </div>
          <pre className="text">{result}</pre>
        </div>
        <div className="suggestion">
          <AssetImg url="https://static.iqycamp.com/images/action_suggest_hr_5.png" height={58} width={174} marginTop={-20}/>
          <pre className="text">{suggestion}</pre>
        </div>
        { learnFreeLimit ? null :
          <div className="schedule">
            <AssetImg url="https://static.iqycamp.com/images/eva_schedule_6.png" width={'100%'}/>
            <div className="class-more" onClick={()=>this.context.router.push('/rise/static/plan/view?id=9')}>了解更多</div>
          </div>}
        { learnFreeLimit ?
          <div className="free-get" onClick={()=>this.share()}>
            <AssetImg url="https://static.iqycamp.com/images/free_get_9.png" height={57} width={226}/>
          </div> :
          <div className="free-get" onClick={()=>this.share()}>
            <AssetImg url="https://static.iqycamp.com/images/free_get_8.png" height={57} width={226}/>
          </div>
        }
        <Alert { ...quitProps }
          show={this.state.showQuit}>
          <div className="global-pre">
            {learnFreeLimit ? '系统已为你生成测评结果海报，敢不敢分享出来，让你的朋友也挑战一下？'
              : '系统已为你生成测评结果海报，分享还可以免费领取【洞察力强化课程】，去看看吧~'}
          </div>
        </Alert>
      </div>
    )
  }
}