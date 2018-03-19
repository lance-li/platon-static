import * as React from 'react'
import './StudyLine.less'
import { connect } from 'react-redux'
import { loadStudyline, gradeProblem, closePlan } from './async'
import { startLoad, endLoad, alertMsg, set } from 'reduxutil/actions'
import { changeTitle, scroll } from '../../utils/helpers'
import { merge } from 'lodash'
import { mark } from '../../utils/request'
import { Dialog } from 'react-weui'
import { ColumnSpan } from '../../components/ColumnSpan'
import { MarkBlock } from '../../components/markblock/MarkBlock'
import { ProblemTitle } from '../problem/components/ProblemTitle'
import { FooterButton } from '../../components/submitbutton/FooterButton'
import DropChoice from '../../components/DropChoice'

const { Alert } = Dialog

const MAJOR_PROBLEM = 1
const MINOR_PROBLEM = 2
const TRIAL_PROBLEM = 3

const hanzi = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十' ]

/**
 * rise_icon_hr 左侧较宽 TODO
 */
@connect(state => state)
export default class StudyLine extends React.Component<any, any> {
  constructor() {
    super()
    this.state = {
      data: {},
      anchor: false,
      showScoreModal: false,
      questionList: [
        {
          id: 2,
          subject: '本课程的训练对工作/生活有用吗？',
          comment: null,
          choiceList: [
            {
              id: 5,
              subject: '非常实用，大部分能马上应用'
            }, {
              id: 4,
              subject: '较为实用，不少能实际应用'
            }, {
              id: 3,
              subject: '实用性一般，要找找应用场景'
            }, {
              id: 2,
              subject: '不太实用，偶尔能用上'
            }, {
              id: 1,
              subject: '大部分不能应用'
            }
          ]
        },
        {
          id: 3,
          subject: '你是否愿意推荐本课程给你的朋友<br/>（1-10打分，分数越高代表推荐意愿越强）',
          comment: null,
          choiceList: [
            {
              id: 10,
              subject: 10
            }, {
              id: 9,
              subject: 9
            }, {
              id: 8,
              subject: 8
            }, {
              id: 7,
              subject: 7
            }, {
              id: 6,
              subject: 6
            }, {
              id: 5,
              subject: 5
            }, {
              id: 4,
              subject: 4
            }, {
              id: 3,
              subject: 3
            }, {
              id: 2,
              subject: 2
            }, {
              id: 1,
              subject: 1
            }
          ]
        },{
          id: 4,
          subject: '对于圈外课程你有什么优化建议和想法吗？<br/>欢迎在下框留言。',
          comment: null,
          choiceList: null,
        }
      ],
    }
    this.learningContainer = ''
    changeTitle('课程学习')
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount() {
    mark({
      module: '打点',
      function: '学习页面',
      action: '打开新学习页面'
    })

    const { dispatch, location, completePracticePlanId } = this.props
    dispatch(startLoad())

    let res = await loadStudyline(location.query.planId)
    dispatch(endLoad())
    const { msg, code } = res
    if(code === 200) {
      this.setState({ data: msg })
    } else {
      dispatch(alertMsg(msg))
    }
  }

  onPracticeSelected(item) {
    const { dispatch, location } = this.props
    const { planId } = location.query
    const { type, status } = item
    const { data } = this.state
    const { problemId } = data

    if(status === -1) {
      dispatch(alertMsg('完成之前的任务，这一组才能解锁<br> 学习和内化，都需要循序渐进哦'))
      return
    }
    if(status === -3) {
      dispatch(alertMsg('抱歉哦，课程开放期间，你未能完成前面的练习，导致这个练习无法解锁'))
      return
    }

    // 是否完成
    let complete = false
    if(status === 1) {
      complete = true
    }

    if(type === 20) {
      const { id } = item
      this.context && this.context.router.push({
        pathname: '/rise/static/plan/view',
        query: { id: problemId, complete, practicePlanId: id }
      })
    } else if(type === 21) {
      const { id } = item
      this.context && this.context.router.push({
        pathname: '/rise/static/practice/challenge',
        query: { id: problemId, practicePlanId: id, planId, complete }
      })
    } else if(type === 31) {
      const { practicePlanId, integrated } = item
      this.context && this.context.router.push({
        pathname: '/rise/static/practice/knowledge',
        query: { practicePlanId, planId, complete }
      })
    } else if(type === 32) {
      const { practicePlanId } = item
      this.context && this.context.router.push({
        pathname: '/rise/static/practice/knowledge/review',
        query: { problemId, practicePlanId, planId, complete }
      })
    } else if(type === 101) {
      this.context && this.context.router.push({
        pathname: '/rise/static/plan/report',
        query: { problemId, planId }
      })
    } else if(type === 102) {
      this.context && this.context.router.push({
        pathname: '/rise/static/problem/extension',
        query: { problemId, planId }
      })
    } else if(type === 1 || type === 2) {
      const { practicePlanId, integrated } = item
      this.context ? this.context.router.push({
          pathname: '/rise/static/practice/warmup',
          query: { practicePlanId, planId, complete }
        }) : null
    } else if(type === 11 || type === 12) {
      const { practicePlanId, practiceId, integrated } = item
      this.context ? this.context.router.push({
          pathname: '/rise/static/practice/application',
          query: { id: practiceId, practicePlanId, integrated, planId, complete }
        }) : null
    }
  }

  completePlan(){
    const { dispatch, location } = this.props
    const { data = {} } = this.state
    const { planId } = location.query
    dispatch(startLoad())
    closePlan(planId).then(res => {
      dispatch(endLoad())
      const { code, msg } = res
      if(code === 200) {
        this.setState({ data: merge({}, data, { status: 3 }), showScoreModal:true })
      } else {
        if(code === -1) {
          dispatch(alertMsg(`先完成所有的知识点和选择题<br/>才能查看报告哦`))
        } else {
          dispatch(alertMsg(msg))
        }
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  submitScore(questionList) {
    const { data } = this.state
    const { dispatch } = this.props
    const { problemId } = data
    let problemScores = questionList.map(item => {
      if(item.choiceList){
        let selectedChoice
        item.choiceList.forEach(choice => {
          if(choice.selected) {
            selectedChoice = choice.id
          }
        })
        return { question: item.id, choice: selectedChoice }
      }else{
        return { question: item.id, comment: item.comment }
      }
    })
    dispatch(startLoad())
    gradeProblem(problemScores, problemId).then(res => {
      dispatch(endLoad())
      this.setState({ showScoreModal: false })
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })

  }

  componentDidUpdate() {
    if(this.learningContainer && !this.state.anchor) {
      scroll(this.learningContainer, '.study-line-content', -160)
      this.setState({ anchor: true })
    }
  }

  render() {
    const { data, showScoreModal } = this.state
    const { problemType, problemId, preview = [], review = [], chapters = [], status } = data

    let styleType = ''
    if(problemType === MAJOR_PROBLEM) {
      styleType = 'major'
    } else if(problemType === MINOR_PROBLEM) {
      styleType = 'minor'
    }

    const renderPreview = () => {
      return (
        <div className="preview-practice">
          <div className="preview-title">课前准备</div>
          {
            preview.map((item, index) => {
              let title = ''
              if(item.type === 21) {
                title = '小目标'
              } else if(item.type === 20) {
                title = '课程介绍'
              }
              return renderPractice(title, item, preview.length === index + 1)
            })
          }
        </div>
      )
    }

    const renderPractice = (title, item, isLast) => {
      let status = ''
      let type = 1
      //延伸学习，学习报告 type=-1
      if(item.type === 101 || item.type === 102) {
        type = -1
      }
      //锁定的练习不高亮
      if(item.status < 0) {
        status = 'locked'
      } else if(item.status === 0) {
        if(type > 0) {
          //只有第一个进行中练习高亮
          if(styleType === 'major') {
            status = 'major_running'
          } else {
            status = 'minor_running'
          }
        } else {
          //延伸练习和学习报告不高亮
          status = 'complete'
        }
        if(!this.learningContainer && item.practicePlanId) {
          this.learningContainer = '.practice-' + item.practicePlanId
        }
      } else if(item.status === 1) {
        //已完成的练习
        status = 'complete'
      }
      return (
        <MarkBlock func={'课程提纲'} action={'点击练习'} memo={item.type}
                   className={`practice-detail practice-${item.practicePlanId}`}
                   onClick={() => this.onPracticeSelected(item)}>
          <div className="line-tip">
            {(type > 0 || status == 'locked') &&
            <div className={`status-line ${isLast && 'last'} ${type < 0 && 'review'}`}></div>}
            {(type > 0 || status == 'locked') && <div className={`status ${status}`}></div>}
            {item.status === 0 && type > 0 && <div className={`start-learning ${status}`}>学习</div>}
          </div>
          <div className={`title ${status} ${status === 'complete' && item.practicePlanId && 'complete-style'}`}>
            <div className="title-name">{title}</div>
            {
              status === 'complete' && item.practicePlanId &&
              <div className="complete-tips">
                已完成 {item.completePractices}/{item.totalPractices}
              </div>
            }
            {item.status === 0 && <div className={`start-practice ${status}`}></div>}
          </div>
        </MarkBlock>
      )
    }

    const renderChapter = () => {
      return (
        <div className="chapter-practice">
          {
            chapters.map((item, index) => {
              const { sections, chapter } = item
              return (
                <div key={index} className={`chapter`}>
                  {'第' + hanzi[ chapter ] + '章 '}{item.name}
                  {
                    sections.map((item, index) => {
                      let title = chapter + '.' + item.section + ' ' + item.name
                      return renderPractice(title, item, sections.length === index + 1)
                    })
                  }
                </div>
              )
            })
          }
        </div>
      )
    }

    const renderReview = () => {
      return (
        <div className="review-practice">
          <div className="review-title">课后总结(选做)</div>
          {
            review.map((item, index) => {
              let title = ''
              if(item.type === 101) {
                title = '学习报告'
              } else if(item.type === 102) {
                title = '延伸学习'
              }
              return renderPractice(title, item, review.length === index + 1)
            })
          }
        </div>
      )
    }

    return (
      <div className="study-line-container">
        { showScoreModal &&
        <DropChoice onSubmit={(questionList) => this.submitScore(questionList)}
                    onClose={() => this.setState({ showScoreModal: false })}
                    questionList={this.state.questionList}/> }
        <ProblemTitle problemId={problemId}/>
        <div id={'study-line-content'} className="study-line-content">
          {renderPreview()}
          <ColumnSpan height={1} backgroundColor={'#eee'}/>
          {renderChapter()}
          <ColumnSpan height={1} backgroundColor={'#eee'}/>
          {renderReview()}
        </div>
        {status === 2 ?
          <FooterButton btnArray={[{
          click: () =>
            this.completePlan()
          , text: '结束课程', className: styleType
        },{
          click: () =>
            window.location.href = '/rise/static/learn'
          , text: '返回课程列表', className: styleType
        }]}/> :
          <FooterButton btnArray={[{
          click: () =>
            window.location.href = '/rise/static/learn'
          , text: '返回课程列表', className: styleType
        }]}/>}

      </div>
    )

  }
}
