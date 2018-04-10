import * as React from 'react'
import { connect } from 'react-redux'
import './Application.less'
import {
  loadApplicationPractice, vote, loadOtherList,
  openApplication, getOpenStatus, submitApplicationPractice, CommentType, ArticleViewModule, autoSaveApplicationDraft,
  loadOtherListBatch, isRiseMember, loadApplicationCompletedCount, loadPriorityApplicationCommenst,
} from './async'
import { startLoad, endLoad, alertMsg, set } from '../../../redux/actions'
import AssetImg from '../../../components/AssetImg'
import _ from 'lodash'
import Work from '../components/NewWork'
import PullElement from 'pull-element'
import { merge, findIndex, remove, isEmpty, isBoolean, isUndefined } from 'lodash'
import Tutorial from '../../../components/Tutorial'
import { mark } from '../../../utils/request'
import { randomStr, scroll } from '../../../utils/helpers'
import { preview } from '../../helpers/JsConfig'
import { SectionProgressHeader, SectionProgressStep } from '../components/SectionProgressHeader'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { Dialog } from 'react-weui'
import { CardPrinter } from '../../plan/components/CardPrinter'
import ApplicationDiscussDistrict from './ApplicationDiscussDistrict/ApplicationDiscussDistrict'
import { ColumnSpan } from '../../../components/ColumnSpan'

const { Alert } = Dialog
let timer

const APPLICATION_AUTO_SAVING = 'rise_application_autosaving'

/**
 * 应用题页
 */
