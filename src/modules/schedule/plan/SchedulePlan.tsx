import * as React from 'react'
import './SchedulePlan.less'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { CurrentPlanBar } from './components/CurrentPlanBar'
import { CompletePlanBar } from './components/CompletePlanBar'
import { VideoPlanBar } from './components/VideoPlanBar'
import AssetImg from '../../../components/AssetImg'
import { loadPersonSchedulePlan, loadVideoCourses } from './async'
import { mark } from '../../../utils/request'
import { ToolBar } from '../../base/ToolBar'
import { ColumnSpan } from '../../../components/ColumnSpan'
import * as FontAwesome from 'react-fontawesome'
import { MarkBlock } from '../../../components/markblock/MarkBlock'

@connect(state => state)
export default class SchedulePlan extends React.Component {

  constructor() {
    super()
    this.state = {
      showAllRunningPlan: false,
      sliceRunningPlans: [],
      showAllVideo: false,
      videoList: [],
      data: {},
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  async componentWillMount() {
    mark({
      module: '打点', function: '学习', action: '打开学习计划页面',
    })
    const { dispatch, location } = this.props
    dispatch(startLoad())
    let res = await loadPersonSchedulePlan()

    if(res.code == 200) {
      this.setState({ data: res.msg })
    } else {
      dispatch(alertMsg(res.msg))
    }
    res = await loadVideoCourses()
    if(res.code == 200) {
      this.setState({ videoList: res.msg })
    } else {
      dispatch(alertMsg(res.msg))
    }
    dispatch(endLoad())
  }

  handleGoPersonalCenter() {
    this.context.router.push('/rise/static/customer/personal')
  }

  handleClickCourse(planId) {
    this.context.router.push({ pathname: '/rise/static/plan/study', query: { planId: planId } })
  }

  handleGoOverView() {
    this.context.router.push('/rise/static/course/schedule/overview')
  }

  render() {
    let { showAllRunningPlan, sliceRunningPlans = [], showAllVideo, videoList = [], data } = this.state
    let { announce, completePlans = [], runningPlans = [], joinDays = 0, loginCount = 0, totalPoint = 0, hasCourseSchedule = true } = data

    const renderRunningPlans = () => {
      sliceRunningPlans = !showAllRunningPlan ? runningPlans.slice(0, 3) : runningPlans
      return (
        <div className="plan-bar-box">
          {sliceRunningPlans.map((plan, index) => <CurrentPlanBar key={index} plan={plan}/>)}
        </div>
      )
    }

    const renderVideoPlans = () => {
      videoList = !showAllVideo ? videoList.slice(0, 3) : videoList
      return (
        <div className="plan-bar-box">
          {videoList.map((video, index) => <VideoPlanBar key={index} video={video}/>)}
        </div>
      )
    }

    return (
      <div className="schedule-plan-container">
        <div className="personal-detail">
          <AssetImg className="headimg-url" url={window.ENV.headImgUrl}/>
          <div className="nickname">{window.ENV.userName}</div>
          <div className="personal-icon" onClick={() => this.handleGoPersonalCenter()}></div>
          <div className="parameter-box box1">
            <div className="desc">连续登陆天数</div>
            <div className="data">{loginCount}</div>
          </div>
          <div className="parameter-box box2">
            <div className="desc">加入圈外天数</div>
            <div className="data">{joinDays}</div>
          </div>
          <div className="parameter-box box3">
            <div className="desc">积分</div>
            <div className="data">{totalPoint}</div>
          </div>
        </div>
        {
          announce &&
          <div>
            <ColumnSpan height={10}/>
            <div className="person-tip">
              <div className="problem-update-tip-icon"></div>
              <span>{announce}</span>
            </div>
            <ColumnSpan height={10}/>
          </div>
        }
        <div className="current-problems">
          <div className="title">我的课程</div>
          {
            runningPlans.length > 0 ?
              !showAllRunningPlan ?
                runningPlans.length > 3 ?
                  <div className="more" onClick={() => this.setState({ showAllRunningPlan: true })}>
                    更多&nbsp;
                    <FontAwesome name="angle-right"/>
                  </div> :
                  <div></div> :
                <div className="more" onClick={() => this.setState({ showAllRunningPlan: false })}>
                  收起&nbsp;
                  <FontAwesome name="angle-down"/>
                </div> :
              <div className="no-running-plans">
                <div className="no-running-icon"></div>
                <div className="no-running-tip1">现在没有在学的课程哦！</div>
                {
                  hasCourseSchedule &&
                  <MarkBlock module={'打点'} func={'学习页面'} action={'点击学习计划按钮'} className="no-running-tip2">
                    点击查看我的学习计划立即开启学习之旅
                  </MarkBlock>
                }
              </div>
          }
          {renderRunningPlans()}
          {
            videoList.length > 0 && !showAllVideo ?
              videoList.length > 3 ?
                <div className="more" onClick={() => this.setState({ showAllVideo: true })}>
                  更多&nbsp;
                  <FontAwesome name="angle-right"/>
                </div> :
                <div></div> :
              <div className="more" onClick={() => this.setState({ showAllVideo: false })}>
                收起&nbsp;
                <FontAwesome name="angle-down"/>
              </div>
          }
          {
            hasCourseSchedule &&
            <span className="view-course-schedule" onClick={() => this.handleGoOverView()}>
              查看我的学习计划&nbsp;
              <FontAwesome name="angle-right"/>
            </span>
          }
          <div className="title" style={{marginTop: '2.0rem'}}>视频课</div>
          {renderVideoPlans()}
        </div>
        {
          completePlans.length > 0 &&
          <div className="complete-problems">
            <div className="title">已完成的课程</div>
            {completePlans.map((plan, index) => <CompletePlanBar key={index} plan={plan}/>)}
          </div>
        }
        <ToolBar/>
      </div>
    )
  }

}
