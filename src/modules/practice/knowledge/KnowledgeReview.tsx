import * as React from "react"
import {connect} from "react-redux"
import "./KnowledgeReview.less"
import {set, startLoad, endLoad, alertMsg} from "redux/actions"
import {loadProblem} from "./async"
import ProblemViewer from "../../problem/components/ProblemViewer"
import KnowledgeViewer from "../components/KnowledgeViewer"

@connect(state=>state)
export class KnowledgeReview extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {
      showProblem:false,
      showKnowledge:false,
      knowledge:{},
      data:{},
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount(){
    const {dispatch,location} = this.props;
    dispatch(startLoad())
    loadProblem(location.query.problemId).then(res=>{
      const {code, msg} = res
      if (code === 200) {
        dispatch(endLoad())
        this.setState({ data: msg})
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  goKnowledgeIntro(item){
    this.setState({showKnowledge:true, knowledge:item})
  }


  render(){
    const {showProblem,data,showKnowledge,knowledge} = this.state;
    const {chapterList=[]} = data;

    const renderRoadMap = (chapter, idx) => {
      const {sections} = chapter
      return (
          <div key={idx}>
            <div className='chapter'>{'第'+chapter.chapter+'章 '}{chapter.name}</div>
            {sections?sections.map((section, idx) => renderSection(section, idx, chapter.chapter)):null}
          </div>
      )
    }

    const renderSection = (section, idx, chapter) => {
      return (
      section.integrated?
          <div key={idx}>
            <div className='section'>{chapter}{'.'}{section.section+'节 '}{section.name}</div>
          </div>:
          <div key={idx} onClick={this.goKnowledgeIntro.bind(this, section.knowledge)}>
            <div className='section click'>{chapter}{'.'}{section.section+'节 '}{section.name}</div>
          </div>
      )
    }

    return(
          showProblem ?
          <ProblemViewer readonly="true" problem={data} closeModal={()=>this.setState({showProblem:false})}/> :
          showKnowledge?
          <KnowledgeViewer knowledge={knowledge} closeModal={()=>this.setState({showKnowledge:false})}/> :
          <div className="problem-detail">
            <div className="detail-header click" style={{marginBottom:'10px',borderBottom:"none"}} onClick={()=>this.setState({showProblem:true})}>
              <div className="header-label" style={{float:"left"}}>
                专题介绍
              </div>
            </div>
            <div className="detail-header">
              专题知识点
            </div>
            <div className="detail-container">
              {chapterList ? chapterList.map((item, index) => renderRoadMap(item, index)) : null}
            </div>
          </div>
    )
  }
}
