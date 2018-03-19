import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg, set } from 'reduxutil/actions'
import './ScheduleChoice.less'
import { mark } from '../../utils/request'
import { initSchedule, loadQuestions } from './async'
import $ from 'jquery'
import { FooterButton } from '../../components/submitbutton/FooterButton'
import { Toast, Dialog } from "react-weui"
import _ from "lodash"

const { Alert } = Dialog

const sequenceMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G'
}

const NO_MINOR = 24;
const ONE_MINOR = 25;
const TWO_MINOR = 26;
const THREE_MINOR = 37;

@connect(state => state)
export default class ScheduleChoice extends Component {
  constructor() {
    super()
    this.state = {
      practice: [],
      currentIndex: 0,
      practiceCount: 0,
      selected: [],
      showResult: false,
      showNext: false,
      analysis: '',
      isRight: true,
      fadeOut: false,
      fadeIn: false,
      fadePrevOut: false,
      fadePrevIn: false,
      chooseAll: false,
      showConfirmModal: false,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    mark({ module: '打点', function: '课程计划', action: '打开选择题页面' })
    const { dispatch } = this.props
    dispatch(startLoad())
    loadQuestions().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ practice: res.msg, practiceCount: res.msg.length })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  prevChoice() {
    mark({
      module:'打点',
      function:'课程计划选择题界面',
      action:'点击上一题'
    })
    const { practice, currentIndex, practiceCount } = this.state
    let scheduleChoices = practice[ currentIndex ].scheduleChoices
    $(this.refs.questionGroup).animateCss('fadeOutRight', () => {
      this.setState({ practice: practice, currentIndex: currentIndex - 1 },
        () => {
          $(this.refs.questionGroup).animateCss('fadeInLeft')
        }
      )
    })
  }

  nextChoice() {
    mark({
      module:'打点',
      function:'课程计划选择题界面',
      action:'点击下一题'
    })
    const { dispatch } = this.props
    const { practice, currentIndex, practiceCount } = this.state
    let canSubmit = true
    let matchObj = _.find(practice[ currentIndex ].scheduleChoices, { choice: true })

    if(_.isEmpty(matchObj)) {
      canSubmit = false
    }
    if(!canSubmit) {
      dispatch(alertMsg('请选择答案'))
      return
    }

    if(currentIndex == 0 && matchObj) {
      if(matchObj.id === NO_MINOR) {
        this.setState({ showConfirmModal: true });
        return;
      }
    }

    $(this.refs.questionGroup).animateCss('fadeOutLeft', () => {
      this.setState({ currentIndex: currentIndex + 1 }, () => {
        $(this.refs.questionGroup).animateCss('fadeInRight')
      })
    })

  }

  handleClickChoice(choice) {
    mark({
      module:'打点',
      function:'课程计划选择题界面',
      action:'选择答案'
    })
    const { practice, currentIndex, practiceCount } = this.state
    const { multiple, scheduleChoices } = practice[ currentIndex ];
    _.forEach(scheduleChoices, (item) => {
      if(multiple) {
        if(item.id === choice.id) {
          item.choice = !item.choice;
        }
      } else {
        item.choice = item.id === choice.id
      }
    })
    if(currentIndex < (practiceCount - 1)) {
      this.setState({ practice: practice })
    } else {
      let chooseAll = _.find(scheduleChoices, { choice: true });
      this.setState({ practice: practice, selected: choice, chooseAll: !!chooseAll })
    }
  }

