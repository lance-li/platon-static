import * as React from 'react'
import { connect } from 'react-redux'
import './Main.less'
import { loadWarmUpDiscuss, discuss, deleteComment } from './async'
import { startLoad, endLoad, alertMsg, set } from '../../../redux/actions'
import AssetImg from '../../../components/AssetImg'
import Discuss from '../components/Discuss'
import DiscussShow from '../components/DiscussShow'
import SubDiscussShow from '../components/SubDiscussShow'
import _ from 'lodash'
import { scroll } from '../../../utils/helpers'
import { mark } from '../../../utils/request'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { SectionProgressHeader, SectionProgressStep } from '../components/SectionProgressHeader'

const sequenceMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G'
}

@connect(state => state)
export class Analysis extends React.Component <any, any> {
  constructor() {
    super()
    this.state = {
      list: [],
      currentIndex: 0,
      practiceCount: 0,
      showDiscuss: false,
      repliedId: 0,
      warmupPracticeId: 0,
      pageIndex: 1,
      integrated: false,
      isReply: false,
      placeholder: '解答同学的提问（限1000字）',
      knowledgeId: 0,
      content: ''
    }
  }

  componentWillMount(props) {
    const { dispatch, location, warmupCurrentIndex } = this.props
    this.setState({ currentIndex: 0 })

    const { integrated } = location.query
    this.setState({ integrated })
    const { res } = this.props
    const { code, msg } = res
    if(code === 200) {
      if(warmupCurrentIndex) {
        this.setState({ currentIndex: warmupCurrentIndex })
      }
      this.setState({ list: msg, practiceCount: msg.practice.length })
      if(msg.practice[0].knowledge) {
        this.setState({ knowledgeId: msg.practice[0].knowledge.id })
      }
    }
    else dispatch(alertMsg(msg))
  }

  next() {
    const { dispatch } = this.props
    const { currentIndex, practiceCount, list } = this.state
    if(currentIndex < practiceCount - 1) {
      this.setState({ currentIndex: currentIndex + 1 })
      //保存当前解析的题目index
      dispatch(set('warmupCurrentIndex', currentIndex + 1))
      let questionId = _.get(list, `practice[${currentIndex}].id`)
      mark({ module: '打点', function: questionId, action: '查看解析', memo: currentIndex })
    }
    window.scrollTo(0, 0)
  }

