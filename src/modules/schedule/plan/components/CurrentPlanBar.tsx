import * as React from 'react'
import { Dialog } from 'react-weui'
import './CurrentPlanBar.less'
import { createPlan } from '../async'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'

const {Alert} = Dialog

@connect(state => state)
export class CurrentPlanBar extends React.Component {

  constructor () {
    super()
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  componentWillMount () {
    this.setState({
      plan: this.props.plan,
    })
  }

  handleClickCourse () {
    const {dispatch} = this.props
    const {problemId, planId, isLearning} = this.state.plan
    if (isLearning) {
      this.context.router.push(
        {pathname: '/rise/static/plan/study', query: {planId: planId}})
    } else {
      this.setState({
        show: true,
        dialogButtons: [
          {
            label: '取消',
            onClick: () => {
              this.setState({show: false, hello: 'test hello'})
            },
          },
          {
            label: '确认',
            onClick: () => {
              this.setState({show: false})
              createPlan(problemId).then(res => {
                if (res.code === 200) {
                  this.context.router.push(
                    `/rise/static/plan/study?planId=${res.msg}`)
                } else {
                  dispatch(alertMsg(res.msg))
                }
              })
            },
          },
        ],
        dialogContent: '开启课程后，需要在30天之内学完哦，否则将无法再次开启本门课程',
      })
    }
  }

  render () {
    const {show = false, dialogButtons = [], dialogContent = ''} = this.state
    const {
      type = 1,
      problemId = 0,
      planId,
      isLearning = false,
      name = '',
      abbreviation = '',
      description = '',
      completeSeries = 0,
      totalSeries = 0,
      remainDaysCount = 0,
      completeTime = '2000-01-01',
    } = this.state.plan

    return (
      <div>
        <div className={`current-problem-component ${type === 1 ? 'major' : 'minor'}`}
             onClick={() => this.handleClickCourse()}>
          <div className="problem-name">{abbreviation}</div>
          {
            isLearning ? <div className="learning-status">课程学习进度：{completeSeries} / {totalSeries}</div> :
              <div className="waiting-status">
                <span className={`${type == 1 ? 'major' : 'minor'}`}>待开课</span>
              </div>
          }
          <div className="problem-description">{description}</div>
          {isLearning && <div className="close-tips">{remainDaysCount} 天后关闭</div>}
        </div>
        <Alert show={show} buttons={dialogButtons}>{dialogContent}</Alert>
      </div>
    )
  }

}

