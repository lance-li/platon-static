import * as React from 'react'
import { connect } from 'react-redux'
import './ProblemIntroduction.less'
import Audio from '../../../components/Audio'
import AssetImg from '../../../components/AssetImg'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { collectProblem, disCollectProblem, openProblemIntroduction } from '../../problem/async'
import { Toast, Dialog } from 'react-weui'
import { isNumber } from 'lodash'

const { Alert } = Dialog
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { mark } from 'utils/request'
import { buttonStatus } from 'utils/helpers'
import { createPlan } from '../../plan/async'
import QYVideo from '../../../components/QYVideo'
import { MarkBlock } from '../../../components/markblock/MarkBlock'

@connect(state => state)
export default class ProblemIntroduction extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()

    this.state = {
      data: {},
      showAlert: false,
      showConfirm: false,
      tipMsg: '',
      alert: {
        buttons: [
          {
            label: '再看看',
            onClick: this.handleClickClose.bind(this)
          },
          {
            label: '想好了',
            onClick: this.handleSubmitProblemChoose.bind(this)
          }
        ]
      },
      confirm: {
        buttons: [
          {
            label: '取消',
            onClick: this.handleClickCloseConfirm.bind(this)
          },
          {
            label: '确定',
            onClick: this.handleClickGoStudy.bind(this)
          }
        ]
      },
      show: true,
      problemCollected: false
    }
  }

  async componentWillMount() {
    const { dispatch, location } = this.props
    const { id, free, practicePlanId } = location.query
    mark({
      module: '打点',
      function: '打开页面',
      action: '打开课程介绍页',
      memo: id
    })
    /** 获取课程数据，以及价格／按钮状态 */
    let res = await openProblemIntroduction(id, free, practicePlanId)
    const { msg, code } = res
    if(code === 200) {
      if(!buttonStatus.isValid(msg.buttonStatus)) {
        dispatch(alertMsg('按钮状态异常'))
      }
    } else {
      dispatch(alertMsg(msg))
      return
    }

    let problemMsg = msg
    this.setState({
      data: problemMsg.problem,
      buttonStatus: problemMsg.buttonStatus,
      currentPlanId: problemMsg.planId,
      bindMobile: problemMsg.bindMobile,
      isFull: problemMsg.isFull,
      togetherClassMonth: problemMsg.togetherClassMonth,
      problemCollected: problemMsg.problemCollected
    })

    this.picHeight = (window.innerWidth / (750 / 350)) > 175 ? 175 : (window.innerWidth / (750 / 350))
    this.headerContentTop = (window.innerWidth / (750 / 104)) > 52 ? 52 : (window.innerWidth / (750 / 104))
    this.headerContentLeft = (window.innerWidth / (750 / 50)) > 25 ? 25 : (window.innerWidth / (750 / 25))
    this.whoFontSize = (window.innerWidth / (750 / 30)) > 15 ? 15 : (window.innerWidth / (750 / 30))
    this.whoNumFontSize = (window.innerWidth / (750 / 48)) > 24 ? 24 : (window.innerWidth / (750 / 48))
  }

  /**
   * 关闭提示信息
   */
  handleClickClose() {
    this.setState({ showAlert: false })
  }

  /**
   * 确定生成课程
   */
  handleSubmitProblemChoose() {
    this.setState({ showAlert: false })
    const { dispatch, location } = this.props
    const { isFull, bindMobile } = this.state
    dispatch(startLoad())
    createPlan(location.query.id).then(res => {
      dispatch(endLoad())
      const { code, msg } = res
      if(code === 200) {
        this.handleClickGoStudy()
      } else {
        dispatch(alertMsg(msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  /**
   * 关闭确认弹窗
   */
  handleClickCloseConfirm() {
    this.setState({ showConfirm: false })
  }

  handleClickProblemChooseConfirm() {
    const chooseConfirm = {
      buttons: [
        {
          label: '取消',
          onClick: () => {
            this.setState({ showAlert: false })
          }
        },
        {
          label: '确认',
          onClick: () => {
            this.setState({ showAlert: false })
            this.handleSubmitProblemChoose()
          }
        }
      ]
    }

    this.setState({ showAlert: true, alert: chooseConfirm, tipMsg: '课程开启后，学习期限为30天。期间完成学习即可永久查看内容。确认开启吗？' })
  }

  handleClickGoStudy() {
    if(window.ENV.showExplore !== 'false') {
      this.context.router.push('/rise/static/rise')
    } else {
      this.context.router.push('/rise/static/course/schedule/plan')
    }
  }

  onClickHandleProblemCollection(selected, problemId) {
    const { dispatch } = this.props
    if(selected) {
      // 已经关注
      disCollectProblem(problemId).then(res => {
        if(res.code === 200) {
          this.setState({ problemCollected: false })
        }
      }).catch(e => dispatch(alertMsg(e)))
    } else {
      // 还未关注
      collectProblem(problemId).then(res => {
        if(res.code === 200) {
          this.setState({ problemCollected: true })
        }
      }).catch(e => dispatch(alertMsg(e)))

    }
  }

  render() {
    const {
      data = {}, buttonStatus, free, problemCollected
    } = this.state
    const { show } = this.props.location.query
    const {
      difficultyScore, catalog, subCatalog, pic, why, how, what, who,
      descPic, audio, chapterList, problem, categoryPic, authorPic, audioWords, videoUrl, videoPoster, videoWords
    } = data

    const renderRoadMap = (chapter, idx) => {
      const { sections } = chapter
      return (
        <div key={idx} className="chapter-item">
          <div className={'chapter'}>{'第' + chapter.chapter + '章 '}{chapter.name}</div>
          {sections ? sections.map((section, idx) => renderSection(section, idx, chapter.chapter)) : null}
        </div>
      )
    }

    const renderSection = (section, idx, chapter) => {
      return (
        <div key={idx}>
          <div className={'section'}>{chapter}{'.'}{section.section + '节 '}{section.name}</div>
        </div>
      )
    }

    const renderWho = (who) => {
      if(who) {
        let whoArr = who.split(';')
        if(whoArr.length === 1) {
          return (
            <div className="who-item">
              <div style={{ fontSize: `${this.whoFontSize}px` }} className="wi-text just-one">{who}</div>
            </div>
          )
        } else {
          return whoArr.map((item, key) => {
            return (
              <div className="who-item" key={key}>
                <div style={{ fontSize: `${this.whoNumFontSize}px` }} className="wi-sequence">{key + 1}</div>
                <span
                  style={{ fontSize: `${this.whoFontSize}px` }} className="wi-text">{item}</span>
              </div>
            )
          })
        }
      } else {
        return null
      }
    }

    const renderFooter = () => {
      if(!show) {
        let footerBar = <div className="padding-footer" style={{ height: '45px' }}/>
        let list = []
        list.push(footerBar)
        if(isNumber(buttonStatus)) {
          switch(buttonStatus) {
            case -1: {
              return null
            }
            case 1: {
              return (
                <FooterButton btnArray={[{
                  click: () => window.location.href = `/pay/rise`,
                  text: '加入商学院，立即学习'
                }]}/>
              )
            }
            case 2: {
              return (
                <FooterButton btnArray={[{
                  click: () => this.handleClickGoStudy(),
                  text: '去上课'
                }]}/>
              )
            }
            case 3: {
              return (
                <FooterButton btnArray={[
                  {
                    click: () => this.handleClickGoStudy(),
                    text: '课程已开始，去上课'
                  }]}/>
              )
            }
            case 4: {
              return (
                <FooterButton btnArray={[{
                  click: () => this.handleClickGoStudy(),
                  text: '课程已完成，去复习'
                }]}/>
              )
            }
            case 5: {
              return (
                <FooterButton btnArray={[{
                  click: () => this.handleClickProblemChooseConfirm(),
                  text: '选择该课程'
                }]}/>
              )
            }
            case 6: {
              return (
                <FooterButton btnArray={[{
                  click: () => window.history.back(),
                  text: '返回'
                }]}/>
              )
            }
            default:
              return null
          }
        }
      }
    }

    const renderPayMessage = () => {
      return (
        <div className="pre-pay-message">
          <div>《{problem}》是线上学习产品，由文字+语音+练习题+互动讨论区组成。</div>
          <br/>
          <div>课程一共有{data && data.chapterList ? data.chapterList.length : 'N'}章{data ? data.length : 'N'}小节。完成后可永久随开随学，进度自控。</div>
          <br/>
          <div>在手机端”圈外同学“公众号，或网站www.iquanwai.com都可以学习。</div>
          <br/>
          <div>报名通过系统自动进行，支付成功后概不退款，请予以理解。</div>
          <br/>
        </div>
      )
    }

    const renderContent = () => {
      return (
        <section className="pi-content">
          <div className="pi-c-foreword white-content">
            <Header icon="rise_icon_lamp" title="课程介绍" width={24} height={29}/>
            <div>
              {videoUrl && <QYVideo videoUrl={videoUrl} videoPoster={videoPoster} videoWords={videoWords}/>}
            </div>
            <div className="pi-c-f-content">
              {audio &&
              <div className="context-audio">
                <Audio url={audio} words={audioWords}/>
              </div>}
              {why && <pre className="pi-c-f-c-text" dangerouslySetInnerHTML={{ __html: why }}/>}
            </div>
          </div>
          <div className="pi-c-man white-content mg-25">
            <Header icon="rise_icon_man" title="适合人群" width={18}/>
            <div className="pi-c-m-content">
              {renderWho(who)}
            </div>
          </div>
          <div className="pi-c-author white-content mg-25">
            <Header icon="rise_icon_head" title="讲师介绍" width={26} height={16} lineHeight={'12px'}/>
            <AssetImg width={'100%'} url={authorPic}/>
          </div>
          {/*<div className="pi-c-pay-info white-content mg-25">*/}
            {/*<Header icon="rise_icon_pay_info" title="报名须知" width={24}/>*/}
            {/*<div className="pi-c-pay-content">*/}
              {/*{renderPayMessage()}*/}
            {/*</div>*/}
          {/*</div>*/}
          <div className="pi-c-learn white-content mg-25">
            <Header icon="rise_icon_book" title="学习大纲"/>
            <div className="pi-c-l-content">
              {what && <pre className="pi-c-text" dangerouslySetInnerHTML={{ __html: what }}/>}
              <div
                className="roadmap">{chapterList && chapterList.map((chapter, idx) => renderRoadMap(chapter, idx))}</div>
            </div>
          </div>
        </section>
      )
    }

    return (
      <div className={`problem-introduction`}>
        <div className="header-img">
          <div className={`back-img catalog${data.catalogId}`}/>
          <div className="section-title">
            <div className="title-content">{data.problem}</div>
          </div>
          {/*<MarkBlock module={'打点'} func={'课程介绍页'} action={'点击收藏课程按钮'} className={`problem-collect ${problemCollected ? 'collected' : ''}`}*/}
               {/*onClick={() => this.onClickHandleProblemCollection(problemCollected, data.id)}>*/}
            {/*<span>{problemCollected ? '已收藏' : '收藏课程'}</span>*/}
          {/*</MarkBlock>*/}
        </div>
        {renderContent()}
        {renderFooter()}
        <Alert {...this.state.alert}
          show={this.state.showAlert}>
          <div className="global-pre">{this.state.tipMsg}</div>
        </Alert>
        <Alert {...this.state.confirm} show={this.state.showConfirm}>
          <div className="global-pre">{this.state.confirmMsg}</div>
        </Alert>
      </div>
    )
  }
};

interface HeaderProps {
  icon: string,
  title: string,
  size?: number,
  width?: number,
  height?: number,
  marginLeft?: number,
  lineHeight?: number,
}

class Header extends React.Component<HeaderProps, any> {
  constructor(props: HeaderProps) {
    super(props)
  }

  render() {
    const renderSize = () => {
      if(!this.props.size && !this.props.width && !this.props.height) {
        return 20
      } else {
        return this.props.size
      }
    }
    return (
      <div className="page-item-header">
        <div className="pih-icon-container">
          <div className="pih-icon"
               style={{
                 marginLeft: this.props.marginLeft, lineHeight: this.props.lineHeight ? this.props.lineHeight : 0
               }}>
            <AssetImg type={this.props.icon} size={renderSize()} width={this.props.width} height={this.props.height}/>
          </div>
          <div className="pih-title">
            {this.props.title}
          </div>
        </div>
      </div>
    )
  }
}
