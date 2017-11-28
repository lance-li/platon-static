import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BusinessApplyChoice.less';
import { set, startLoad, endLoad, alertMsg } from "redux/actions"
import * as _ from 'lodash';
import { pget, ppost, mark } from "utils/request"
import { loadBusinessApplyQuestion, submitApply } from './async';
import DropDownList from "../customer/components/DropDownList";
import { SubmitButton } from '../../components/submitbutton/SubmitButton'
import AssetImg from '../../components/AssetImg'
import $ from 'jquery';

@connect(state => state)
export default class BusinessApplyChoice extends Component<any, any> {
  constructor() {
    super();
    this.state = {
      questionGroup: [],
      seriesCount: 0,
      currentIndex: 0,
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    const { dispatch, region, location } = this.props;

    mark({ module: "打点", function: "商学院审核", action: "进入填写报名信息页面" });

    dispatch(startLoad());
    loadBusinessApplyQuestion().then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.setState({ questionGroup: res.msg, seriesCount: res.msg.length });
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    });

    if(!region) {
      pget('/rise/customer/region').then(res => {
        if(res.code === 200) {
          dispatch(set("region", res.msg));
        } else {
          dispatch(alertMsg(res.msg));
        }
      }).catch(err => dispatch(alertMsg(err.msg)));
    }
  }

  /**
   * 处理当前题目group的变动
   * @param group 新的group对象
   * @param index 当前index
   */
  handleGroupChanged(group, index) {
    const { questionGroup, currentIndex, seriesCount, } = this.state
    let newGroups = _.cloneDeep(questionGroup);
    newGroups[ index ] = group;
    this.setState({ questionGroup: newGroups });
  }

  /**
   * 检查题目是否完成
   * @param question 题目
   * @param userChoices 用户选项
   */
  checkQuestionComplete(question, userChoices) {
    const { type, chosenId, preChoiceId, userValue, oneId, twoId, request } = question;
    if(!!preChoiceId) {
      if(_.indexOf(userChoices, preChoiceId) === -1) {
        // 不满足前置条件，则不检查
        return true;
      }
    }
    if(!request) {
      // 不是必填
      return true;
    }

    switch(type) {
      case QuestionType.PICKER:
      case QuestionType.RADIO:
        return !!chosenId;
      case QuestionType.BLANK:
      case QuestionType.MULTI_BLANK:
      case QuestionType.PHONE:
        return !!userValue;
      case QuestionType.AREA:
        return !!oneId && !!twoId;
      default:
        return false;
    }
  }

  /**
   * 点击提交按钮
   */
  handleClickSubmit() {
    const { dispatch, region } = this.props;
    const { questionGroup, currentIndex, seriesCount, } = this.state
    const userChoices = this.calculateUserChoices(questionGroup);

    for(let i = 0; i < questionGroup.length; i++) {
      let group = questionGroup[ i ];
      let questions = group.questions;
      for(let y = 0; y < questions.length; y++) {
        let checkResult = this.checkQuestionComplete(questions[ y ], userChoices);
        if(!checkResult) {
          console.log(questions[ y ]);
          dispatch(alertMsg("完成所有必填项后才能提交哦"));
          return;
        }
      }
    }
    // 检测通过，开始提交
    // 先拼装用户的提交记录

    let result = _.reduce(questionGroup, (submitList, nextGroup) => {
      let subParam = _.reduce(nextGroup.questions, (tempList, question) => {
        let subTempParam = {};
        switch(question.type) {
          case QuestionType.PICKER:
          case QuestionType.RADIO:
            _.merge(subTempParam, { questionId: question.id, choiceId: question.chosenId });
            break;
          case QuestionType.BLANK:
          case QuestionType.MULTI_BLANK:
          case QuestionType.PHONE:
            _.merge(subTempParam, { questionId: question.id, userValue: question.userValue });
            break;
          case QuestionType.AREA:
            const provinceName = _.find(_.get(region, "provinceList"), { id: question.oneId }).value;
            const cityName = _.find(_.get(region, "cityList"), { id: question.twoId }).value;
            _.merge(subTempParam, { questionId: question.id, userValue: provinceName + '-' + cityName });
            break;
          default:
          // ignore
        }
        tempList.push(subTempParam);
        return tempList;
      }, []);
      submitList = submitList.concat(subParam);
      return submitList;
    }, []);

    // 开始提交
    console.log('result', result);
    dispatch(startLoad());
    submitApply({ userSubmits: result }).then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        this.context.router.push('/rise/static/business/apply/submit/success');
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }

  /**
   * 计算用户的选项
   * @param questionGroup 题目组
   * @returns 用户选项id的数组
   */
  calculateUserChoices(questionGroup) {
    return _.reduce(questionGroup, (resultArray, tempGroup) => {
      let tempArray = _.reduce(tempGroup.questions, (subArray, tempQuestion) => {
        if(tempQuestion.type === QuestionType.PICKER || tempQuestion.type === QuestionType.RADIO) {
          if(!!tempQuestion.chosenId) {
            subArray.push(tempQuestion.chosenId);
          }
        }
        return subArray;
      }, []);
      resultArray = resultArray.concat(tempArray);
      return resultArray;
    }, []);
  }

  /**
   * 点击下一步
   */
  handleClickNextStep() {
    const { dispatch } = this.props;
    const { questionGroup, currentIndex, seriesCount, } = this.state
    let group = questionGroup[ currentIndex ];
    let questions = group.questions;
    const userChoices = this.calculateUserChoices(questionGroup);
    for(let i = 0; i < questions.length; i++) {
      let checkResult = this.checkQuestionComplete(questions[ i ], userChoices);
      if(!checkResult) {
        dispatch(alertMsg("完成必填项后再点下一步哦"));
        return;
      }
    }
    this.setState({ group: group }, () => {
      $('.question-group').animateCss('fadeOutLeft', () => {
        this.setState({ currentIndex: currentIndex + 1 }, () => {
          $('.question-group').animateCss('fadeInRight')
        })
      })
    })
  }

  /**
   * 点击上一步
   */
  prevStep() {
    const { questionGroup, currentIndex, seriesCount, } = this.state

    $('.question-group').animateCss('fadeOutRight', () => {
      this.setState({ currentIndex: currentIndex - 1 },
        () => {
          $('.question-group').animateCss('fadeInLeft');
        }
      )
    })
  }

  render() {
    const { questionGroup, currentIndex, seriesCount, } = this.state
    const isSelected = (choices, choice) => {
      return !_.isEmpty(_.find(choices, {
        id: choice.id, choice: true
      }));
    }

    return (
      <div className="apply-choice" style={{ minHeight: window.innerHeight }}>
        <div className="apply-container">
          <div className="apply-page-header">圈外商学院入学申请</div>
          <div className="apply_rate">{(currentIndex / (seriesCount - 1)).toFixed(2) * 100}%</div>
          <div className="apply-progress">
            <div className="apply-progress-bar"
                 style={{ width: (window.innerWidth - 90) * (currentIndex / (seriesCount - 1)) }}/>
          </div>
          <div className="intro-index">
            {seriesCount !== 0 && currentIndex <= seriesCount - 1 && currentIndex != 0 ?
              <span className="prev" onClick={() => this.prevStep()}>上一步</span> : null}
          </div>
          <QuestionGroup group={questionGroup[ currentIndex ]} allGroup={questionGroup} region={this.props.region}
                         onGroupChanged={(group) => this.handleGroupChanged(group, currentIndex)}/>
        </div>

        {currentIndex === seriesCount - 1 ? <SubmitButton clickFunc={() => this.handleClickSubmit()} buttonText="提交"/> :
          <SubmitButton clickFunc={() => {this.handleClickNextStep()}} buttonText="下一步"/>}
      </div>
    )
  }
}

