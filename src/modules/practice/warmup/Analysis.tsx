import * as React from "react";
import {connect} from "react-redux";
import "./Main.less";
import {loadWarmUpAnalysis, loadWarmUpDiscuss,discuss, deleteComment} from "./async";
import {startLoad, endLoad, alertMsg} from "../../../redux/actions";
import AssetImg from "../../../components/AssetImg";
import KnowledgeViewer from "../components/KnowledgeViewer";
import Discuss from "../components/Discuss";
import DiscussShow from "../components/DiscussShow";
import _ from "lodash"

const sequenceMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
}

@connect(state => state)
export class Analysis extends React.Component <any, any> {
  constructor() {
    super()
    this.state = {
      list: [],
      currentIndex: 0,
      practiceCount: 0,
      showKnowledge: false,
      showDiscuss: false,
      repliedId: 0,
      warmupPracticeId: 0,
      pageIndex:1,
      integrated:false,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillReceiveProps(newProps) {
    if (this.props.location.query.practicePlanId !== newProps.location.query.practicePlanId) {
      this.componentWillMount(newProps)
    }
  }

  componentWillMount(props) {
    const {dispatch, location} = props || this.props
    this.setState({currentIndex: 0})
    const {practicePlanId, integrated} = location.query
    this.setState({integrated})
    dispatch(startLoad())
    loadWarmUpAnalysis(practicePlanId).then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if (code === 200) this.setState({list: msg, practiceCount: msg.practice.length})
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  next() {
    const {dispatch} = this.props
    const {currentIndex, practiceCount} = this.state
    if (currentIndex < practiceCount - 1) {
      this.setState({currentIndex: currentIndex + 1})
    }
    this.refs.warmup.scrollTop = 0
  }

  prev() {
    const {dispatch} = this.props
    const {currentIndex} = this.state
    if (currentIndex > 0) {
      this.setState({currentIndex: currentIndex - 1})
    }
    this.refs.warmup.scrollTop = 0
  }

  nextTask() {
    const {dispatch} = this.props
    const {series, planId} = this.props.location.query
    this.context.router.push({
      pathname: '/rise/static/plan/main',
      query: {series,planId}
    })
  }

  closeModal() {
    this.setState({showKnowledge: false})
  }

  closeDiscussModal() {
    const {dispatch} = this.props
    let {list, currentIndex} = this.state
    const {practice = []} = list
    const {id} = practice[currentIndex]

    loadWarmUpDiscuss(id, 1).then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if (code === 200) {
        _.set(list, `practice.${currentIndex}.discussList`, msg)
        this.setState({showDiscuss: false, list})
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })

    window.location.href = '#discuss'

  }

  reply(warmupPracticeId, repliedId){
    this.setState({showDiscuss:true, warmupPracticeId, repliedId})
  }

  onDelete(discussId){
    const {dispatch} = this.props

    deleteComment(discussId).then(res=>{
      let {list, currentIndex} = this.state
      const {practice = []} = list
      const {id} = practice[currentIndex]

      loadWarmUpDiscuss(id, 1).then(res => {
        dispatch(endLoad())
        const {code, msg} = res
        if (code === 200) {
          _.set(list, `practice.${currentIndex}.discussList`, msg)
          this.setState({showDiscuss: false, list})
        }
        else dispatch(alertMsg(msg))
      }).catch(ex => {
        dispatch(endLoad())
        dispatch(alertMsg(ex))
      })
    })
  }

  render() {
    const {list, currentIndex, selected, practiceCount,
      showKnowledge, showDiscuss, repliedId, integrated} = this.state
    const {practice = []} = list

    const questionRender = (practice) => {
      const {id, question, pic, choiceList = [], score = 0, discussList = []} = practice
      return (
        <div>
          <div className="intro-container">
            { practiceCount !== 0 && currentIndex <= practiceCount - 1 ? <div className="intro-index">
                <span className="index">第{currentIndex + 1}/{practiceCount}题</span>
                <span className="type"><span className="number">{score}</span>分</span>
              </div> : null}
            {pic ? <div className="context-img">
                  <AssetImg url={pic}/></div>:null
            }
            <div className="question">
              <div dangerouslySetInnerHTML={{__html: question}}></div>
            </div>
            <div className="choice-list">
              {choiceList.map((choice, idx) => choiceRender(choice, idx))}
            </div>
            <div className="analysis">
              <div className="title-bar">解析</div>
              <div className="context">
                正确答案：{choiceList.map((choice, idx) => rightAnswerRender(choice, idx))}
              </div>
              <div className="context" style={{marginBottom:15}}>
                已选答案：{choiceList.map((choice, idx) => myAnswerRender(choice, idx))}
              </div>
              <div className="context"
                   dangerouslySetInnerHTML={{__html: practice ? practice.analysis : ''}}></div>
              {integrated=='false' ?
                  <div className="knowledge-link" onClick={() => this.setState({showKnowledge: true})}>点击查看相关知识</div>:null
              }
            </div>
            <div className="writeDiscuss" onClick={() => this.setState({showDiscuss: true, warmupPracticeId: id, repliedId:0})}>
              <AssetImg url="https://www.iqycamp.com/images/discuss.png" width={45} height={45}></AssetImg>
            </div>
          </div>
          <div className="discuss-container">
            <div className="discuss">
              <a name="discuss"/>
              <div className="title-bar">问答</div>
              {discussList.map((discuss, idx) => discussRender(discuss, idx))}
              { discussList.length > 0 ?
                <div className="show-more">
                  你已经浏览完所有的讨论啦
                </div>
                :
                <div className="discuss-end">
                  <div className="discuss-end-img">
                    <AssetImg url="https://www.iqycamp.com/images/no_comment.png" width={94} height={92}></AssetImg>
                  </div>
                  <span className="discuss-end-span">点击左侧按钮，发表第一个好问题吧</span>

                </div>
              }
            </div>
          </div>
        </div>
      )
    }

    const discussRender = (discuss, idx) => {
      return (
        <DiscussShow discuss={discuss} reply={this.reply.bind(this)} onDelete={this.onDelete.bind(this, discuss.id)}/>
      )
    }

    const choiceRender = (choice, idx) => {
      const {id, subject} = choice
      return (
        <div key={id} className={`choice${choice.selected ? ' selected' : ''}${choice.isRight ? ' right' : ''}`}>
          <span className={`index`}>
            {choice.isRight ? <AssetImg type="right" width={13} height={8}/> : sequenceMap[idx]}
              {/*( choice.selected ? <AssetImg type="wrong" size={10}/> : sequenceMap[idx])}*/}
          </span>
          <span className={`text`}>{subject}</span>
        </div>
      )
    }

    const rightAnswerRender = (choice, idx) => {
      return (choice.isRight? sequenceMap[idx]+' ' :'')
    }

    const myAnswerRender = (choice, idx) => {
      return (choice.selected? sequenceMap[idx]+' ' :'')
    }

    return (
      <div>
        <div className="container has-footer" ref={'warmup'}>
          <div className="warm-up">
            {practice[currentIndex]? <div className="page-header">{practice[currentIndex].knowledge.knowledge}</div>:null}
            {questionRender(practice[currentIndex] || {})}
          </div>
        </div>
        <div className="button-footer">
          <div className={`left ${currentIndex === 0 ? ' disabled' : 'origin'}`} onClick={this.prev.bind(this)}>上一题</div>
          {currentIndex + 1 < practiceCount ?
            <div className={`right`} onClick={this.next.bind(this)}>下一题</div> :
            <div className="right" onClick={this.nextTask.bind(this)}>返回</div>}
        </div>

        {showKnowledge ? <KnowledgeViewer knowledge={practice[currentIndex].knowledge} closeModal={this.closeModal.bind(this)}/> : null}
        {showDiscuss ?<Discuss repliedId={repliedId} referenceId={this.state.warmupPracticeId}
                               closeModal={this.closeDiscussModal.bind(this)} discuss={(body)=>discuss(body)}/> : null}
      </div>
    )
  }
}