  handleClickSubmit() {
    mark({
      module:'打点',
      function:'课程计划选择题界面',
      action:'点击提交按钮'
    })
    const { dispatch } = this.props
    const { practice, currentIndex, practiceCount } = this.state

    let canSubmit = true
    _.forEach(practice, question => {
      let matchObj = _.find(question.scheduleChoices, { choice: true })
      if(_.isEmpty(matchObj)) {
        canSubmit = false
      }
    })
    if(!canSubmit) {
      // 查看是否选择了，没有辅修课这个选项
      _.forEach(practice, question => {
        let matchObj = _.find(question.scheduleChoices, { choice: true, id: NO_MINOR });
        if(!!matchObj) {
          canSubmit = !!matchObj;
        }
      })
      if(!canSubmit) {
        dispatch(alertMsg('请选择答案'))
        return
      }
    }

    let questionList = _.cloneDeep(practice)
    _.forEach(questionList, question => {
      question.scheduleChoices = _.remove(question.scheduleChoices, { choice: true })
      _.forEach(question.scheduleChoices, (item) => {
        // 不要再把答案传到后台了，这个字段比较长
        item.subject = undefined;
      })
      // 不要再把答案传到后台了，这个字段比较长
      question.question = undefined
    })

    dispatch(startLoad())
    initSchedule(questionList).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        window.ENV.showExplore = 'false'
        dispatch(set('firstEntry', true));
        this.context.router.push({
          pathname: '/rise/static/course/schedule/overview',
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  render() {

    const { practice, currentIndex, practiceCount, chooseAll, showConfirmModal } = this.state

    const isSelected = (scheduleChoices, choice) => {
      return !_.isEmpty(_.find(scheduleChoices, {
        id: choice.id, choice: true
      }))
    }

    const choiceRender = (choice, idx, scheduleChoices) => {
      const { id, subject } = choice
      return (
        <div key={id}
             className={`choice${isSelected(scheduleChoices, choice) ? ' selected' : ''} ${practice[ currentIndex ].multiple ? '' : 'radio'}`}
             onClick={e => this.handleClickChoice(choice)}>
          <span className={`index ${isSelected(scheduleChoices, choice) ? ' selected' : ''}`}>
            {sequenceMap[ idx ]}
            </span>
          <span
            className={`text`}>{subject}</span>
        </div>
      )
    }

    const renderSpecialTips = (choiceId) => {
      if(choiceId === NO_MINOR) {
        return <span className="special-tips">
          每月1门指定主修课；无辅修课，将跳过后续测试
        </span>;
      } else if(choiceId === ONE_MINOR) {
        return <span className="special-tips">
          每月1门指定主修课；<br/>根据你的后续题目答案，每月最多推荐1门辅修课
        </span>;
      } else if(choiceId === TWO_MINOR) {
        return <span className="special-tips">
          每月1门指定主修课；<br/>根据你的后续题目答案，每月最多推荐2门辅修课
        </span>;
      } else if(choiceId === THREE_MINOR) {
        return <span className="special-tips">
          每月1门指定主修课；<br/>根据你的后续题目答案，每月最多推荐3门辅修课
        </span>;
      }

    }
    const questionRender = (practice = {}) => {
      const { question, scheduleChoices = [] } = practice

      if(currentIndex === 0) {
        return (
          <div className="intro-container" ref="questionGroup">
            <div className='question-group'>
              <div className="question">
                <div
                  dangerouslySetInnerHTML={{ __html: question ? question : '' }}/>
              </div>
              <div className="choice-list">
                {scheduleChoices.map((choice, idx) => {
                  return (
                    <div className="choice-wrapper" key={choice.id}>
                      <div className={`choice ${isSelected(scheduleChoices, choice) ? ' selected' : ''}`}
                           onClick={e => this.handleClickChoice(choice)}>
                        <span className={`text`}>{choice.subject}</span>
                      </div>
                      {renderSpecialTips(choice.id)}
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ height: '48px' }}/>
          </div>
        )
      } else {
        return (
          <div className="choice-intro-container" ref="questionGroup">
            <div className="question">
              <div dangerouslySetInnerHTML={{ __html: (currentIndex + '.&nbsp;&nbsp;' + question) }}/>
            </div>
            <div className="choice-list">
              {scheduleChoices.map((choice, idx) => choiceRender(choice, idx, scheduleChoices))}
            </div>
            <div style={{ height: '48px' }}/>
          </div>
        )
      }
    }

    const renderButtons = () => {
      if(currentIndex === practiceCount - 1) {
        return <FooterButton btnArray={[
          { click: () => this.prevChoice(), text: '上一题' },
          { click: () => this.handleClickSubmit(), text: '提交' }
        ]}/>
        // return <SubmitButton clickFunc={() => this.handleClickSubmit()} buttonText="提交"/>
      } else if(currentIndex === 0) {
        return <FooterButton btnArray={[
          { click: () => this.nextChoice(), text: '继续' }
        ]}/>
        // return <SubmitButton clickFunc={() => this.nextChoice()} buttonText="继续"/>
      } else {
        return <FooterButton btnArray={[
          { click: () => this.prevChoice(), text: '上一题' },
          { click: () => this.nextChoice(), text: '下一题' }
        ]}/>
      }
    }
    return (
      <div className="schedule-choice" style={{ minHeight: window.innerHeight }}>
        <div className={`eva-container ${currentIndex !== 0 ? 'small-pd' : ''}`}>
          <div className="eva-page-header">制定学习计划</div>
          {currentIndex !== 0 ?
            <div>
              <div
                className="rate">{(((((currentIndex === practiceCount - 1 ) && chooseAll) ? practiceCount : currentIndex) / practiceCount) * 100).toFixed(0)}%
              </div>
              <div className="eva-progress">
                <div className="eva-progress-bar"
                     style={{ width: `${(((((currentIndex === practiceCount - 1 ) && chooseAll) ? practiceCount : currentIndex) / practiceCount) * 100).toFixed(0)}%` }}/>
              </div>
            </div> : null}
          {questionRender(practice[ currentIndex ])}
        </div>
        {renderButtons()}
        <Alert show={showConfirmModal} buttons={[
          {
            label: '关闭',
            onClick: () => this.setState({ showConfirmModal: false })
          }, {
            label: '确定',
            onClick: () => this.handleClickSubmit()
          }
        ]} title="将跳过后续题目">
          <div className="global-pre" style={{ paddingTop: 0 }}
               dangerouslySetInnerHTML={{ __html: '由于你的每日学习时长少于30分钟，只能学习指定主修课，将跳过后续辅修课推荐测试题。' }}/>
        </Alert>
      </div>
    )
  }
}
