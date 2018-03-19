import * as React from "react";
import { connect } from "react-redux";
import "./ForumQuestion.less";
import { set, startLoad, endLoad, alertMsg } from "reduxutil/actions"
import { loadMineQuestions, loadMineAnswers } from "./async";
import SimpleQuestion from "../forum/commons/SimpleQuestion/SimpleQuestion"
import { splitText, removeHtmlTags } from "../../utils/helpers"
import { mark } from "../../utils/request"

/**
 * 已废弃
 */
@connect(state => state)
export default class ForumQuestion extends React.Component<any,any> {
  constructor() {
    super();
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    mark({ module: "打点", function: "个人中心", action: "我的论坛" });
    const { dispatch } = this.props;
    dispatch(startLoad());
    loadMineQuestions().then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.setState({ questions: res.msg });
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })

    loadMineAnswers().then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.setState({ answers: res.msg });
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }

  handleClickQuestion(question) {
    this.context.router.push({
      pathname: "/forum/static/answer",
      query: { questionId: question.id }
    })
  }

  handleClickAnswer(answer) {
    this.context.router.push({
      pathname: "/forum/static/answer",
      query: { questionId: answer.questionId }
    })
  }

  render() {
    const { questions, answers } = this.state;
    const renderQuestions = (list = []) => {
      if(list) {
        return list.map((item, key) => {
          return <SimpleQuestion onclickFunc={()=>this.handleClickQuestion(item)} key={key} title={item.topic}
                                 follow={item.followCount} answer={item.answerCount}/>;
        })
      }
    }

    const renderAnswers = (list = []) => {
      return list.map((item, key) => {
        return (
          <div key={key} onClick={()=>this.handleClickAnswer(item)} className="pfq-answer hover-cursor">
            <div className="topic">{splitText(removeHtmlTags(item.topic), 20)}</div>
            <div className="answer">{splitText(removeHtmlTags(item.answer), 100)}</div>
          </div>
        )
      })
    }

    return (
      <div className="personal-forum-question">
        <div className="pfq-question">
          <div className="pfq-header">
            我的提问
          </div>
          <div className="pfq-body">
            {renderQuestions(questions)}
          </div>
        </div>
        <div className="pfq-gutter"></div>
        <div className="pfq-answer">
          <div className="pfq-header">
            我的回答
          </div>
          <div className="pfq-body">
            {renderAnswers(answers)}
          </div>
        </div>
        <div className="padding-footer"></div>
      </div>
    )
  }
}
