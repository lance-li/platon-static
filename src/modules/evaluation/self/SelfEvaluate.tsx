import * as React from 'react'
import { connect } from 'react-redux';
import { startLoad, endLoad, alertMsg, set } from 'reduxutil/actions'
import { SelfInit } from './SelfInit'
import { SelfComplete } from './SelfComplete'
import { QuestionGroup } from '../components/QuestionGroup'
import { loadSurveySubmit } from '../async';
import * as _ from 'lodash';
import { configShare } from '../../helpers/JsConfig'
import { mark } from '../../../utils/request'

@connect(state => state)
export default class SelfEvaluate extends React.Component {

  constructor() {
    super()
    this.state = {
      currentStep: this.self_evaluate_steps.init,
      showSubscribeQr: false
    }
  }

  self_evaluate_steps = {
    init: 'init',
    content: 'questionare',
    complete: 'complete'
  }

  async componentWillMount() {
    mark({
      module: '打点',
      function: '价值观测评',
      action: '进入测评页'
    })
    const { dispatch } = this.props;
    dispatch(startLoad());
    let res = await loadSurveySubmit('evaluation-self');
    dispatch(endLoad());
    if(res.code === 200) {
      if(!!res.msg.resultId) {
        // 提交过
        this.setState({
          subscribe: res.msg.subscribe, subscribeQrCode: res.msg.subscribeQrCode, selfSubmitId: res.msg.resultId,
          currentStep: this.self_evaluate_steps.complete
        }, () => {
          configShare(
            `我已完成KCDS自评，邀请你完成他评部分`,
            `https://${window.location.hostname}/rise/static/guest/value/evaluation/other?refer=${res.msg.resultId}`,
            'https://static.iqycamp.com/images/fragment/value_share.png?imageslim',
            'KCDS: 职业发展核心能力和心理品质量表, 由华师大学教育教练研究组与圈外共同开发'
          )
        });
      } else {
        this.setState({
          subscribe: res.msg.subscribe, subscribeQrCode: res.msg.subscribeQrCode, selfSubmitId: res.msg.resultId
        });
      }
    }
  }

  handleClickStart() {
    const { dispatch } = this.props;
    const { selfSubmitId, subscribe } = this.state;
    if(!selfSubmitId) {
      if(!!subscribe) {
        mark({
          module: '打点',
          function: '价值观测评',
          action: '点击开始',
          memo: '已关注'
        });
        this.setState({ currentStep: this.self_evaluate_steps.content })
      } else {
        mark({
          module: '打点',
          function: '价值观测评',
          action: '点击开始',
          memo: '未关注'
        });
        this.setState({ showSubscribeQr: true })
      }
    } else {
      dispatch(alertMsg('您已经提交过测评问卷'));
      this.setState({ currentStep: this.self_evaluate_steps.complete }, () => {
        configShare(
          `我已完成KCDS自评，邀请你完成他评部分`,
          `https://${window.location.hostname}/rise/static/guest/value/evaluation/other?refer=${selfSubmitId}`,
          'https://static.iqycamp.com/images/fragment/value_share.png?imageslim',
          'KCDS: 职业发展核心能力和心理品质量表, 由华师大学教育教练研究组与圈外共同开发'
        )
      })
    }
  }

  handleComplete() {
    const { dispatch } = this.props;
    const { selfSubmitId } = this.state;
    mark({
      module: '打点',
      function: '价值观测评',
      action: '点击分享'
    });
    configShare(
      `我已完成KCDS自评，邀请你完成他评部分`,
      `https://${window.location.hostname}/rise/static/guest/value/evaluation/other?refer=${selfSubmitId}`,
      'https://static.iqycamp.com/images/fragment/value_share.png?imageslim',
      'KCDS: 职业发展核心能力和心理品质量表, 由华师大学教育教练研究组与圈外共同开发'
    )
  }

  handleSubmit(submitId) {
    this.setState({ currentStep: this.self_evaluate_steps.complete, selfSubmitId: submitId }, () => {
      configShare(
        `我已完成KCDS自评，邀请你完成他评部分`,
        `https://${window.location.hostname}/rise/static/guest/value/evaluation/other?refer=${submitId}`,
        'https://static.iqycamp.com/images/fragment/value_share.png?imageslim',
        'KCDS: 职业发展核心能力和心理品质量表, 由华师大学教育教练研究组与圈外共同开发'
      )
    });
  }

  renderComponentByStep() {
    const { currentStep, showSubscribeQr, subscribeQrCode } = this.state
    switch(currentStep) {
      case this.self_evaluate_steps.init :
        return <SelfInit handleStart={() => this.handleClickStart()} qrCode={subscribeQrCode}
                         showQrCode={showSubscribeQr}
                         closeCode={() => this.setState({ showSubscribeQr: false })}/>
        break
      case this.self_evaluate_steps.content:
        return <QuestionGroup category='evaluation-self' header='职业发展核心能力和心理品质量表'
                              onSubmit={(submitId) => this.handleSubmit(submitId)}
                              firstTips={{ 10: '请仔细阅读以下题目，根据您的实际情况，选出一个最能准确描述您的选项。' }}/>
        break
      case this.self_evaluate_steps.complete:
        return <SelfComplete handleComplete={() => this.handleComplete()}/>
        break
      default:
        break
    }
  }

  render() {
    return this.renderComponentByStep()
  }

}
