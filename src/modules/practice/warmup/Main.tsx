import * as React from "react";
import { connect } from "react-redux";
import { remove, set, merge,get,findIndex,isBoolean } from "lodash";
import "./Main.less";
import { answer,loadWarmUpAnalysis,getOpenStatus,openConsolidation } from "./async";
import { startLoad, endLoad, alertMsg } from "../../../redux/actions";
import Audio from "../../../components/Audio";
import KnowledgeViewer from "../components/KnowledgeViewer";
import Tutorial from "../../../components/Tutorial"

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
export class Main extends React.Component <any, any> {
  constructor() {
    super()
    this.state = {
      list: [],
      currentIndex: 0,
      practiceCount: 0,
      selected: [],
      knowledge: {},
      showKnowledge: false,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { dispatch, location } = this.props
    const { practicePlanId } = location.query
    dispatch(startLoad())
    loadWarmUpAnalysis(practicePlanId).then(res=>{
      dispatch(endLoad())
      const { code, msg } = res
      if (code === 200){
        const { practice } = msg;
        if(practice){
          let idx = findIndex(practice,(item)=>{
            const {choiceList} = item;
            if(choiceList){
              return choiceList.filter(choice=>choice.selected).length > 0;
            } else {
              return false;
            }
          })
          if(idx !== -1){
            this.context.router.push({
              pathname: '/rise/static/practice/warmup/analysis',
              query: { practicePlanId, kid: location.query.kid, series:location.query.series }
            })
          } else {
            this.setState({ list: msg, practiceCount: msg.practice.length })
          }
        }
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })

    getOpenStatus().then(res=>{
      if(res.code === 200){
        this.setState({openStatus:res.msg});
      }
    })

  }

  onChoiceSelected(choiceId) {
    const { list, currentIndex, selected } = this.state
    const curPractice = list.practice[currentIndex]
    // 暂时没有单选了
    // if (curPractice.type === 1) {
    //   // 单选
    //   this.setState({ selected: [choiceId] })
    // } else if (curPractice.type === 2) {
    let _list = selected
    if (_list.indexOf(choiceId) > -1) {
      remove(_list, n => n === choiceId)
    } else {
      _list.push(choiceId)
    }
    this.setState({ selected: _list })
    // }
  }

  setChoice(cb) {
    let { list, currentIndex, selected } = this.state
    set(list, `practice.${currentIndex}.choice`, selected)
    this.setState({ list })
    if (cb) {
      cb(list.practice)
    }
  }

  prev(){
    const { currentIndex, list } = this.state
    if(currentIndex>0){
      this.setChoice()
      const selected = list.practice[`${currentIndex-1}`].choice
      this.setState({currentIndex:currentIndex-1, selected})
    }
    this.refs.warmup.scrollTop = 0
  }

  next(){
    const { dispatch } = this.props
    const { selected, list, currentIndex, practiceCount } = this.state
    if (selected.length === 0) {
      dispatch(alertMsg("你还没有选择答案哦"))
      return
    }
    if(currentIndex < practiceCount - 1){
      this.setChoice()
      let selected = list.practice[`${currentIndex+1}`].choice
      if(!selected){
        selected = []
      }
      this.setState({currentIndex:currentIndex+1, selected})
    }
    this.refs.warmup.scrollTop = 0
  }

  onSubmit() {
    const { dispatch } = this.props
    const { selected, practice, currentIndex, practiceCount } = this.state
    const { practicePlanId } = this.props.location.query
    if (selected.length === 0) {
      dispatch(alertMsg("你还没有选择答案哦"))
      return
    }
    if (currentIndex === practiceCount - 1) {
      this.setChoice(p => {
        dispatch(startLoad());
        answer({ practice: p }, practicePlanId).then(res => {
          dispatch(endLoad());
          const { code, msg } = res
          if (code === 200)  this.context.router.push({
            pathname: '/rise/static/practice/warmup/result',
            query: merge(msg, this.props.location.query)
          })
          else dispatch(alertMsg(msg))
        }).catch(ex => {
          dispatch(endLoad())
          dispatch(alertMsg(ex))
        })
      })
    }
  }

  closeModal() {
    this.setState({ showKnowledge: false })
  }

  tutorialEnd(){
    const {dispatch} = this.props
    const {openStatus} = this.state
    openConsolidation().then(res => {
      const {code,msg} = res
      if(code === 200){
        this.setState({openStatus:merge({},openStatus,{openConsolidation:true})})
      } else {
        dispatch(alertMsg(msg))
      }
    })
  }

  render() {
    const { list, currentIndex, selected, practiceCount, showKnowledge, openStatus={} } = this.state
    const { practice = [] } = list

    const questionRender = (practice) => {
      const { question, voice, analysis, choiceList = [], score = 0 } = practice
      return (
        <div className="intro-container">
          { practiceCount !== 0 && currentIndex <= practiceCount - 1 ? <div className="intro-index">
            <span className="index">第{currentIndex + 1}/{practiceCount}题</span>
            <span className="type"><span className="number">{score}</span>分</span>
          </div> : null}
          { voice ? <div className="context-audio">
            <Audio url={voice}/>
          </div> : null }
          <div className="question">
            <div dangerouslySetInnerHTML={{__html: question}}></div>
          </div>
          <div className="choice-list">
            {choiceList.map((choice, idx) => choiceRender(choice, idx))}
          </div>
          <div className="knowledge-link" onClick={() => this.setState({showKnowledge: true})}>不确定? 瞄一眼知识点</div>
        </div>
      )
    }

    const choiceRender = (choice, idx) => {
      const { id, subject } = choice
      return (
        <div key={id} className={`choice${selected.indexOf(id) > -1 ? ' selected' : ''}`}
             onClick={e => this.onChoiceSelected(id)}>
          <span className="index">{sequenceMap[idx]}</span>
          <span className="text">{subject}</span>
        </div>
      )
    }

    return (
      <div>
        {showKnowledge ? <KnowledgeViewer knowledge={practice[currentIndex].knowledge} closeModal={this.closeModal.bind(this)}/> :
          <div>
            <div className="container has-footer" style={{height: window.innerHeight - 49}} ref={'warmup'}>
              <div className="warm-up">
                {practice[currentIndex]? <div className="page-header">{practice[currentIndex].knowledge.knowledge}</div>:null}
                {questionRender(practice[currentIndex] || {})}
              </div>
            </div>
            <div className="button-footer">
              <div className={`left origin ${currentIndex === 0 ? ' disabled' : ''}`} onClick={this.prev.bind(this)}>上一题
              </div>
              { currentIndex !== practiceCount - 1 ? <div className={`right`} onClick={this.next.bind(this)}>下一题</div> :
                <div className={`right`} onClick={this.onSubmit.bind(this)}>提交</div>
              }
            </div>
          </div>
        }
        <Tutorial bgList={['http://www.iqycamp.com/images/fragment/rise_tutorial_ggxl_0414.png']} show={isBoolean(openStatus.openConsolidation) && !openStatus.openConsolidation} onShowEnd={()=>this.tutorialEnd()}/>
      </div>
    )
  }
}
