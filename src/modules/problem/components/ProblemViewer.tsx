import * as React from "react";
import "./ProblemViewer.less";
import AssetImg from "../../../components/AssetImg";
import Audio from "../../../components/Audio";
import { Toast, Dialog } from "react-weui";
const { Alert } = Dialog

export default class ProblemViewer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      alert: {
        buttons: [
          {
            label: '再看看',
            onClick: this.close.bind(this)
          },
          {
            label: '想好了',
            onClick: ()=>{this.setState({showAlert:false});this.props.submitProblem(this.props.problem.id)}
          }
        ]
      }
    }
  }

  componentWillMount() {
    console.log('mount');
  }

  show() {
    this.setState({showAlert: true})
  }

  close() {
    this.setState({showAlert: false})
  }

  render() {
    const {closeModel, submitProblem, problem} = this.props;
    return (
      <div className="problem-page">
        <div className="container has-footer">
          <div className="problem-intro">
            <div className="page-header">{problem.problem}</div>
            <div className="page-content">
              { problem.audio ? <div className="context-audio">
                <Audio url={problem.audio}/>
              </div> : null }
              <div className="context" dangerouslySetInnerHTML={{__html: problem.description}}></div>
              <div className="context-img">
                <img src={problem.descPic} alt=""/>
              </div>
              <div className="context">上图中，带数字编号的是你接下来{problem.length}天要学习的知识点。你每天会练习到其中的两个。这些知识点会以选择题和应用题的方式，来帮助你更好地掌握。</div>
            </div>
          </div>
          <div className="button-footer">
            <div className="left-footer" onClick={()=>closeModel()}>
              返回
            </div>
            <div className="right-footer" onClick={()=>this.show()}>
              学这个
            </div>
          </div>
        </div>
        <Alert { ...this.state.alert }
          show={this.state.showAlert}>
          <p>提交后不能修改，想好了吗？</p>
        </Alert>
      </div>
    )
  }
}
