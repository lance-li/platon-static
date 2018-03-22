import React from 'react';
import { connect } from 'react-redux';
import './VideoCourse.less';
import classNames from 'classnames';
import { unScrollToBorder } from '../../utils/helpers'
import { loadVideoCourse } from './async'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import _ from "lodash"

@connect(state => state)
export default class VideoCourse extends React.Component<any, any> {
  constructor() {
    super();
    this.state = {
      navActive: 1,
      playVideo: '',
      playPoster: '',
      data: {},
    }
  }

  async componentWillMount() {
    const { id } = this.props.location.query
    let res = await loadVideoCourse(id)
    const { msg, code } = res
    if(code === 200) {
      const { videoList } = msg
      const video = videoList[ 0 ]
      this.setState({ data: msg, playVideo: video.url, playPoster: video.picUrl })
    }
  }

  componentDidMount() {
    unScrollToBorder('.course-content-body')
  }

  play(video) {
    const { dispatch } = this.props
    const { data } = this.state
    const { videoList = [] } = data

    for(let i=0;i<videoList.length;i++) {
      let v = videoList[i]
      if(v.id === video.id) {
        let playStatus = v.play
        _.set(videoList[i], 'play', !playStatus)
        this.setState({ data, playVideo: video.url, playPoster: video.picUrl })
        //控制播放器
        if(playStatus) {
          this.refs.videoCourse.pause()
        } else {
          this.refs.videoCourse.play()
        }
        break
      }
    }

  }

  render() {
    const { navActive, playVideo, playPoster, data } = this.state
    const { title, videoList = [], courseIntro, lecturerIntro } = data

    const renderPlayVideo = () => {
      return videoList.map((video, index) => {
        return (
          <li key={index} className={classNames('course-item', { 'play': video.play, 'pause': !video.play })}
              onClick={()=>this.play(video)}>
            <div className="course-item-text">
              {video.name}
            </div>
          </li>
        )
      })
    }

    return (
      <div className="video-course">
        <div className="body-wrapper">
          <div className="video-area">
            <video src={playVideo}
                   controls="controls"
                   poster={playPoster} ref="videoCourse">
            </video>
          </div>
          <div className="course-nav-list">
            <div className={classNames('course-nav-wrapper', { 'active': navActive === 1 })}
                 onClick={() => this.setState({ navActive: 1 })}>
              <div className='course-nav'>
                目录
              </div>
            </div>
            <div className={classNames('course-nav-wrapper', { 'active': navActive === 2 })}
                 onClick={() => this.setState({ navActive: 2 })}>
              <div className='course-nav'>
                详情
              </div>
            </div>
          </div>
          <div className="course-header-wrapper">
            <div className="course-header-text">
              {title}
            </div>
          </div>
          <div className="course-container">
            <div className="course-content-wrapper">
              <div className={classNames('course-content', { 'active': navActive === 1 })}>
                <ul className="course-list course-content-body">
                  {renderPlayVideo()}
                </ul>
              </div>

              <div className={classNames('course-content', { 'active': navActive === 2 })}>
                <div className="course-content-body course-detail">
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      讲师介绍
                    </div>
                    <div className="detail-text">
                      {lecturerIntro}
                    </div>
                  </div>
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      课程介绍
                    </div>
                    <div className="detail-text">
                      {courseIntro}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
