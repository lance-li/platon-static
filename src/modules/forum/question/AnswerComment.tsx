import * as React from "react";
import { connect } from "react-redux"
import "./AnswerComment.less"
import { HeadArea, DialogHead, DialogBottomIcon, PullSlideTip } from "../commons/ForumComponent"
import { approveAnswer, commentAnswer, commentAnswerDel, disApproveAnswer, getAnswer } from "../async";
import Discuss from "../../practice/components/Discuss";
import { splitText, removeHtmlTags } from "../../../utils/helpers";
import { startLoad, endLoad, alertMsg } from "../../../redux/actions";

interface AnswerCommentState {
  answerInfo: object;
  // 评论列表
  commentlist: object;
  // 添加、回复评论
  answerId: number;
  comment: string;
  repliedCommentId: number;
  // 删除评论
  commentId: number;
  // 输入框提示
  placeholder: string;
  // 是否展示输入框
  showDiscussBox: boolean
}
const initDiscussBoxState = {
  comment: '',
  repliedCommentId: null,
  commentId: null,
  placeholder: '',
  showDiscussBox: false
}
@connect(state => state)
export default class AnswerComment extends React.Component<any, AnswerCommentState> {

  constructor() {
    super()
    this.state = {
      answerInfo: {},
      commentlist: null,
      answerId: null,
      comment: '',
      repliedCommentId: null,
      commentId: null,
      placeholder: '',
      showDiscussBox: false,
      end: true,
    }
  }

  componentWillMount() {
    const answerId = this.props.location.query.answerId
    const { dispatch } = this.props
    this.setState({ answerId: answerId })
    dispatch(startLoad())
    getAnswer(answerId).then(res => {
      dispatch(endLoad())
      const { code, msg } = res
      if(code === 200) {
        this.setState({ answerInfo: res.msg, commentlist: res.msg.comments })
      } else {
        dispatch(alertMsg(msg))
      }
    }).catch(e => {
      dispatch(endLoad())
      dispatch(alertMsg(e))
    })
  }

