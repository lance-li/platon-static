import * as React from 'react';
import { connect } from 'react-redux';
import './ImprovementReport.less'
import { startLoad, endLoad, alertMsg } from "redux/actions";
import { queryReport } from './async'
import { Modal } from '../../components/Modal'
import {isNumber,merge} from 'lodash';
import { startLoad, endLoad, alertMsg } from "redux/actions";
import {NumberToChinese} from '../../utils/helpers'
const numeral = require('numeral');


@connect(state=>state)
export class ImprovementReport extends React.Component<any,any> {
  constructor() {
    super();
    this.state = {};
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const {planId} = this.props.location.query;
    const {dispatch} = this.props;
    dispatch(startLoad());
    queryReport(planId).then((res) => {
      dispatch(endLoad());
      if (res.code === 200) {
        this.setState({planData: res.msg});
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
    this.picHeight = (window.innerWidth / (750 / 350)) > 175 ? 175 : (window.innerWidth / (750 / 350))

  }


  renderChapterScores() {
    const {planData = {}} = this.state;
    const {
      problem, studyDays, percent, receiveVoteCount, shareVoteCount, totalScore, integratedTotalScore, integratedShouldCount,
      integratedScore, integratedCompleteCount, chapterList, applicationTotalScore, applicationShouldCount,
      applicationScore, applicationCompleteCount, checkStatus
    } = planData;
    if (chapterList) {
      return chapterList.map((item, key) => {
        let clazz = 'complete-item ' + (key === 0 ? 'first' : '');
        return (
          <div className={clazz}>
            <div className="info">
              <span className="name">{NumberToChinese(item.chapter)}、{item.name}</span>
              {/*<span className="score"><span className="point number">{item.myWarmScore}</span> / <span className="number">{item.totalWarmScore}</span></span>*/}
              <div className="clear"></div>
            </div>
            <Progress progressStyle={{width:`${window.innerWidth - 170}px`}} score={item.myWarmScore}
                      totalScore={item.totalWarmScore}/>
          </div>
        )
      })
    } else {
      return null;
    }
  }

  renderApplicationScores() {
    const {planData = {}} = this.state;
    const {
      problem, studyDays, percent, receiveVoteCount, shareVoteCount, totalScore, integratedTotalScore, integratedShouldCount,
      integratedScore, integratedCompleteCount, chapterList, applicationTotalScore, applicationShouldCount,
      applicationScore, applicationCompleteCount
    } = planData;
    let renderArr = [];

    let applications = (
      <div className="complete-item first">
        <div className="info">
          <span className="name">应用练习完成 <span
            className="big-point">{applicationCompleteCount}</span> / {applicationShouldCount} 份，得分：</span>
          <div className="clear"></div>
        </div>
        <Progress holderClass="article" progressStyle={{width:`${window.innerWidth - 170}px`}} score={applicationScore}
                  totalScore={applicationTotalScore}/>
      </div>
    )


    let integrates = (
      <div className="complete-item first">
        <div className="info">
          <span className="name">综合练习完成 <span
            className="big-point">{integratedCompleteCount}</span> / {integratedShouldCount} 份，得分：</span>
          <div className="clear"></div>
        </div>
        <Progress holderClass="article" progressStyle={{width:`${window.innerWidth - 170}px`}} score={integratedScore}
                  totalScore={integratedTotalScore}/>
      </div>
    );
    renderArr.push(applications);
    renderArr.push(integrates);
    return renderArr;


  }


  chooseNew() {
    const {planData = {}, showConfirmModal} = this.state;
    const {dispatch} = this.props;
    const {status, mustStudyDays} = planData;
    if (status !== 1 && isNumber(mustStudyDays) && mustStudyDays !== 0) {
      dispatch(alertMsg(`学得太猛了，再复习一下吧<br/>本小课推荐学习天数至少为${mustStudyDays}天<br/>之后就可以开启下一小课了`))
    } else {
      this.setState({showConfirmModal: true})
    }
  }


  goBack() {
    const {planId} = this.props.location.query;
    const {planData = {}} = this.state;
    this.context.router.push({
      pathname: '/rise/static/learn',
      query: {
        planId: planId ? planId : planData.planId
      }
    });
  }

  nextPlan() {
    const {dispatch, location} = this.props
    const {planId} = location.query
    this.context.router.push("/rise/static/problem/explore")
  }

  closeConfirmModal() {
    this.setState({showConfirmModal: false});
  }

  renderBtns() {
    const {planData = {}, showConfirmModal} = this.state;
    const {
      problem, studyDays, percent, receiveVoteCount, shareVoteCount, totalScore, integratedTotalScore, integratedShouldCount,
      integratedScore, integratedCompleteCount, chapterList, applicationTotalScore, applicationShouldCount,
      applicationScore, applicationCompleteCount, pic, showNextBtn
    } = planData;
    // if(showNextBtn){
    return (
      <div className="button-footer">
        <div className="left" onClick={this.chooseNew.bind(this)}>选择新小课</div>
        <div className="right" onClick={this.goBack.bind(this)}>返回本小课</div>
      </div>
    )
    // } else {
    //   return (
    //     <div className="button-footer">
    //       <div  onClick={this.goBack.bind(this)}>返回本小课</div>
    //     </div>
    //   )
    // }

  }


  render() {
    const {planData = {}, showConfirmModal} = this.state;
    const {
      problem, studyDays, percent, receiveVoteCount, shareVoteCount, totalScore, integratedTotalScore, integratedShouldCount,
      integratedScore, integratedCompleteCount, chapterList, applicationTotalScore, applicationShouldCount,
      applicationScore, applicationCompleteCount, pic, showNextBtn
    } = planData;
    return (
      <div className="improvement-report">
        <Modal show={showConfirmModal}
               height={240}
               buttons={[{click:()=>this.nextPlan(),content:"确定"},{click:()=>this.closeConfirmModal(),content:"取消"}]}>
          <div className="content" style={{marginTop:'0px'}}>
            <div className="text">确定开始下一小课吗？</div>
          </div>
          <div className="content2">
            <div className="text2">当前小课可以进入我的-我的小课中复习</div>
          </div>
        </Modal>


        <div className="header" style={{height: this.picHeight}}>
          <img className="bg" src={`https://static.iqycamp.com/images/study_report_bg.jpeg`}/>
          <div className="msg">
            <div className="title">
              学习报告
            </div>
            <div className="problem-title">
              小课：{problem}
            </div>
            <div className="sub-text">
              总得分：<span className="socre">{totalScore}</span> ，打败了<span className="percent"> {percent}% </span>的同学
            </div>
            <div className="time">
              学习时长：{studyDays === -1 ? '30天' : `${studyDays} 天`}
            </div>
          </div>
        </div>
        <div className="body-container">
          <div className="body">
            <div className="header">
              <span className="title">各章巩固练习得分</span>
              {/*<span className="question">?</span>*/}
            </div>
            {this.renderChapterScores()}
          </div>

          <div className="body" style={{marginTop:'36px'}}>
            <div className="header">
              <span className="title">应用练习&综合练习</span>
              {/*<span className="question">?</span>*/}
            </div>
            {this.renderApplicationScores()}
            <div className="vote-info">
              共送出 <span className="big-point">{shareVoteCount}</span> 个赞  收获 <span
              className="big-point">{receiveVoteCount}</span> 个赞
            </div>
          </div>
          <div className="tips">不错！你还可以拿到更多积分，点击右下角按钮，返回小课完成更多练习吧！</div>
          <div className="padding-footer" style={{height:'80px'}}/>
        </div>
        {this.renderBtns()}
      </div>
    )
  }
}


class Progress extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {}
  }

  calculatePercent(score,total){
    let tempScore = score/total;
    if(isNumber(tempScore)){
      if(tempScore<0.05){
        tempScore = 0.05;
      } else if(tempScore > 1){
        tempScore = 1;
      }

      tempScore = numeral(tempScore*100).format('0.00');
    } else {
      tempScore = 0;
    }
    return tempScore;
  }

  // appScore

  render(){
    let progressStyle = merge({width:'50%'},this.props.progressStyle);

    return (
      <div>
        <div className="progress" style={progressStyle}>
          <div className="track"/>
          <div className={`holder ${this.props.holderClass?this.props.holderClass:''}`}  style={{width:`${this.calculatePercent(this.props.score,this.props.totalScore)}%`}}>
            {/*<div className="slider">*/}
            {/*</div>*/}
          </div>
        </div>
        <span className="score" style={{width:'65px'}}><span className="point number">{this.props.score}</span> / <span className="number">{this.props.totalScore}</span></span>
      </div>
    )
  }
}
