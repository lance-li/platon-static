import React,{ Component } from 'react';
import { connect } from 'react-redux';
import './VideoCourse.less';

@connect(state => state)
export class VideoCourse extends Component<any,any> {
  constructor(){
    super();
    this.state = {};
  }


  render(){
    return (
      <div className="video-course">
        <div className="video-area">

        </div>
        <div className="course-container">
          <div className="course-nav-container">
            <div className="course-nav">
              目录
            </div>
            <div className="course-nav">
              详情
            </div>
          </div>
          div.
        </div>
      </div>
    )
  }
}