  prev() {
    const { dispatch } = this.props
    const { currentIndex } = this.state
    if(currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 })
      //保存当前解析的题目index
      dispatch(set('warmupCurrentIndex', currentIndex - 1))
    }
    window.scrollTo(0, 0)
  }

  reload() {
    const { dispatch } = this.props
    let { list, currentIndex } = this.state
    const { practice = [] } = list
    const { id } = practice[currentIndex]

    loadWarmUpDiscuss(id, 1).then(res => {
      dispatch(endLoad())
      const { code, msg } = res
      if(code === 200) {
        _.set(list, `practice.${currentIndex}.discussList`, msg)
        this.setState({
          showDiscuss: false, list, content: '', placeholder: '解答同学的提问（限1000字）', repliedId: 0, isReply: false
        })
        scroll('.discuss', '.warm-up-container')
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  reply(item) {
    this.setState({
      showDiscuss: true, isReply: true,
      placeholder: '回复 ' + item.name + ':', content: '',
      repliedId: item.id, referenceId: item.warmupPracticeId
    })
  }

  onChange(value) {
    this.setState({ content: value })
  }

  cancel() {
    this.setState({ placeholder: '解答同学的提问（限1000字）', isReply: false, showDiscuss: false, repliedId: 0 })
  }

  onSubmit() {
    const { dispatch } = this.props
    const { repliedId, content, list, currentIndex } = this.state
    const { practice = [] } = list
    const { id } = practice[currentIndex]
    if(content.length == 0) {
      dispatch(alertMsg('请填写评论'))
      return
    }

    let discussBody = { comment: content, referenceId: id }
    if(repliedId) {
      _.merge(discussBody, { repliedId: repliedId })
    }

    discuss(discussBody).then(res => {
      const { code, msg } = res
      if(code === 200) {
        this.reload()
      }
      else {
        dispatch(alertMsg(msg))
      }
    }).catch(ex => {
      dispatch(alertMsg(ex))
    })
  }

  onDelete(discussId) {
    const { dispatch } = this.props

    deleteComment(discussId).then(res => {
      let { list, currentIndex } = this.state
      const { practice = [] } = list
      const { id } = practice[currentIndex]

      loadWarmUpDiscuss(id, 1).then(res => {
        dispatch(endLoad())
        const { code, msg } = res
        if(code === 200) {
          _.set(list, `practice.${currentIndex}.discussList`, msg)
          this.setState({ showDiscuss: false, list })
        }
        else dispatch(alertMsg(msg))
      }).catch(ex => {
        dispatch(endLoad())
        dispatch(alertMsg(ex))
      })
    })
  }

  render() {
    const {
      list, currentIndex, selected, practiceCount, showDiscuss, isReply, integrated, placeholder, knowledgeId
    } = this.state
    const { practice = [] } = list
    const { dispatch, location } = this.props
    const { planId } = location.query

    const questionRender = (practice) => {
      const { id, question, pic, choiceList = [], score = 0, discussList = [] } = practice
      return (
        <div>
          <div className="intro-container">
            {practiceCount !== 0 && currentIndex <= practiceCount - 1 ? <div className="intro-index">
              <span className="index">第{currentIndex + 1}/{practiceCount}题</span>
              <span className="tip">正确选项可能不止一个</span>
              <span className="type"><span className="number">{score}</span>分</span>
            </div> : null}
            {pic ? <div className="context-img">
              <AssetImg url={pic}/></div> : null
            }
            <div className="question">
              <div dangerouslySetInnerHTML={{ __html: question }}/>
            </div>
            <div className="choice-list">
              {choiceList.map((choice, idx) => choiceRender(choice, idx))}
            </div>
            <div className="answer-display">
              <div className="chosen" style={{ marginBottom: 15 }}>
                已选答案：{choiceList.map((choice, idx) => myAnswerRender(choice, idx))}
              </div>
              <div className="right">
                正确答案：{choiceList.map((choice, idx) => rightAnswerRender(choice, idx))}
              </div>
            </div>
          </div>
          <div className="analysis">
            <div className="analysis-icon">解析</div>
            <div className="analysis-context"
                 dangerouslySetInnerHTML={{ __html: practice ? practice.analysis : '' }}/>
            {integrated == 'false' &&
            <div className="knowledge-link"
                 onClick={() => this.refs.sectionProgress.goSeriesPage(SectionProgressStep.KNOWLEDGE, dispatch)}>
              点击查看相关知识点
            </div>
            }
          </div>
          <div className="discuss-container">
            <div className="discuss">
              <div className="discuss-bar">问答</div>
              {_.isEmpty(discussList) ? null : discussList.map((discuss, idx) => discussRender(discuss, idx))}
              {!_.isEmpty(discussList) ?
                <div className="show-more">
                  你已经浏览完所有的讨论啦
                </div>
                :
                <div className="discuss-end">
                  <div className="discuss-end-img">
                    <AssetImg url="https://static.iqycamp.com/images/no_comment.png" width={94} height={92}/>
                  </div>
                  <span className="discuss-end-span">点击左侧按钮，发表第一个好问题吧</span>
                </div>
              }
            </div>
          </div>
        </div>
      )
    }

    const discussRender = (comment, idx) => {
      const { warmupPracticeDiscussList } = comment
      return (
        <div>
          <DiscussShow discuss={comment} showLength={50} reply={() => this.reply(comment)}
                       onDelete={this.onDelete.bind(this, comment.id)}/>
          {!_.isEmpty(warmupPracticeDiscussList) ?
            <div>
              <div className="discuss-triangle"></div>
              {warmupPracticeDiscussList.map((discuss, idx) => subDiscussRender(discuss, idx))}
              <div className="discuss-padding"></div>
            </div>
            : null}
        </div>
      )
    }

    const subDiscussRender = (discuss, idx) => {
      return (
        <SubDiscussShow discuss={discuss} showLength={50} reply={() => this.reply(discuss)}
                        onDelete={this.onDelete.bind(this, discuss.id)}/>
      )
    }

    const choiceRender = (choice, idx) => {
      const { id, subject } = choice
      return (
        <div key={id} className={`choice${choice.selected ? ' selected' : ''}${choice.isRight ? ' right' : ''}`}>
          <span className={`index${choice.selected ? ' selected' : ''}`}/>
          <span className={`text${choice.isRight ? ' right' : ''}`}>{sequenceMap[idx]}&nbsp;&nbsp;{subject}</span>
        </div>
      )
    }

    const rightAnswerRender = (choice, idx) => {
      return (choice.isRight ? sequenceMap[idx] + ' ' : '')
    }

    const myAnswerRender = (choice, idx) => {
      return (choice.selected ? sequenceMap[idx] + ' ' : '')
    }

    return (
      <div className="warm-up-container">
        <SectionProgressHeader ref={'sectionProgress'} planId={planId}
                               practicePlanId={this.props.location.query.practicePlanId} currentIndex={1}/>
        {questionRender(practice[currentIndex] || {})}
        {showDiscuss && <div className="padding-comment-dialog"/>}
        <div>
          {
            !showDiscuss &&
            <FooterButton btnArray={[
              {
                click: () => {
                  this.prev()
                },
                className: `${currentIndex === 0 && 'disable'}`,
                text: '上一题'
              },
              {
                click: () => {
                  currentIndex + 1 < practiceCount ?
                    this.next() :
                    this.refs.sectionProgress.goSeriesPage(SectionProgressStep.BASE_APPLICATION, dispatch)
                },
                text: '下一题'
              }
            ]}/>
          }
          {
            showDiscuss ?
              <Discuss isReply={isReply} placeholder={placeholder} limit={1000}
                       submit={() => this.onSubmit()} onChange={(v) => this.onChange(v)}
                       cancel={() => this.cancel()}/> :
              <div className="write-discuss" onClick={() => this.setState({ showDiscuss: true })}>
                <AssetImg url="https://static.iqycamp.com/images/discuss.png" width={45} height={45}/>
              </div>
          }
        </div>
      </div>

    )
  }
}
