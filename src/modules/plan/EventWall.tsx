import * as React from "react"
import "./EventWall.less"
import {connect} from "react-redux"
import {pget, ppost} from "utils/request"
import {set, startLoad, endLoad, alertMsg} from "redux/actions"
import {queryEventList,mark} from "./async";
import {ToolBar} from "../base/ToolBar"
import { changeTitle } from '../../utils/helpers'
import Banner from '../../components/Banner';

@connect(state=>state)
export class EventWall extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {
      tab:1
    };
    changeTitle('活动');

    this.bannerWidth = window.innerWidth;
    this.bannerHeight = 175/375 * this.bannerWidth;
    this.barItemPd = ((70/750) * (window.innerWidth-30))/2;
    this.barItemWidth = ((window.innerWidth-30)-this.barItemPd*6)/4;

    if(this.barItemWidth<64){
      this.barItemWidth = 64;
      this.barItemPd = ((window.innerWidth-30)-(this.barItemWidth*4))/6;
    }
  }

  componentWillMount(){
    const {dispatch} = this.props;
    dispatch(startLoad());
    queryEventList()
      .then(res=>{
        dispatch(endLoad());
        if(res.code === 200){
          console.log(res.msg);
          let liveList=[],workList=[],offlineList=[],areaList=[],bannerList=[];
          for(let i=0; i<res.msg.length;i++){
            switch(res.msg[i].type){
              case 1:liveList.push(res.msg[i]);break;
              case 2:workList.push(res.msg[i]);break;
              case 3:offlineList.push(res.msg[i]);break;
              case 4:areaList.push(res.msg[i]);break;
              default:liveList.push(res.msg[i]);break;
            }
            if(res.msg[i].banner){
              // 放到banner 注意，如果要做刷新，这里会有坑
              bannerList.push(res.msg[i]);
            }
          }
          this.setState({liveList:liveList,workList:workList,offlineList:offlineList,areaList:areaList,bannerList:bannerList});
        } else {
          dispatch(alertMsg(res.msg));
        }
      }).catch(ex=>{
      dispatch(endLoad());
      dispatch(alertMsg(ex))
    })
  }

  goEvent(item){
    mark({module:"打点",function:"活动墙",action:"打开活动墙",memo:item.id});
    window.location.href=item.destUrl;
  }

  goBanner(id){
    console.log('click',id);
  }

  renderTabBody(){
    const {liveList,workList,offlineList,areaList,tab} = this.state;
    let tempList = null;
    switch(tab){
      case 1:tempList = liveList;break;
      case 2:tempList = workList;break;
      case 3:tempList = offlineList;break;
      case 4:tempList = areaList;break;
      default:tempList = liveList;break;
    }
    return (
      <div>
        <ul className="event-list">
          {tempList ? tempList.map((item, idx) => {
            return <li onClick={()=>this.goEvent(item)} key={idx} className="event-item">
              <div className="head-pic">
                <img
                     src={item.pic}/>
              </div>
              <div className="event-info">
                <div className="title">
                  {item.title}
                </div>
                {item.password?<div className="password">直播间密码：{item.password}</div>:null}
                <div className="describe" style={{marginTop:`${item.password?9:30}px`}}>
                  {item.publisher}
                </div>
                <div className="time">
                  {item.showTime ? `${item.startStr} ~ ${item.endStr}` : null}
                </div>
              </div>
            </li>
          }) : null}
        </ul>
        <div className="show-more">没有更多了</div>
        {/*<div className="padding"></div>*/}
      </div>
    )
  }

  renderBanner(){
    const {bannerList} = this.state;
    if(bannerList){
      return (
        <Banner height={this.bannerHeight}>
          {bannerList.map((item,key)=>{
            return <div className="banner-item swiper-slide" onClick={()=>this.goEvent(item)} key={key}>
              <img src={item.pic} style={{width:'auto',height:'100%',minWidth:'100%'}}/>
            </div>
          })}
        </Banner>
      )
    } else {
      return null;
    }

  }


  render(){
    return (<div className="layout">
      {this.renderBanner()}
      <div className="event-wall-tab" style={{height:`${window.innerHeight-this.bannerHeight}px`}}>
        <div className="navbar">
          <div style={{margin:`0 ${this.barItemPd}px 0 0`,width:`${this.barItemWidth}px`}} className={`navbar-item ${this.state.tab == 1?'active':''}`} onClick={e=>this.setState({tab:1})}>
            <span>大咖直播</span>
          </div>
          <div style={{margin:`0 ${this.barItemPd}px`,width:`${this.barItemWidth}px`}}  className={`navbar-item ${this.state.tab == 2?'active':''}`} onClick={e=>this.setState({tab:2})}>
            <span>作业分析</span>
          </div>
          <div style={{margin:`0 ${this.barItemPd}px`,width:`${this.barItemWidth}px`}}  className={`navbar-item ${this.state.tab == 3?'active':''}`} onClick={e=>this.setState({tab:3})}>
            <span>线下活动</span>
          </div>
          <div style={{margin:`0 0 0 ${this.barItemPd}px`,width:`${this.barItemWidth}px`}} className={`navbar-item ${this.state.tab == 4?'active':''}`} onClick={e=>this.setState({tab:4})}>
            <span>地域PK</span>
          </div>
        </div>
        {this.renderTabBody()}
      </div>
      <ToolBar hidden="true" />
    </div>)
  }
}
