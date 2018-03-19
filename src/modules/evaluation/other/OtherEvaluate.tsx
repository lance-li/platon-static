import * as React from 'react'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg, set } from 'reduxutil/actions'
import { OtherInit } from './OtherInit'
import { OtherComplete } from './OtherComplete'
import { QuestionGroup } from '../components/QuestionGroup'
import { loadSurveySubmitUpname, loadSurveySubmitByRefer } from '../async';
import { mark } from '../../../utils/request'

@connect(state => state)
export default class OtherEvaluate extends React.Component {

  constructor() {
    super()
    this.state = {
      currentStep: this.other_evaluate_steps.init
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  other_evaluate_steps = {
    init: 'init',
    content: 'questionare',
    complete: 'complete',
  }

  async componentWillMount() {
    const { dispatch, location } = this.props;
    const { refer } = location.query;
    mark({
      module: '打点',
      function: '价值观测评',
      action: '打开其他人页',
      memo: refer
    })
    dispatch(startLoad());
    let res = await loadSurveySubmitUpname(refer);
    let referRes = await loadSurveySubmitByRefer(refer);
    dispatch(endLoad());
    if(res.code === 200) {
      this.setState({ upName: res.msg });
    }
    if(referRes.code === 200) {
      if(!!referRes.msg.self) {
        // 是自己的
        this.context.router.push('/rise/static/guest/value/evaluation/self');
      } else {
        this.setState({ submitted: !!referRes.msg.resultId, self: referRes.msg.self })
      }
    }
  }

  async handleClickStart() {
    const { dispatch } = this.props;
    const { submitted } = this.state;
    if(!!submitted) {
      dispatch(alertMsg("您已经填写过问卷"));
    } else {
      this.setState({ currentStep: this.other_evaluate_steps.content })
    }
  }

  renderComponentByStep() {
    const { currentStep, upName } = this.state
    const { location } = this.props;
    const { refer } = location.query;
    switch(currentStep) {
      case this.other_evaluate_steps.init :
        return <OtherInit handleStart={() => this.handleClickStart()}
                          upName={upName}
        />
        break
      case this.other_evaluate_steps.content:
        return <QuestionGroup category='evaluation-other' header='职业发展核心能力和心理品质量表'
                              upName={upName}
                              onSubmit={() => this.setState({ currentStep: this.other_evaluate_steps.complete })}
                              referId={refer}
                              firstTips={{ 10: '请仔细阅读以下题目，根据您对 TA 的了解，从中选出一个最能准确描述其实际情况的选项。' }}/>
        break
      case this.other_evaluate_steps.complete:
        return <OtherComplete upName={upName}/>
        break
      default:
        break
    }
  }

  render() {
    return this.renderComponentByStep()
  }

}
