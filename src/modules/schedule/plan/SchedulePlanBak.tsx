import * as React from 'react'
import './SchedulePlanBak.less'
import { connect } from 'react-redux'
import { loadSchedulePlan, createPlan } from './async'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { changeTitle, formatDate } from '../../../utils/helpers'
import { mark } from '../../../utils/request'
import { Dialog } from 'react-weui'
import AssetImg from '../../../components/AssetImg'
import * as _ from 'lodash'
import { openAudition } from '../../problem/async'
import { ToolBar } from '../../base/ToolBar'
import { ColumnSpan } from '../../../components/ColumnSpan'
import { MarkBlock } from '../../../components/markblock/MarkBlock'

var $ = require('jquery')

const {Alert} = Dialog

const MAJOR_PROBLEM = 1
const MINOR_PROBLEM = 2

/**
 * rise_icon_hr 左侧较宽 TODO
 */
@connect(state => state)
export default class SchedulePlan extends React.Component<any, any> {

  constructor () {
    super()
    this.state = {
      data: {}
    }
    changeTitle('圈外同学')
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  async componentWillMount () {
    mark({
      module: '打点',
      function: '学习',
      action: '打开学习计划页面'
    })

    const {dispatch, location} = this.props
    dispatch(startLoad())

    let res = await loadSchedulePlan()
    dispatch(endLoad())
    if (res.code === 200) {
      this.setState({data: res.msg})
    } else {
      dispatch(alertMsg(res.msg))
    }

    let majorPercent = 0
    let minorPercent = 0
    if (res.msg.majorTotal > 0) {
      majorPercent = res.msg.majorComplete / res.msg.majorTotal
    }

    if (res.msg.minorTotal > 0) {
      minorPercent = res.msg.minorComplete / res.msg.minorTotal
    }

    $('.course-major').circleProgress({
      value: majorPercent,
      size: 85,
      startAngle: -Math.PI / 2,
      fill: {
        gradient: ['#FF983F', '#FFC701']
      }
    })

    if (res.msg.minorSelected) {
      $('.course-minor').circleProgress({
        value: minorPercent,
        size: 85,
        startAngle: -Math.PI / 2,
        fill: {
          gradient: ['#0063F8', '#35B0EA']
        }
      })
    }
  }

  clickCourse (type, item) {
    const {dispatch} = this.props

    // 没有开课
    if (!item.id) {
      this.setState({
        dialogButtons: [
          {
            label: '取消',
            onClick: () => {
              this.setState({dialogShow: false, dialogButtons: [], dialogContent: ''})
            }
          },
          {
            label: '确认',
            onClick: () => {
              dispatch(startLoad())
              this.setState({dialogShow: false})
              createPlan(item.problem.id).then(res => {
                dispatch(endLoad())
                if (res.code === 200) {
                  this.context.router.push(`/rise/static/plan/study?planId=${res.msg}`)
                } else {
                  dispatch(alertMsg(res.msg))
                }
              }).catch(e => {
                dispatch(alertMsg(e))
              })
            }
          }
        ],
        dialogShow: true,
        dialogContent: '课程开启后，学习期限为30天。期间完成学习即可永久查看内容。确认开启吗？'
      })
    } else {
      this.context.router.push({pathname: '/rise/static/plan/study', query: {planId: item.id}})
    }
  }

  learn (item) {
    this.context.router.push({pathname: '/rise/static/plan/study', query: {planId: item.id}})
  }

  gotoOverview () {
    this.context.router.push('/rise/static/course/schedule/overview')
  }

  render () {
    const {data} = this.state
    const {month, topic, today, minorSelected, runningProblem = [], majorTotal, majorComplete, minorTotal, minorComplete, completeProblem = []} = data

    const renderRunningCourse = () => {
      return runningProblem.map((item, index) => {
          let styleType = ''
          if (item.type === 1) {
            styleType = 'major'
          } else if (item.type === 2) {
            styleType = 'minor'
          }
          return (
            <MarkBlock module={'打点'} func={'学习计划页面'} action={'点击课程按钮'} key={index} className={`course-card`}
                       onClick={() => this.clickCourse(item.type, item)}>
              <div className="problem-item">
                <div className={`problem-item-backcolor ${styleType}`}/>
                <div className="problem-item-abbreviation">{item.problem.abbreviation}</div>
                <div className="problem-item-title">{item.problem.problem}</div>
                {/*<div className="problem-pic"></div>*/}
                {!item.id && <div className={`wait-open ${styleType}`}>待开课</div>}
                {renderCourseType(item)}
              </div>
            </MarkBlock>
          )
        }
      )
    }

    const renderCourseType = (item) => {
      if (item.deadline && item.deadline > 0) {
        return (
          <div className="problem-item-deadline">{`${item.typeDesc} | ${item.deadline}天后关闭`}</div>
        )
      } else {
        return (
          <div className="problem-item-deadline">{`${item.typeDesc}`}</div>
        )
      }
    }

    const renderCompleteCourse = () => {
      return completeProblem.map((item, index) => {
        var date = formatDate(new Date(), 'yyyy-MM-dd')
        return (
          <div className="complete-plan" key={index} onClick={() => this.learn(item)}>
            <div className="status-line"/>
            <div className="plan-status"/>
            <div className="plan-detail">
              <div className="plan-title-above">
                <div className="plan-name">{`${item.typeDesc} | ${item.problem.abbreviation} | ${item.point}分`}</div>
                <div className="plan-close">{date}</div>
              </div>
              <div className="plan-title-below">
                {item.problem.abbreviation + '：' + item.problem.problem}
              </div>
              <div className="plan-stamp"/>
            </div>
          </div>
        )
      })
    }

    const renderDialog = () => {
      const {dialogShow = false, dialogButtons = [], dialogContent} = this.state

      return (
        <Alert
          show={dialogShow}
          buttons={dialogButtons}>
          {dialogContent}
        </Alert>
      )
    }
    return (
      <div className="schedule-plan-container" style={{minHeight: window.innerHeight}}>
        <div className="monthly-topic">
          {topic ? month + '月 ' + topic : null}
        </div>
        <div className="monthly-progress">
          <div className="monthly-title">本月进度</div>
          <div className="today">{today}</div>
        </div>
        {majorTotal &&
        <div className="course-progress course-major">
          <div className="progress-name">主修课</div>
          <div className="progress-percent">
            {majorComplete + '/' + majorTotal}
          </div>
        </div>
        }
        {
          minorSelected &&
          <div className="course-progress course-minor">
            <div className="progress-name">辅修课</div>
            <div className="progress-percent">
              {minorComplete + '/' + minorTotal}
            </div>
          </div>
        }
        <ColumnSpan height={1} backgroundColor={'#eee'}/>
        <div className="card">
          <div className="card-title">
            <div className="card-topic">进行中的课程</div>
          </div>

          {_.isEmpty(runningProblem) ? <div className="empty-container">
            <div className="empty-img">
              <AssetImg url="https://static.iqycamp.com/images/plan_empty.png" width={55} height={56}/>
            </div>
            <div className="empty-text">
              <span>还没有学习中的课程哦</span>
            </div>
          </div> : <div className="course-container">
            {renderRunningCourse()}
          </div>}

        </div>
        <MarkBlock module={'打点'} func={'学习页面'} action={'点击学习计划按钮'} className="modify-course-schedule"
                   onClick={() => this.gotoOverview()}>
          {'查看我的学习计划 >'}
        </MarkBlock>
        <ColumnSpan height={1} backgroundColor={'#eee'}/>
        {
          !_.isEmpty(completeProblem) &&
          <div className="card">
            <div className="card-title">
              <div className="card-topic">已完成的课程</div>
            </div>
            <div className="complete-course-container">
              {renderCompleteCourse()}
            </div>
          </div>
        }
        {renderDialog()}
        <ToolBar/>
      </div>
    )

  }
}
