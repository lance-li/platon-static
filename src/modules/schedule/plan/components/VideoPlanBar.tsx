import * as React from 'react'
import { Dialog } from 'react-weui'
import './VideoPlanBar.less'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'

const { Alert } = Dialog

@connect(state => state)
export class VideoPlanBar extends React.Component {

  constructor() {
    super()
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.setState({
      video: this.props.video,
    })
  }

  handleClickCourse() {
    const { dispatch } = this.props
    const { id } = this.state.video
    this.context.router.push(
      { pathname: '/rise/static/video/course', query: { id } })
  }

  render() {
    const {
      title,
      lecturer
    } = this.state.video

    return (
      <div className={`video-plan-component`}
           onClick={() => this.handleClickCourse()}>
        <div className="problem-name">{title}</div>
        <div className="problem-description">{lecturer}</div>
        <div className="waiting-status">
          <span>开始学习</span>
        </div>
      </div>
    )
  }

}