interface QuestionGroupProps {
  group: any,
  onGroupChanged?: any,
  allGroup: any,
  region?: any,
}

enum QuestionType {
  PICKER = 1,
  RADIO,
  BLANK,
  MULTI_BLANK,
  AREA,
  PHONE,
}

class QuestionGroup extends Component<QuestionGroupProps, any> {
  constructor() {
    super();
    this.state = {}
  }

  componentWillMount() {
  }

  // componentWillReceiveProps(nextProps) {
  //   if(_.isEmpty(this.props.group) && !_.isEmpty(nextProps.group)) {
  //     // console.log('recive', nextProps.group);
  //   }
  //   // console.log('props', nextProps.group);
  // }

  commonHandleValueChange(question, value, keyName) {
    const { group = {} } = this.props;
    const { questions = [] } = group;
    let key = _.findIndex(questions, { id: question.id });
    let result = _.set(_.cloneDeep(group), `questions[${key}]`, _.set(_.cloneDeep(question), keyName, value));
    this.props.onGroupChanged(result);
  }

  handleChoiceRegion(question, one, two) {
    const { group = {} } = this.props;
    const { questions = [] } = group;
    let key = _.findIndex(questions, { id: question.id });
    let result = _.set(_.cloneDeep(group), `questions[${key}]`, _.set(_.cloneDeep(question), 'oneId', one.id));
    _.set(result, `questions[${key}].twoId`, two.id);
    this.props.onGroupChanged(result);
  }

