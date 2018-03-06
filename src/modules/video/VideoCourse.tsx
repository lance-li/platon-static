import React, { Component } from 'react';
import { connect } from 'react-redux';
import './VideoCourse.less';
import classNames from 'classnames';
import { unScrollToBorder } from '../../utils/helpers'

@connect(state => state)
export class VideoCourse extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      navActive: 1
    };

  }

  componentDidMount() {
    unScrollToBorder('.course-content-body')
  }

  render() {
    const { navActive } = this.state;
    return (
      <div className="video-course">
        <div className="body-wrapper">
          <div className="video-area">
            <video src="https://static.iqycamp.com/video/preacher_video_1.mp4"
                   controls={true}
                   poster="https://static.iqycamp.com/images/stage3_poster.jpeg?imageslim">
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
              揭秘VC行业的神秘秘那啥神秘反
            </div>
          </div>
          <div className="course-container">
            <div className="course-content-wrapper">
              <div className={classNames('course-content', { 'active': navActive === 1 })}>
                <ul className="course-list course-content-body">
                  <li className="course-item play">
                    <div className="course-item-text">
                      VC到底是怎么样运作的
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      VC到底是怎么样赚钱的
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                  <li className="course-item pause">
                    <div className="course-item-text">
                      我的投资逻辑
                    </div>
                  </li>
                </ul>
              </div>

              <div className={classNames('course-content', { 'active': navActive === 2 })}>
                <div className="course-content-body course-detail">
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      适合人群
                    </div>
                    <div className="detail-text">
                      积分旧文件，蜂王浆微积分喷雾剂。而且哦几千万巨额我关闭哦围观IE诶过hi噢换个，废粉盒IE我和父亲。fejhfioewhfweoifhwieoh分为非法
                    </div>
                  </div>
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      课程介绍
                    </div>
                    <div className="detail-text">
                      积分旧文件，蜂王浆微积分喷雾剂。而且哦几千万巨额我关闭哦围观IE诶过hi噢换个，废粉盒IE我和父亲。fejhfioewhfweoifhwieoh分为非法
                    </div>
                  </div>
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      课程介绍
                    </div>
                    <div className="detail-text">
                      积分旧文件，蜂王浆微积分喷雾剂。而且哦几千万巨额我关闭哦围观IE诶过hi噢换个，废粉盒IE我和父亲。fejhfioewhfweoifhwieoh分为非法
                    </div>
                  </div>
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      课程介绍
                    </div>
                    <div className="detail-text">
                      积分旧文件，蜂王浆微积分喷雾剂。而且哦几千万巨额我关闭哦围观IE诶过hi噢换个，废粉盒IE我和父亲。fejhfioewhfweoifhwieoh分为非法
                    </div>
                  </div>
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      课程介绍
                    </div>
                    <div className="detail-text">
                      积分旧文件，蜂王浆微积分喷雾剂。而且哦几千万巨额我关闭哦围观IE诶过hi噢换个，废粉盒IE我和父亲。fejhfioewhfweoifhwieoh分为非法
                    </div>
                  </div>
                  <div className="detail-wrapper">
                    <div className="detail-topic">
                      讲师介绍
                    </div>
                    <div className="detail-text">
                      积分旧文件，蜂王浆微积分喷雾剂。而且哦几千万巨额我关闭哦围观IE诶过hi噢换个，废粉盒IE我和父亲。fejhfioewhfweoifhwieoh分为非法
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
