import * as React from "react";
import "./ProblemPriority.less";
import QueueAnim from 'rc-queue-anim';
import AssetImg from "../../components/AssetImg";
import {loadUnChooseList, createPlan,checkCreatePlan} from "./async";
import {startLoad, endLoad, alertMsg} from "redux/actions";
import {merge, fill, get,isNull} from "lodash";
import {connect} from "react-redux";

@connect(state => state)
export class ProblemPriority extends React.Component<any,any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      catalogOpen: [],
      scrollTimer: null,
      selectProblem: {},
    }
    this.catalogHeight = 304 / 750 * window.innerWidth;
    this.problemMargin = 20/750 * window.innerWidth;
    this.problemHeight = 180/(750-40) * window.innerWidth;
    this.iconSize = 70 / 750 * window.innerWidth;
    this.catalogName = 60 / 750 * window.innerWidth;
    this.catalogMargin = (this.catalogHeight - this.iconSize)/2;
    this.catalogOpenMargin = 40/750 * window.innerWidth;
    this.tipMargin = (this.problemHeight - 44) / 2;
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(startLoad())
    loadUnChooseList().then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if (code === 200) {
        if (!msg.catalogList.length && msg.catalogList.length === 0) {
          // this.context.router.push({ pathname: '/rise/problem/priority' })
          dispatch(alertMsg('问题列表为空, 请联系管理员'))
        } else {
          let catalogOpen = [];
          msg.catalogList.forEach(item => catalogOpen.push(false));
          this.setState(merge({}, msg, {catalogOpen: catalogOpen}));
        }
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  openProblemIntro(problem) {
    this.context.router.push({pathname: '/rise/static/problem/view', query: {id: problem.id}})
  }


  openCatalog(seq, e) {
    const {catalogOpen, scrollTimer} = this.state;
    this.setState({catalogOpen: fill(catalogOpen, !catalogOpen[seq], seq, seq + 1)});
  }

  checkCreatePlan(problemId) {
    const { dispatch } = this.props;
    dispatch(startLoad());
    return checkCreatePlan(problemId).then(res=>{
      dispatch(endLoad());
      if(res.code !== 200){
        dispatch(alertMsg(res.msg));
      }
      return res;
    }).catch(ex=>{
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    });
  }


  render() {
    const {catalogList, catalogOpen} = this.state


    const getCatalogBox = (catalog, seq) => {
      const problemList = isNull(catalog.problemList)?[]:get(catalog,"problemList",[]);
      return (
        <div className="swipe-box"
             style={{backgroundImage:`url(${catalog.pic})`,zIndex:`${seq+200}`,
              marginTop:`${seq!==0?-15:0}px`}}
             key={`swipeBox${seq}`}
        >
          {/*<div className="swipe-box-mask" style={{opacity:`${catalogOpen[seq]?'0.18':'0.25'}`}}></div>*/}
          <div className="swipe-header" onClick={(e)=>this.openCatalog(seq,e)} style={{margin:`${catalogOpen[seq]?this.catalogMargin+'px 20px '+ (this.catalogOpenMargin + 'px'):this.catalogMargin+'px 20px '+(this.catalogMargin+ 'px')}`}}>
            <div className="catalog-name" style={{fontSize:`${this.catalogName}px`,lineHeight:`${this.iconSize}px`}}>{catalog.name}</div>
            <div className="catalog-arrow" style={{height:`${this.iconSize}px`,width:`${this.iconSize}px`}}>
              <AssetImg size={this.iconSize}
                        type={`${catalogOpen[seq]?'arrowUp':'arrowDown'}`}/>
            </div>
          </div>
          <QueueAnim style={{height:`${catalogOpen[seq]?(this.problemHeight-this.problemMargin)*problemList.length+(seq===0?45:55)+'px':0+'px'}`}} appear={false} duration={[0,0]} ease={["easeInQuart","easeInQuart"]} animConfig={[
            {  opacity:[1,0],translateY: [0,-(this.problemHeight+10)*problemList.length+30]},
            {  opacity:[0,1],translateY: [0, (this.problemHeight+10)*problemList.length+30]}
          ]} className="swipe-content" component={"div"}
          >
            {catalogOpen[seq] ?<div
              key={`catalog${seq}`}
            >{problemList ? problemList.map((problem, seq) => {
              return (
                <div onClick={()=>this.openProblemIntro(problem)}
                     className="problem" style={{color:`${catalog.color}`,border:`1px solid ${catalog.color}`,height:`${this.problemHeight}px`,marginTop:`${-this.problemMargin}px`}}
                >
                  <span className={`title ${problem.status!==0?'done':''}`} style={{marginTop:`${this.tipMargin}px`}}>{problem.problem}</span>
                  <span className={`tips ${problem.status!==0?'done':''}`} style={{borderColor:`${catalog.color}`}}>
                    {problem.status === 0 ? '小课介绍' : problem.status === 1 ? '进行中' : '已完成'}</span>
                </div>
              )
            }) : null}
            </div>: null}
          </QueueAnim>
        </div>
      )
    }

    return (
      <div className="no-space-container"
           style={{height:'100%',overflow:'auto'}}>
        {/*<div className="header">*/}
          {/*你好，{window.ENV.userName},我是你的圈外每日提升教练。<br/>*/}
          {/*训练开始前，我想更了解你的情况。*/}
        {/*</div>*/}
        <div className="swipe-container">
          {catalogList ? catalogList.map((catalog, seq) => getCatalogBox(catalog, seq))
            .concat(<a href={`https://${window.location.hostname}/survey/wjx?activity=12602894`} className="more-box" style={{display:'block',height:`${this.catalogHeight}px`,lineHeight:`${this.catalogHeight}px`}}>
              {/*<div className="swipe-box-mask" style={{opacity:'0.25'}}></div>*/}
              <span style={{fontSize:`${this.catalogName}px`}}>更多小课</span>
            </a>) : null}
        </div>

      </div>
    )
  }
}
