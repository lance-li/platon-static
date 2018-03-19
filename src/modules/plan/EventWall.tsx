import * as React from 'react'
import './EventWall.less'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { queryEventList } from './async'
import { ToolBar } from '../base/ToolBar'
import { changeTitle, goOtherWeb, unScrollToBorder } from '../../utils/helpers'
import { mark } from 'utils/request'
import Banner from '../../components/Banner'
import { MarkBlock } from '../../components/markblock/MarkBlock'

@connect(state => state)
export default class EventWall extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      tab: 1
    }
    changeTitle('活动')

    this.bannerWidth = window.innerWidth
    this.bannerHeight = (175 / 375 * this.bannerWidth)
    this.barItemPd = ((70 / 750) * (window.innerWidth - 30)) / 2
    this.barItemWidth = ((window.innerWidth - 30) - this.barItemPd * 6) / 4

    if(this.barItemWidth < 64) {
      this.barItemWidth = 64
      this.barItemPd = ((window.innerWidth - 30) - (this.barItemWidth * 4)) / 6
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(startLoad())
    mark({ module: '打点', function: '活动墙', action: '进入活动墙页面' })
    queryEventList().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        let liveList = [], workList = [], offlineList = [], areaList = [], bannerList = []
        for(let i = 0; i < res.msg.length; i++) {
          switch(res.msg[i].type) {
            case 1:
              liveList.push(res.msg[i])
              break
            case 2:
              workList.push(res.msg[i])
              break
            case 3:
              offlineList.push(res.msg[i])
              break
            case 4:
              areaList.push(res.msg[i])
              break
            default:
              liveList.push(res.msg[i])
              break
          }
          if(res.msg[i].banner) {
            // 放到banner 注意，如果要做刷新，这里会有坑
            bannerList.push(res.msg[i])
          }
        }
        this.setState({
          liveList: liveList, workList: workList, offlineList: offlineList, areaList: areaList, bannerList: bannerList
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  componentDidMount() {
    unScrollToBorder('.event-tab-body')
  }

  goEvent(item) {
    goOtherWeb(item.destUrl)
  }

  goBannerEvent(item) {
    goOtherWeb(item.destUrl)
  }

  renderTabBody() {
    const { liveList, workList, offlineList, areaList, tab } = this.state
    let tempList = null
    switch(tab) {
      case 2:
        tempList = liveList
        break
      case 1:
        tempList = workList
        break
      case 3:
        tempList = offlineList
        break
      case 4:
        tempList = areaList
        break
      default:
        tempList = liveList
        break
    }

    let height = this.bannerHeight > (window.innerHeight - 60) ? 'auto' : `${window.innerHeight - this.bannerHeight - 50 - 50}px`

    return (
      <div className="event-tab-body" style={{ height: `${height}` }}>
        <ul className="event-list">
          {tempList ? tempList.map((item, idx) => {
            return (
              <MarkBlock module={'打点'} func={'活动墙'} action={'打开活动墙'} memo={item.id}
                         onClick={() => this.goEvent(item)} key={idx}>
                <li className="event-item">
                  <div className="head-pic">
                    <img src={item.pic}/>
                  </div>
                  <div className="event-info">
                    <div className="title">
                      {item.title}
                    </div>
                    <div className="password">{item.subHead}</div>
                    <div className="describe">
                      {item.publisher}
                    </div>
                    <div className="time">
                      {item.time}
                    </div>
                  </div>
                </li>
              </MarkBlock>
            )
          }) : null}
        </ul>
        <div className="show-more">没有更多了</div>
      </div>
    )
  }

  renderBanner() {
    const { bannerList } = this.state
    if(bannerList) {
      return (
        <Banner height={`17.5rem`}>
          {bannerList.map((item, key) => {
            return (
              <MarkBlock module={'打点'} func={'活动墙'} action={'打开Banner'} memo={item.id}
                         className="banner-item swiper-slide" onClick={() => this.goBannerEvent(item)} key={key}>
                <img src={item.pic} style={{ width: '100%', height: '17.5rem' }}/>
              </MarkBlock>
            )
          })}
        </Banner>
      )
    }
  }

  render() {
    return (
      <div className="layout"
           style={{ overflow: `${this.bannerHeight > (window.innerHeight - 60) ? 'auto' : 'hidden'}` }}>
        {this.renderBanner()}
        <div className="event-wall-tab">
          <div className="navbar">
            <div className={`navbar-item ${this.state.tab == 1 ? 'active' : ''}`}
                 onClick={e => this.setState({ tab: 1 })}>
              <span>作业分析</span>
            </div>
            <div className={`navbar-item ${this.state.tab == 2 ? 'active' : ''}`}
                 onClick={e => this.setState({ tab: 2 })}>
              <span>大咖直播</span>
            </div>
            <div className={`navbar-item ${this.state.tab == 3 ? 'active' : ''}`}
                 onClick={e => this.setState({ tab: 3 })}>
              <span>线下活动</span>
            </div>
            <div
              className={`navbar-item ${this.state.tab == 4 ? 'active' : ''}`}
              onClick={e => this.setState({ tab: 4 })}>
              <span>更多精彩</span>
            </div>
          </div>
        </div>
        {this.renderTabBody()}
        <ToolBar/>
      </div>
    )
  }
}
