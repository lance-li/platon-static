import * as React from 'react'
import './GroupPromotionCountDown.less'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { loadCampCountDown } from '../async'
import { GroupPromotionWaiting } from './GroupPromotionWaiting'
import AssetImg from '../../../components/AssetImg'

@connect(state => state)
export default class GroupPromotionCountDown extends React.Component {

  constructor() {
    super()
    this.state = {
      showPage: false
    }
  }

  async componentWillMount() {
    const { dispatch } = this.props
    dispatch(startLoad())
    try {
      let res = await loadCampCountDown()
      dispatch(endLoad())
      const msg = res.msg
      if(res.code === 200) {
        this.setState({
          isGroupSuccess: msg.isGroupSuccess,
          isLeader: msg.isLeader,
          leaderName: msg.leaderName,
          remainderCount: msg.remainderCount,
          groupCode: msg.groupCode,
          tens: msg.countDownDay.substr(0, 1),
          ones: msg.countDownDay.substr(1),
          showPage: true
        })
      } else {
        dispatch(alertMsg(msg))
      }
    } catch(err) {
      dispatch(alertMsg(err))
    }
  }

  render() {
    const { isGroupSuccess, isLeader, leaderName, remainderCount, groupCode, ones = 9, tens = 9, showPage } = this.state

    if(!showPage) return <div></div>

    if(isGroupSuccess) {
      return (
        <div className="group-promotion-countdown">
          <div className="header" style={{ paddingTop: '2rem' }}>
            <div className="msg" style={{ fontSize: '1.6rem', display: 'block' }}>互助模式参与成功！</div>
            <div className="msg" style={{ fontSize: '1.6rem', display: 'block' }}>你已解锁《认识自己》前7天课程内容。</div>
            <div className="msg" style={{ marginTop: '2rem' }}>离课程开始还有</div>
          </div>
          <div className="remainder">
            <div className="day">
              <div className="tens-place place">
                {tens}
              </div>
              <div className="ones-place place">
                {ones}
              </div>
            </div>
          </div>
          <div className="footer">
            请置顶公众号<br/>
            以便及时收到课程开始通知
            <div className="guide-tips">
              <div className="left" data-step='- 1 -'>
                <AssetImg url='https://static.iqycamp.com/images/count_down_left_tips.png?imageslim'/>
              </div>
              <div className="right" data-step='- 2 -'>
                <AssetImg url='https://static.iqycamp.com/images/count_down_right_tips.png?imageslim'/>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <GroupPromotionWaiting leaderName={leaderName} remainderCount={remainderCount} groupCode={groupCode}/>
      )
    }
  }

}