  render() {
    const { group = {}, allGroup = [], region, location } = this.props;
    const { questions = [] } = group;

    const provinceList = _.get(region, "provinceList");
    const cityList = _.get(region, "cityList");

    const userChoices = _.reduce(allGroup, (resultArray, tempGroup) => {
      let tempArray = _.reduce(tempGroup.questions, (subArray, tempQuestion) => {
        if(tempQuestion.type === QuestionType.PICKER || tempQuestion.type === QuestionType.RADIO) {
          if(!!tempQuestion.chosenId) {
            subArray.push(tempQuestion.chosenId);
          }
        }
        return subArray;
      }, []);
      resultArray = resultArray.concat(tempArray);
      return resultArray;
    }, []);

    const renderPickerQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId } = questionInfo;
      let userData = {
        id: chosenId,
      }
      _.forEach(choices, (item, key) => {
        item.value = item.subject;
        if(item.id === chosenId) {
          userData.value = item.value;
        }
      });
      //
      let defaultValue = _.find(choices, { defaultSelected: true });
      return mixQuestionDom(questionInfo,
        <div className="picker-box">
          <DropDownList rootClassName="apply-picker"
                        level={1} data={[ choices ]} userData={chosenId ? [ userData ] : null}
                        defaultData={defaultValue ? [ {
                          id: defaultValue.id, value: defaultValue.subject
                        } ] : undefined}
                        onChoice={(one) => this.commonHandleValueChange(questionInfo, Number.parseInt(one.id), 'chosenId')}/>
        </div>
      )
    }

    const mixQuestionDom = (questionInfo, QuestionDom) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId } = questionInfo;

      return (
        <div className="question" key={questionInfo.id}>
          <div className="question-label">
            <span dangerouslySetInnerHTML={{ __html: question }}/>
            {request ? <span style={{ color: 'red' }}>*</span> : null}
          </div>
          {QuestionDom}
        </div>
      )
    }

    const renderRadioQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-radio">
          <ul className="radio-wrapper">
            {choices.map((choice) => {
              return (
                <li className="radio-choice" key={choice.id}
                    onClick={() => this.commonHandleValueChange(questionInfo, Number.parseInt(choice.id), 'chosenId')}>
                  <span className={`list-style ${chosenId === choice.id ? 'selected' : ''}`}/>
                  <span className="list-text">{choice.subject}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    const renderPhoneQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder, userValue } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-blank">
          <input type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                 onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}/>
        </div>
      )
    }

    const renderBlankQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder, userValue } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-blank">
          <input type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                 onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}/>
        </div>
      )
    }

    const renderMultiBlankQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, placeholder, userValue } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-multi-blank">
          <textarea type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                    onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}
                    rows={5}
          />
        </div>
      )
    }

    const renderAreaQuestion = (questionInfo) => {
      const { question, type, sequence, request, preChoiceId, id, series, tips, choices, chosenId, oneId, twoId } = questionInfo;
      let userData = [
        { id: oneId }, { id: twoId }
      ];
      if(!!oneId && !!twoId) {
        _.set(userData, '[0].value', _.get(_.find(provinceList, { id: oneId }), 'value'));
        _.set(userData, '[1].value', _.get(_.find(cityList, { id: twoId }), 'value'));
      }

      return mixQuestionDom(questionInfo,
        <div className="picker-box">
          <DropDownList rootClassName="apply-picker"
                        level={2} data={[ provinceList, cityList ]} userData={userData[ 1 ].id ? userData : null}
                        onChoice={(one, two) => this.handleChoiceRegion(questionInfo, one, two)}/>
        </div>
      )
    }

    return (
      <div className='question-group'>
        {questions ? questions.map((item, key) => {
          const { type, request, preChoiceId } = item;
          if(!!preChoiceId) {
            // 如果有前置选项，并且前置选项没有选，则不渲染这个
            if(_.indexOf(userChoices, preChoiceId) === -1) {
              return null;
            }
          }
          switch(type) {
            case QuestionType.PICKER:
              return renderPickerQuestion(item);
            case QuestionType.RADIO:
              return renderRadioQuestion(item);
            case QuestionType.BLANK:
              return renderBlankQuestion(item);
            case QuestionType.AREA:
              return renderAreaQuestion(item);
            case QuestionType.MULTI_BLANK:
              return renderMultiBlankQuestion(item);
            case QuestionType.PHONE:
              return renderPhoneQuestion(item);
            default:
              return null;
          }
        }) : null}
      </div>
    )
  }
}
