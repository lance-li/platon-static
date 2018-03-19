import * as React from 'react'
import './CompletePlanBar.less'

export class CompletePlanBar extends React.Component {

  constructor () {
    super()
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount () {
    this.setState(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
      this.setState(nextProps)
    }
  }

  handleClickCourse (planId) {
    this.context.router.push({pathname: '/rise/static/plan/study', query: {planId: planId}})
  }

  render () {
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
      completeTime = '2000-01-01'
    } = this.state.plan

    return (
      <div className="complete-problem-component" onClick={() => this.handleClickCourse(planId)}>
        <div className="status-line"/>
        <div className="plan-status"/>
        <div className="plan-detail">
          <div className="plan-name">{description}</div>
          <div className="plan-close">{completeTime}</div>
          <div className="plan-title-below">{name}</div>
          <div className="plan-stamp"/>
        </div>
      </div>
    )
  }

}
