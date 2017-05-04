import * as React from "react";
import {connect} from "react-redux"
import "./KnowledgeViewer.less";
import AssetImg from "../../../components/AssetImg";
import Audio from "../../../components/Audio";
import { isEmpty } from "lodash"
import {loadDiscuss,discussKnowledge} from "../knowledge/async"
import DiscussShow from "./DiscussShow"
import Discuss from "./Discuss"

import { startLoad, endLoad, alertMsg } from "../../../redux/actions";

@connect(state=>state)
const sequenceMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
}

@connect(state=>state)
export default class KnowledgeViewer extends React.Component<any, any> {
  constructor(props) {
    super()
    this.state = {
      showTip:false,
      showDiscuss:false,
      commentId:0,
    }
  }

  componentWillMount(){
    const { knowledge, closeModal } = this.props
    if(!isEmpty(knowledge)){
      console.log('mount load',knowledge);
      loadDiscuss(knowledge.id,1)
        .then(res=>{
          if(res.code === 200){
            console.log("ok",res.msg);
            this.setState({discuss:res.msg})
          }
        });
    }

  }

  componentWillReceiveProps(nextProps){
    if(isEmpty(this.props.knowledge) && !isEmpty(nextProps.knowledge)){
      // 设置了knowledge
      const {knowledge} = nextProps;
      console.log('receive load',knowledge);
      loadDiscuss(knowledge.id,1)
        .then(res=>{
          if(res.code === 200){
            console.log("ok",res.msg);
            this.setState({discuss:res.msg})
          }
        });
    }
  }


  reply(repliedId){
    console.log('replay',repliedId);
    this.setState({showDiscuss:true, repliedId})
  }

  reload(){
    const {knowledge} = this.props;
    loadDiscuss(knowledge.id,1)
      .then(res=>{
        if(res.code === 200){
          this.setState({discuss:res.msg,showDiscuss:false})
        }
      });
    // this.setState({ showDiscuss: false })
  }

  render() {
    const { knowledge, closeModal } = this.props
    const { showTip,showDiscuss,repliedId } = this.state
    const { analysis, means, keynote, audio, pic,example,id } = knowledge

    const choiceRender = (choice, idx) => {
      const {id, subject} = choice
      return (
          <div key={id} className={`choice${choice.isRight ? ' right' : ''}`}>
          <span className={`index`}>
            {sequenceMap[idx]}
          </span>
            <span className={`subject`}>{subject}</span>
          </div>
      )
    }

    const rightAnswerRender = (choice, idx) => {
      return (choice.isRight? sequenceMap[idx]+' ' :'')
    }

    return (
      <div className={`knowledge-page${closeModal? '': ' no-footer'}`}>
        <div className={`container${closeModal? ' has-footer': ''}`}>
          <div className="page-header">{knowledge.knowledge}</div>
          <div className="intro-container">
            { audio ? <div className="context-audio"><Audio url={audio}/></div> : null }
            { pic ? <div className="context-img"><img src={pic}/></div> : null }
            { analysis?
                <div>
                  <div className="context-title-img">
                    <AssetImg width={'100%'} url="http://www.iqycamp.com/images/fragment/analysis2.png"/>
                  </div>
                  <div className="text">
                    <pre>{analysis}</pre>
                  </div>
                </div>
                : null}
            { means?
                <div>
                  <div className="context-title-img">
                    <AssetImg width={'100%'} url="http://www.iqycamp.com/images/fragment/means2.png"/>
                  </div>
                  <div className="text">
                    <pre>{means}</pre>
                  </div>
                </div>
                : null }
            {keynote ?<div><div className="context-title-img">
                  <AssetImg width={'100%'} url="http://www.iqycamp.com/images/fragment/keynote2.png"/>
                </div><div className="text">
                  <pre>{keynote}</pre>
                </div></div>: null}
            {example ?
                <div>
                  <div className="context-title-img">
                    <AssetImg width={'100%'} url="http://www.iqycamp.com/images/fragment/example.png"/>
                  </div>
                  <div className="question">
                    <div className="context" dangerouslySetInnerHTML={{__html: example.question}}></div>
                  </div>
                  <div className="choice-list">
                    {example.choiceList.map((choice, idx) => choiceRender(choice, idx))}
                  </div>

                  {showTip?
                  <div className="analysis">
                    <div className="title-bar">解析</div>
                    <div className="context">
                      正确答案：{example.choiceList.map((choice, idx) => rightAnswerRender(choice, idx))}
                    </div>
                    <div className="context"
                         dangerouslySetInnerHTML={{__html: example.analysis}}></div>
                  </div>
                      :<div className="analysis"><div className="analysis-tip" onClick={() => this.setState({showTip:true})}>点击查看解析</div></div>}
                  <div className="title-bar">问答</div>
                  <div className="discuss">
                    {this.state.discuss ? this.state.discuss.map(item => {
                      return <DiscussShow discuss={item} reply={()=>{this.reply(item.id)}}/>
                    }) : null}
                  </div>
                </div>
            : null}
            </div>
        </div>
        <div className="writeDiscuss" onClick={() => this.setState({showDiscuss: true, repliedId:0})}>
          <AssetImg url="http://www.iqycamp.com/images/discuss.png" width={45} height={45}></AssetImg>
        </div>
        {closeModal?<div className="button-footer" onClick={closeModal}>返回</div>:null}
        {showDiscuss ?<Discuss repliedId={repliedId} referenceId={id}
                               closeModal={(body)=> this.reload()} discuss={(body)=>discussKnowledge(body)}  /> : null}
      </div>
    )
  }
}
