import * as React from "react"
import "./Comment.less"
import { connect } from "react-redux"
import {loadCommentList, comment, deleteComment, commentReply, getApplicationPractice, vote} from "./async"
import { startLoad, endLoad, alertMsg } from "../../../redux/actions"
import AssetImg from "../../../components/AssetImg"
import { findIndex, remove, isString, truncate, merge } from "lodash"
import DiscussShow from "../components/DiscussShow"
import Discuss from "../components/Discuss"
import {scroll, filterHtmlTag} from "../../../utils/helpers"
import { mark } from "../../../utils/request"

@connect(state => state)
export class Comment extends React.Component<any, any> {
  constructor() {
    super()
    this.state = {
      page: 1,
      editDisable: false,
      commentList: [],
      article: {},
      placeholder: '和作者切磋讨论一下吧',
      filterContent:"",
      submitId:-1,
    }
    this.commentHeight = window.innerHeight
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    mark({module: "打点", function: "学习", action: "打开应用题评论页"})
    const {dispatch, location} = this.props
    let submitId = this.props.submitId
    if(!submitId){
      submitId = location.query.submitId
    }
    dispatch(startLoad())
    getApplicationPractice(submitId).then(res => {
      if(res.code === 200) {
        this.setState({article: res.msg, filterContent:filterHtmlTag(res.msg.content)})
        loadCommentList(submitId, 1).then(res => {
          dispatch(endLoad())
          if(res.code === 200) {
            this.setState({commentList: res.msg.list, page: 1, end: res.msg.end,
              isModifiedAfterFeedback: res.msg.isModifiedAfterFeedback, submitId})
            //从消息中心打开时，锚定到指定评论
            if(location && location.query.commentId){
              scroll('#comment-'+location.query.commentId, '.application-comment')
            }
          } else {
            dispatch(alertMsg(res.msg))
          }
        }).catch(ex => {
          dispatch(endLoad())
          dispatch(alertMsg(ex))
        })
      } else {
        dispatch(endLoad())
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }


  onSubmit() {
    const {dispatch, location} = this.props
    const {content, isReply, submitId} = this.state
    if(content) {
      this.setState({editDisable: true})
      if(isReply) {
        commentReply(submitId, content, this.state.id).then(res => {
          if(res.code === 200) {
            this.setState({
              commentList: [res.msg].concat(this.state.commentList),
              showDiscuss: false,
              editDisable: false
            })
            scroll('.comment-header', '.application-comment')
          } else {
            dispatch(alertMsg(res.msg))
            this.setState({editDisable: false})
          }
        }).catch(ex => {
          this.setState({editDisable: false})
          dispatch(alertMsg(ex))
        })
      } else {
        comment(submitId, content)
        .then(res => {
          if(res.code === 200) {
            this.setState({
              commentList: [res.msg].concat(this.state.commentList),
              showDiscuss: false,
              editDisable: false
            })
            scroll('.comment-header', '.application-comment')
          } else {
            dispatch(alertMsg(res.msg))
            this.setState({editDisable: false})
          }
        }).catch(ex => {
          this.setState({editDisable: false})
          dispatch(alertMsg(ex))
        })
      }

    } else {
      dispatch(alertMsg('请先输入内容再提交'))
    }
  }

  openWriteBox() {
    this.setState({showDiscuss: true, content: '', isReply: false, placeholder: '和作者切磋讨论一下吧'})
  }

  reply(item) {
    this.setState({
      id: item.id,
      placeholder: '回复 ' + item.name + ":",
      showDiscuss: true,
      isReply: true,
      content: '',
    })
  }

  onDelete(id) {
    const {dispatch, location, submitId} = this.props
    deleteComment(id).then(res => {
      if(res.code === 200) {
        loadCommentList(submitId, 1).then(res => {
          dispatch(endLoad())
          if(res.code === 200) {
            this.setState({commentList: res.msg.list, page: 1, end: res.msg.end,
              isModifiedAfterFeedback: res.msg.isModifiedAfterFeedback})
          } else {
            dispatch(alertMsg(res.msg))
          }
        }).catch(ex => {
          dispatch(endLoad())
          dispatch(alertMsg(ex))
        })
      }
    })
  }

  onChange(value) {
    this.setState({content: value})
  }

  cancel() {
    const {showDiscuss} = this.state
    if(showDiscuss) {
      this.setState({showDiscuss: false})
    }
  }

  show(showAll){
    this.setState({showAll:!showAll})
  }

  voted(id, voteStatus, voteCount) {
    if(!voteStatus) {
      this.setState({article: merge(this.state.article, {voteCount: voteCount + 1, voteStatus: true})})
      vote(id)
    } else {
    }
  }

  render() {
    const {commentList = [], showDiscuss, end, isReply, placeholder, showAll, filterContent, wordsCount=60, submitId, article} = this.state
    const {topic, content, voteCount =0, voteStatus } = article
    const renderCommentList = () => {
      if(commentList && commentList.length !== 0) {
        return (
          commentList.map((item, seq) => {
            return (
              <div id={'comment-'+item.id}>
                <DiscussShow discuss={item} showLength={100} reply={() => {
                  this.reply(item)
                }} onDelete={this.onDelete.bind(this, item.id)}/>
              </div>
            )
          })
        )
      } else {
        return (<div className="on_message">
          <div className="no_comment">
            <AssetImg url="https://static.iqycamp.com/images/no_comment.png" height={120} width={120}/>
          </div>
          还没有人评论过<br/>点击左下角按钮，发表第一条吧
        </div>)
      }
    }

    const renderTips = () => {
      if(commentList && commentList.length !== 0) {
        if(!end) {
          return (
            <div className="show-more">上拉加载更多消息</div>
          )
        } else {
          return (
            <div className="show-more">已经到最底部了</div>
          )
        }
      }
    }

    const renderWorkContent = ()=>{
      if(isString(content)){
        if(filterContent.length>wordsCount && !showAll){
          return (
              <div onClick={()=>this.show(showAll)} className="application-content">
                {truncate(filterContent,{length:wordsCount,omission:''})}
                <span style={{letterSpacing:'-3px'}}>...</span>
              </div>
          )
        } else {
          return (
              <pre className="application-content" dangerouslySetInnerHTML={{__html:content}}/>
          )
        }
      }
      return null
    }

    return (
      <div>
        <div className="application-comment">
          <div className="article">
            <div className="article-header">{topic}</div>
            {renderWorkContent()}
            {filterContent && filterContent.length>wordsCount?
                <div onClick={()=>this.show(showAll)} className="show-all">{showAll?'收起':'展开'}</div>:null}
            {content?
                <div onClick={()=>{this.voted(submitId, voteStatus, voteCount)}} className="vote">
                  <span className={`${voteStatus?'voted':'disVote'}`}>{voteCount}</span>
                </div>:null}
            <div className="comment-header">
              当前评论
            </div>
            {
              this.state.isModifiedAfterFeedback
                ? (<div className="comment-header-feedback">
                    <span className="comment-feedback-tips">小提示：</span>
                    该条教练点评后，作业被更新，可能有和教练点评不一致的内容
                  </div>)
                : null
            }
          </div>
          <div className="pull-target">
            <div className="comment-body">
              {renderCommentList()}
              {renderTips()}
            </div>
          </div>
          {showDiscuss ? <div className="padding-comment-dialog"/> : null}
        </div>
        {showDiscuss ?
          <Discuss isReply={isReply} placeholder={placeholder} limit={10000}
                   submit={() => this.onSubmit()} onChange={(v) => this.onChange(v)}
                   cancel={() => this.cancel()}
          /> :
          <div className="writeDiscuss" onClick={() => this.openWriteBox()}>
            <AssetImg url="https://static.iqycamp.com/images/discuss.png" width={45} height={45}/>
          </div>
        }
      </div>
    )
  }
}
