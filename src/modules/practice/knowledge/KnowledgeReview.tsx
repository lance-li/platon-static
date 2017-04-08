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
    const {roadMapList=[]} = data;

    const renderKnowledge = (knowledgeList) => {

      return knowledgeList.map((knowledge, idx)=> {
        return (
            <div key={idx} className="content" onClick={this.goKnowledgeIntro.bind(this, knowledge)}>
              {knowledge.knowledge}
            </div>
        )
      })
    }

    return(
          showProblem ?
          <ProblemViewer readonly="true" problem={data} closeModal={()=>this.setState({showProblem:false})}/> :
          showKnowledge?
          <KnowledgeViewer knowledge={knowledge} closeModal={()=>this.setState({showKnowledge:false})}/> :
          <div className="problem-detail">
            <div className="detail-header click" onClick={()=>this.setState({showProblem:true})}
                 style={{marginBottom:'10px',borderBottom:"none"}}>
              <div className="header-label" style={{float:"left"}}>
                专题详情
              </div>
            </div>
            <div className="detail-header">
              专题知识点
            </div>
            <div className="detail-container">
              {roadMapList ? roadMapList.map((item, index) => {
                    return (
                        <div key={index} className="item">
                          <div className="label">
                            第{item.series}节{' '}{item.step}
                          </div>
                          {renderKnowledge(item.knowledgeList)}
                        </div>
                    )
                  }) : null}
            </div>
          </div>
    )
  }
}
