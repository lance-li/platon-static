import * as React from "react";
import "./NewWork.less"
import {isString,truncate,isFunction} from "lodash";
import AssetImg from "../../../components/AssetImg";
import { preview } from "../../helpers/JsConfig"


export default class Work extends React.Component<any,any> {


  constructor(props) {
    super(props);

    this.state = {
      showAll: false,
      filterContent:isString(props.content)?props.content.replace(/<\/?.+?>/g,"").replace(/&nbsp;/g,""):""
    }
  }

  disOpen(filterContent,showAll){
    const { wordsCount=60 } = this.props;
    return filterContent.length>wordsCount && !showAll;
  }

  componentDidUpdate(preProps,preState){
    const {showAll,filterContent} = this.state;
    // 当前打开，但是之前未打开
    if(!this.disOpen(filterContent,showAll) && this.disOpen(preState.filterContent,preState.showAll)){
      console.log('didUpadte',this.refs.submitContent);
    }
  }
  componentDidMount(){
    console.log('mount',);
    const images = this.refs.submitContent.querySelectorAll('img')
    this.imgPreview(images);
  }

  imgPreview(imgs=[]){
    imgs.forEach(item=>{
      item.addEventListener('click',(e)=>{console.log(e);console.log('ok')})
      console.log(item);
    })
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.content && !this.props.content){
      this.setState({
        filterContent:isString(nextProps.content)?nextProps.content.replace(/<\/?.+?>/g,"").replace(/&nbsp;/g,""):""
      })
    }
  }

  contentClick(e){
    if(e.target.tagName === 'IMG'){
      let item = [e.target.src]
      let picList = Array.from(this.refs.submitContent.querySelectorAll('img')).map(item=>item.src);
      preview(item, picList)
    }
  }

  render() {
    const {headImage, userName, content,
      submitUpdateTime,onEdit,voteCount,commentCount,
      voteStatus,onVoted,goComment,wordsCount=60,
      title,avatarStyle = 'left',
      operation=true,picList=[]} = this.props;
    const {showAll,filterContent} = this.state;
    const renderWorkContent = ()=>{
      if(isString(content)){
        if(filterContent.length>wordsCount && !showAll){
          return (
            <pre className={`${avatarStyle}`}>{truncate(filterContent,{length:wordsCount,omission:''})}<span style={{letterSpacing:'-3px'}}>......</span></pre>
          )
        } else {
          return (
            <div className={`${avatarStyle}`} dangerouslySetInnerHTML={{__html:content}}/>
          )
        }
      }
      return null;
    }

    const showOperation = ()=>{
      if(operation){
        if(filterContent && filterContent.length<wordsCount){
          return true;
        } else
          return showAll;
      } else {
        return false;
      }
    }

    const renderHeader = ()=>{
      return (
        <div className={`submit-head ${avatarStyle}`}>
          <img className={`submit-avatar ${avatarStyle}`} src={headImage}/>
          <div className="submit-name">
            {userName}
          </div>
          <div className="submit-time">{submitUpdateTime}</div>
          {onEdit?<div className="right" style={{marginTop:`${avatarStyle==='left'?'0':'5px'}`}} onClick={()=>onEdit()}>
            <div className="submit-icon">
              <AssetImg type="edit" height={12}/>
            </div>
            <div className="submit-button">
              编辑
            </div>
          </div>:null}
        </div>
      )
    }



    return (
      <div className={`new-work`} >
        <div className="submit-cell">
          <div className="submit-area">
            {renderHeader()}
            {title?<div className="submit-title">{title}</div>:null}
            <div className="submit-content" ref="submitContent" onClick={(e)=>this.contentClick(e)}>{renderWorkContent()}</div>
            {filterContent && filterContent.length>wordsCount?<div onClick={()=>this.setState({showAll:!this.state.showAll})} className="show-all" style={{marginTop:`${showAll?'5px':'-20px'}`}}>{showAll?'收起':'展开'}</div>:null}
            {/*<div className="pic-list">{picList &&  !(filterContent && filterContent.length>wordsCount && !showAll) ?picList.map((item,seq)=>{
              return (
                <img className="pic" src={`${item}`}  onClick={() => preview(item, picList)} />
              )
            }):null}</div>*/}
            {showOperation()?<div className={`operation-area ${avatarStyle}`}>
              <div onClick={()=>{isFunction(onVoted)?onVoted():null;}} className="vote">
                <span className={`${voteStatus?'voted':'disVote'}`}>{voteCount}</span>
              </div>
              <div onClick={()=>{isFunction(goComment)?goComment():null}} className="comment">
                <span>{commentCount}</span>
              </div>
            </div>:null}
          </div>
        </div>
      </div>
    )
  }
}
