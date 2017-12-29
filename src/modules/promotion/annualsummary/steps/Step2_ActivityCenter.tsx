import * as React from 'react'
import './Step2_ActivityCenter.less'

interface Step2_ActivityCenterProps {
  getGlobalState: any
}

export class Step2_ActivityCenter extends React.Component<Step2_ActivityCenterProps, any> {

  constructor() {
    super()
    this.state = {}
  }

  render() {
    const { totalHours = 10, mbaCount = 1 } = this.state

    return (
      <section className="annual-activity-center">
        <div className="scroll-container">
          <div className="text text1">在圈外商学院里，你和来自全球</div>
          <div className="text text2">
          <span className="highlight">
            <large>25&nbsp;</large>
            座城市</span> 的人成了校友
          </div>
          <div className="text text3">一起累积学习了
            <span className="highlight">
            <large>&nbsp;{totalHours}&nbsp;</large>
            小时
          </span>
          </div>
          <div className="text text4">相当于读了
            <span className="highlight">
            <large>&nbsp;{mbaCount}&nbsp;</large>
            个MBA</span>
          </div>
          <div className="map"></div>
          <div className="map-locations"></div>
        </div>
      </section>
    )
  }

}