  commentAnswer() {
    const { commentlist, answerId, comment, repliedCommentId } = this.state
    const { dispatch } = this.props
    dispatch(startLoad())
    commentAnswer(answerId, comment, repliedCommentId).then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if(code === 200) {
        commentlist.push(msg)
        this.setState({ commentlist }, () => {
          this.handleClickHideDiscussBox()
        })
      } else {
        dispatch(alertMsg(msg))
      }
    }).catch(e => {
      dispatch(endLoad())
      dispatch(alertMsg(e))
    })
  }

  commentAnswerDel(commentId, idx) {
    const {dispatch} = this.props
    dispatch(startLoad())
    commentAnswerDel(commentId).then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if(code === 200) {
        let removeNode = `commentRef${idx}`
        this.refs[removeNode].style.display = "None"
      } else {
        dispatch(alertMsg(msg))
      }
    }).catch(e => {
      dispatch(endLoad())
      dispatch(alertMsg(e))
    })
  }

  // 直接回复答案本身
  handleClickCommentAnswer(answerId) {
    this.setState(initDiscussBoxState, () => {
      this.setState({
        placeholder: '回复 answer',
        showDiscussBox: true
      })
    })
  }

  // 回复答案的某一条评论
  handleClickCommentReply(answerId, repliedCommentId) {
    this.setState(initDiscussBoxState, () => {
      this.setState({
        repliedCommentId: repliedCommentId,
        placeholder: '回复 comment',
        showDiscussBox: true
      })
    })
  }

  // 隐藏输入框，并初始化 state 中的值
  handleClickHideDiscussBox() {
    this.setState(initDiscussBoxState)
  }

  // 编辑器内部内容映射到当前组件
  handleOnchangeDicussBoxValue(value) {
    this.setState({
      comment: value
    })
  }

  render() {
    const {
      answerInfo, commentlist, answerId, comment, repliedCommentId,
      commentId, placeholder, showDiscussBox
    } = this.state
    const {
      answer, approval, approvalCount, authorHeadPic, authorUserName, commentCount, comments,
      id, mine, publishTimeStr, questionId, topic
    } = answerInfo
    const renderAnswer = () => {
      if(!answer) return
      let tag = approval
      let comment = 'https://static.iqycamp.com/images/fragment/comment.png?imageslim'
      let unvote = 'https://static.iqycamp.com/images/fragment/unvote.png?imageslim'
      let voted = 'https://static.iqycamp.com/images/fragment/voted.png?imageslim'
      let btn2ImgUrl = approval ? voted : unvote
      const changeBtn2ImgUrl = () => {
        if(tag) {
          // 已赞同，则取消赞同
          disApproveAnswer(id)
        } else {
          // 还未赞同，点击赞同
          approveAnswer(id)
        }
        tag = !tag
        return tag ? voted : unvote
      }
      let isExpand = false
      const expandComment = () => {
        let node = this.refs.ansContent
        if(isExpand) {
          node.dangerouslySetInnerHTML = splitText(answer, 68)
        } else {
          node.dangerouslySetInnerHTML = answer
        }
        isExpand = !isExpand
        return isExpand ? "收起" : "展开"
      }
      return (
        <div className="ans-desc">
          <DialogHead leftImgUrl={authorHeadPic} user={authorUserName} time={publishTimeStr}/>
          <div className="ans-content" ref='ansContent' dangerouslySetInnerHTML={{ __html: splitText(answer, 68) }}/>
          <DialogBottomIcon
            leftContent={removeHtmlTags(answer).length > 68 ? '展开' : false} leftContentFunc={expandComment}
            btn1ImgUrl={comment} btn1Content={commentCount}
            btn1ContentFunc={this.handleClickCommentAnswer.bind(this, this.state.answerId)}
            btn2ImgUrl={btn2ImgUrl} btn2Content={approvalCount} btn2ContentFunc={changeBtn2ImgUrl}
          />
        </div>
      )
    }

    const renderAnswerComments = () => {
      if(!commentlist) return

      return (
        <div className="ans-comment-list" ref="commentlist">
          {
            commentlist.map((commentItem, idx) => {
              const {
                answerId, authorHeadPic, authorUserName, comment, id, mine,
                publishTimeStr, repliedComment, repliedName
              } = commentItem

              const renderRepliedComment = () => {
                if(repliedName && repliedComment) {
                  return (
                    <div className="ans-comment-replied">
                      回复{repliedName}：{repliedComment}
                    </div>
                  )
                }
              }
              return (
                <div className="ans-comment-desc" ref={`commentRef${idx}`}>
                  <DialogHead leftImgUrl={authorHeadPic} user={authorUserName} time={publishTimeStr}
                              rightContent={mine ? `删除` : `回复`}
                              rightContentFunc={
                                mine ?
                                  this.commentAnswerDel.bind(this, commentItem.id, idx) :
                                  this.handleClickCommentReply.bind(this, this.state.answerId, commentItem.id)
                              }/>
                  <div className="ans-comment-content">{comment}</div>
                  {renderRepliedComment()}
                </div>
              )
            })
          }
          <PullSlideTip isEnd={this.state.end}/>
        </div>
      )
    }

    const renderDiscussBox = () => {
      if(showDiscussBox) {
        return (
          <Discuss
            placeholder={placeholder} onChange={(v) => this.handleOnchangeDicussBoxValue(v)}
            submit={this.commentAnswer.bind(this)}
            cancel={this.handleClickHideDiscussBox.bind(this)}/>
        )
      }
    }

    return (
      <div className="ans-comment-container">
        <div className="ans-comment-page">
          {renderAnswer()}
          {renderAnswerComments()}
        </div>
        {renderDiscussBox()}
      </div>
    )
  }

}