@connect(state => state)
export default class Application extends React.Component <any, any> {
  constructor () {
    super()
    this.state = this.getInitialState()

    this.pullElement = null
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  getInitialState () {
    return {
      data: {},
      page: 1,
      otherList: [],
      otherHighlightList: [],
      integrated: true,
      showOthers: false,
      editorValue: '',
      edit: false,
      draftId: -1,
      draft: '',
      showDraftToast: false,
      isRiseMember: 2,
      loading: false,
      showCompletedBox: false,
      completedApplicationCnt: 1000,
      autoPushDraftFlag: null,
      end: null,
      planId: null,
      openStatus: null,
      showCardPrinter: false,
      showDisable: false,
      firstSubmit: false,
      showApplicationCacheAlert: false,
    }
  }

  async componentWillMount () {
    mark({ module: '打点', function: '学习', action: '打开应用题页' })
    const { dispatch, location, otherApplicationPracticeSubmitId, applicationId } = this.props
    const { integrated, id, planId } = location.query
    this.setState({ integrated })
    loadApplicationPractice(id, planId).then(res => {
      const { code, msg } = res
      if (code === 200) {
        let storageDraft = JSON.parse(window.localStorage.getItem(APPLICATION_AUTO_SAVING))
        // 更新其余数据
        this.setState({
          data: msg,
          planId: msg.planId,
          autoPushDraftFlag: !msg.isSynchronized,
          showCompletedBox: false,
          firstSubmit: !msg.content,
          showApplicationCacheAlert: res.msg.draft && !res.msg.isSynchronized,
        })
        const { content } = msg
        //看评论的请求，锚定到评论区
        if (content !== null) {
          if (isUndefined(otherApplicationPracticeSubmitId) || id != applicationId) {
            let node = this.refs.submitBar
            if (node) this.refs.submitBar.scrollTop = 0
          }
        }
      }
      // 自动加载其它同学的作业
      if (otherApplicationPracticeSubmitId && id == applicationId) {
        this.others()
      }
    })
    isRiseMember().then(res => {

      this.setState({ isRiseMember: res.msg })

    })
    getOpenStatus().then(res => {

      this.setState({ openStatus: res.msg })

    })
    loadApplicationCompletedCount(planId).then(res => {

      this.setState({ completedApplicationCnt: res.msg })

    })
    let commentsRes = await loadPriorityApplicationCommenst(id, planId)
    this.setState({ commentsData: commentsRes.msg })
  }

  componentDidUpdate () {
    const { showOthers, otherList } = this.state
    if (!this.pullElement && showOthers && !isEmpty(otherList)) {
      // 有内容并且米有pullElement
      const { dispatch } = this.props
      this.pullElement = new PullElement({
        target: '#react-app',
        scroller: 'body',
        trigger: '.app-work-list',
        damping: 3,
        detectScroll: false,
        detectScrollOnStart: true,

        onPullUp: (data) => {
          if (this.props.iNoBounce) {
            if (this.props.iNoBounce.isEnabled()) {
              this.props.iNoBounce.disable()
            }
          }
          this.setState({ loading: true })
        },
        onPullUpEnd: (data) => {
          loadOtherList(this.props.location.query.id, this.state.page + 1).then(res => {

            this.setState({ loading: false })
            if (res.msg && res.msg.list && res.msg.list.length !== 0) {
              remove(res.msg.list, (item) => {
                return findIndex(this.state.otherList, item) !== -1
              })
              this.setState({
                otherList: this.state.otherList.concat(res.msg.list),
                page: this.state.page + 1,
                end: res.msg.end,
              })
            } else {
              this.setState({ end: res.msg.end })

            }
          })
          if (this.props.iNoBounce) {
            if (!this.props.iNoBounce.isEnabled()) {
              this.props.iNoBounce.enable()
            }
          }
        },
      })
      this.pullElement.init()
    }
    if (this.pullElement) {
      if (this.state.end) {
        this.pullElement.disable()
      } else {
        this.pullElement.enable()
      }
    }

    // 根据当前的编辑状态，决定是否开启自动保存功能
    if (this.state.edit) {
      this.autoSaveApplicationDraftTimer()
    } else {
      clearInterval(timer)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location.query.id !== this.props.location.query.id) {
      this.setState(this.getInitialState(), () => this.componentWillMount())
    }
  }

  componentWillUnmount () {
    this.pullElement ? this.pullElement.destroy() : null
    clearInterval(timer)
  }

  autoSave () {
    if (this.refs.editor) {
      let value = this.refs.editor.getValue()
      let storageDraft = JSON.parse(window.localStorage.getItem(APPLICATION_AUTO_SAVING))
      if (storageDraft) {
        if (this.props.location.query.id === storageDraft.id) {
          window.localStorage.setItem(APPLICATION_AUTO_SAVING, JSON.stringify({
            id: this.props.location.query.id, content: value,
          }))
        } else {
          this.clearStorage()
        }
      } else {
        window.localStorage.setItem(APPLICATION_AUTO_SAVING, JSON.stringify({
          id: this.props.location.query.id, content: value,
        }))
      }
    }
  }

  clearStorage () {
    window.localStorage.removeItem(APPLICATION_AUTO_SAVING)
  }

  // 定时保存方法
  autoSaveApplicationDraftTimer () {
    clearInterval(timer)
    timer = setInterval(() => {
      const planId = this.state.planId
      const applicationId = this.props.location.query.id
      if (this.refs.editor) {
        const draft = this.refs.editor.getValue()
        if (draft.trim().length > 0) {
          if (this.state.autoPushDraftFlag) {
            autoSaveApplicationDraft(planId, applicationId, draft).then(res => {
              if (res.code === 200) {
                this.clearStorage()
              }
            })
            this.setState({ autoPushDraftFlag: false })
          }
        }
      }
    }, 10000)
  }

  onEdit () {
    this.setState({ edit: true })
  }

  goComment (submitId) {
    const { dispatch } = this.props
    dispatch(set('otherApplicationPracticeSubmitId', submitId))
    dispatch(set('applicationId', this.props.location.query.id))
    dispatch(set('articlePage', this.state.page))
    this.context.router.push({
      pathname: '/rise/static/practice/application/comment',
      query: merge({ submitId: submitId }, this.props.location.query),
    })
  }

  voted (id, voteStatus, voteCount, isMine, seq) {
    if (!voteStatus) {
      if (isMine) {
        this.setState({ data: merge({}, this.state.data, { voteCount: voteCount + 1, voteStatus: true }) })
      } else {
        let newOtherList = merge([], this.state.otherList)
        _.set(newOtherList, `[${seq}].voteCount`, voteCount + 1)
        _.set(newOtherList, `[${seq}].voteStatus`, 1)
        this.setState({ otherList: newOtherList })
      }
      vote(id)
    }
  }

  tutorialEnd () {
    const { openStatus } = this.state
    openApplication().then(res => {
      const { code, msg } = res

      this.setState({ openStatus: merge({}, openStatus, { openApplication: true }) })

    })
  }

  others () {
    const { dispatch, location, otherApplicationPracticeSubmitId, applicationId, articlePage } = this.props
    let page = 1
    if (articlePage) {
      page = articlePage
    }
    loadOtherListBatch(location.query.id, page).then(res => {

      this.setState({
        otherList: res.msg.list,
        page: 1, end: res.msg.end, showOthers: true,
      }, () => {
        if (otherApplicationPracticeSubmitId && location.query.id == applicationId) {
          //锚定到上次看的练习
          scroll('#app-' + otherApplicationPracticeSubmitId, '.container')
        }
      })

    })
  }

  onSubmit () {
    const { dispatch, location } = this.props
    const { data, planId, completedApplicationCnt } = this.state
    const answer = this.refs.editor.getValue()
    const { complete, practicePlanId } = location.query
    if (answer == null || answer.length === 0) {
      dispatch(alertMsg('请填写作业'))
      return
    }
    this.setState({ showDisable: true })
    submitApplicationPractice(planId, location.query.id, { answer }).then(res => {
      this.clearStorage()
      const { code, msg } = res
      if (code === 200) {
        if (code.msg !== 0) {
          this.setState({ completedApplicationCnt: res.msg }, () => {
            window.scrollTo(0, 0)
          })
        }
        loadApplicationPractice(location.query.id, planId).then(res => {
          const { code, msg } = res
          if (code === 200) {
            this.setState({
              data: msg,
              planId: msg.planId,
              editorValue: msg.content,
            })
          }
        })
        this.setState({ showDisable: false })
      } else {
        this.setState({ showDisable: false })
      }
    })
  }

  handleChangeValue (value) {
    const { autoPushDraftFlag } = this.state
    if (_.isBoolean(autoPushDraftFlag)) {
      // 非null(取到数据了) 并且没有打开保存draft的flag
      if (!autoPushDraftFlag) {
        this.setState({ autoPushDraftFlag: true })
      }
    }
  }

  handleClickGoSubmitPage () {
    const { planId, id } = this.props.location.query
    this.context.router.push({
      pathname: '/rise/static/practice/submit/application',
      query: { id: id, planId: planId },
    })
  }

  render () {
    const {
      data, otherList, end, openStatus = {}, showOthers, edit, showDisable, firstSubmit,
      showCompletedBox = false, completedApplicationCnt, integrated, loading, isRiseMember,
      commentsData = {}, showApplicationCacheAlert,
    } = this.state
    const { planId, id } = this.props.location.query
    const { completePracticePlanId, dispatch } = this.props
    const { topic, description, content, voteCount, submitId, voteStatus, pic, isBaseApplication, isLastApplication, problemId } = data
    const renderList = (list) => {
      if (list) {
        return list.map((item, seq) => {
          return (
            <div id={'app-' + item.submitId}
                 className="application-article">
              <Work onVoted={() => this.voted(item.submitId, item.voteStatus, item.voteCount, false, seq)}  {...item}
                    goComment={() => this.goComment(item.submitId)}
                    type={CommentType.Application}
                    articleModule={ArticleViewModule.Application}/>
            </div>
          )
        })
      }
    }

    const renderTip = () => {
      return (
        <div className="no-comment">
          <div className="content">
            <div className="text">更喜欢电脑上提交?</div>
            <div className="text">登录www.iquanwai.com/community</div>
          </div>
        </div>
      )
    }

    const renderEnd = () => {
      if (showOthers) {
        if (loading) {
          return (
            <div style={{ textAlign: 'center', margin: '5px 0 60px' }}>
              <AssetImg url="https://static.iqycamp.com/images/loading1.gif"/>
            </div>
          )
        }
        if (!end) {
          return (
            <div className="show-more">上拉加载更多消息</div>
          )
        } else {
          return (
            <div className="show-more">没有更多了</div>
          )
        }
      }
    }

    const renderCardPrinter = () => {
      if (problemId) {
        return (
          <CardPrinter problemId={problemId}
                       completePracticePlanId={this.props.location.query.practicePlanId}/>
        )
      }
    }

    const renderButton = () => {
      if (showDisable) {
        return (
          <FooterButton btnArray={[
            {
              click: () => {
              }, text: '提交中',
            }]}/>
        )
      } else {
        if (!isLastApplication) {
          return (
            <FooterButton btnArray={[
              {
                click: () =>
                  this.refs.sectionProgress.goSeriesPage(SectionProgressStep.UPGRADE_APPLICATION, dispatch),
                text: '下一题',
              }]}/>
          )
        } else {
          return (
            <FooterButton btnArray={[
              {
                click: () =>
                  this.context.router.push({
                    pathname: '/rise/static/plan/study',
                    query: { planId: this.props.location.query.planId },
                  })
                , text: '返回',
              }]}/>
          )
        }
      }
    }

    return (
      <div className="application-edit-container">
        {renderCardPrinter()}
        <Tutorial bgList={['https://static.iqycamp.com/images/fragment/rise_tutorial_yylx_0419.png?imageslim']}
                  show={openStatus && isBoolean(openStatus.openApplication) && !openStatus.openApplication}
                  onShowEnd={() => this.tutorialEnd()}/>
        <SectionProgressHeader ref={'sectionProgress'}
                               planId={planId}
                               practicePlanId={this.props.location.query.practicePlanId}
                               currentIndex={`${isBaseApplication ? 2 : 3}`}/>
        <div className="intro-container">
          <div className="application-context">
            <div className="application-title">
              <span>今日应用</span>
            </div>
            <div className="section2"
                 dangerouslySetInnerHTML={{ __html: description }}/>
            {
              pic &&
              <div className="app-image">
                <AssetImg url={pic}
                          width={'80%'}
                          style={{ margin: '0 auto' }}
                          onClick={() => preview(pic, [pic])}/>
              </div>
            }
          </div>
          <ColumnSpan height={15}
                      style={{ margin: '2rem -2.5rem 0' }}/>
          <ApplicationDiscussDistrict key={id}
                                      data={commentsData}
                                      clickFunc={() => this.handleClickGoSubmitPage()}/>
        </div>
        {renderButton()}
        <Alert show={showApplicationCacheAlert}
               buttons={[
                 {
                   label: '关闭',
                   onClick: () => this.setState({ showApplicationCacheAlert: false }),
                 }, {
                   label: '确定',
                   onClick: () => this.handleClickGoSubmitPage(),
                 },
               ]}>
          您还有没有提交草稿哦，
          <br/>
          点击确定立即更新我的作业
        </Alert>
      </div>
    )
  }
}
