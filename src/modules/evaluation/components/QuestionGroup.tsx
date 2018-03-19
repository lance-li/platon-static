import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash';
import './QuestionGroup.less'
import { startLoad, endLoad, alertMsg, set } from 'reduxutil/actions'
import { pget, ppost, mark } from "utils/request"
import { loadBusinessApplyQuestion, submitApply, sendValidCode, validSMSCode, submitSurvey, loadSurvey } from '../async';
import DropDownList from '../../customer/components/DropDownList'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import $ from 'jquery';
import classnames from 'classnames';
import { Dialog } from 'react-weui'
import numeral from 'numeral';

const { Alert } = Dialog;

interface QuestionGroupProps {
  onGroupChanged?: any,
  allGroup: any,
  region?: any,
  questionAsync: any,
  firstTips?: any,
  referId?: any,
}

enum QuestionType {
  PICKER = 1,
  RADIO = 2,
  BLANK = 3,
  MULTI_BLANK = 4,
  AREA = 5,
  PHONE = 6,
  PIC = 7,
  UPLOAD_PIC = 8,
  MULTI_RADIO = 9,
  SPECIAL_RADIO = 10
}

let QUESTION_GROUP_SAVING = 'question_group_saving';

@connect(state => state)
export class QuestionGroup extends Component<QuestionGroupProps, any> {
  constructor() {
    super();
    this.state = { codeTimeRemain: 0, currentIndex: 0 }
    this.intervalTrigger = null;
  }

  async componentWillMount() {
    const { dispatch, category, firstTips } = this.props;
    let saving = JSON.parse(window.localStorage.getItem(QUESTION_GROUP_SAVING));
    if(!_.isEmpty(saving) && saving.category == category) {
      this.setState({
        allGroup: saving.allGroup, currentIndex: saving.currentIndex, firstTips: saving.firstTips
      });
    } else {
      let questionRes = await loadSurvey(category);
      this.setState({
        allGroup: questionRes.msg.surveyQuestions, currentIndex: 0, firstTips: firstTips
      });
    }
    let regionRes = await pget('/rise/customer/region');
    dispatch(set("region", regionRes.msg));
  }

  /**
   * 通用的onChange处理方法
   * @param question 问题信息
   * @param value 值
   * @param keyName 键名
   */
  commonHandleValueChange(question, value, keyName, cb) {
    const { currentIndex, allGroup, firstTips } = this.state;
    const { category } = this.props;
    let group = _.get(allGroup, `[${currentIndex}]`);
    let questions = _.get(allGroup, `[${currentIndex}].questions`, []);
    let key = _.findIndex(questions, { id: question.id });
    let result = _.set(_.cloneDeep(group), `questions[${key}]`, _.set(_.cloneDeep(question), keyName, value));
    let newGroups = _.cloneDeep(allGroup);
    newGroups[ currentIndex ] = result;
    this.setState({ allGroup: newGroups }, () => {
      !!cb && cb();
    });
    window.localStorage.setItem(QUESTION_GROUP_SAVING, JSON.stringify({
      category: category, currentIndex: currentIndex, firstTips: firstTips, allGroup: newGroups
    }))
    // this.props.onGroupChanged(result);
  }

  /**
   * 点击选择区域
   * @param question 问题信息
   * @param one 省
   * @param two 市
   */
  handleChoiceRegion(question, one, two) {
    const { allGroup, currentIndex } = this.state;
    let group = _.get(allGroup, `[${currentIndex}]`, {});
    let questions = _.get(group, 'questions', []);
    let key = _.findIndex(questions, { id: question.id });
    let result = _.set(_.cloneDeep(group), `questions[${key}]`, _.set(_.cloneDeep(question), 'oneId', one.id));
    _.set(result, `questions[${key}].twoId`, two.id);

    let newGroups = _.cloneDeep(allGroup);
    newGroups[ currentIndex ] = group;
    this.setState({ allGroup: newGroups });
    // this.props.onGroupChanged(result);
  }

  /**
   * 点击发送验证码
   */
  handleClickSendPhoneCode(questionInfo) {
    const { phoneCheckCode, userValue } = questionInfo;
    const { codeTimeRemain = 0 } = this.state;
    const { dispatch } = this.props;
    if(codeTimeRemain !== 0) {
      dispatch(alertMsg(`请${codeTimeRemain}秒稍后再试`));
      return;
    } else {
      // 可以发送，检查phone
      let NUMBER_REG = /^[0-9]+$/;
      if(!userValue) {
        dispatch(alertMsg('请输入手机号码'));
        return;
      }

      if(!NUMBER_REG.test(userValue)) {
        dispatch(alertMsg('请输入格式正确的手机'));
        return;
      }

      if(!!this.intervalTrigger) {
        clearInterval(this.intervalTrigger);
      }
      this.setState({ codeTimeRemain: 60 }, () => {
        this.intervalTrigger = setInterval(() => {
          this.setState({ codeTimeRemain: this.state.codeTimeRemain - 1 });
          if(this.state.codeTimeRemain <= 0) {
            clearInterval(this.intervalTrigger);
          }
        }, 1000);
      })

      // 发送验证码
      sendValidCode(userValue).then(res => {
        if(res.code !== 200) {
          dispatch(alertMsg(res.msg));
        }
      });
    }

  }

  handleUploadError(msg) {
    const { dispatch } = this.props;
    dispatch(endLoad());
    dispatch(alertMsg(msg));
  }

  handleUploadStart(msg) {
    const { dispatch } = this.props;
    dispatch(startLoad());
  }

  handleUploadSuccess(msg, questionInfo) {
    const { dispatch } = this.props;
    dispatch(endLoad());
    // 上传成功
    this.commonHandleValueChange(questionInfo, msg, 'userValue')
  }

  /**
   * 检查题目是否完成
   * @param question 题目
   * @param userChoices 用户选项
   */
  checkQuestionComplete(question, userChoices) {
    const { type, chosenId, chosenIds, preChoiceId, userValue, oneId, twoId, request, phoneCheckCode, memo } = question;

    if(!!preChoiceId) {
      if(_.indexOf(userChoices, preChoiceId) === -1) {
        // 不满足前置条件，则不检查
        return { flag: true };
      }
    }
    if(!request) {
      // 不是必填
      return { flag: true };
    }

    switch(type) {
      case QuestionType.PICKER:
      case QuestionType.RADIO:
      case QuestionType.SPECIAL_RADIO:
        return {
          flag: !!chosenId,
          msg: '请完成必选题'
        }
      case QuestionType.BLANK:
      case QuestionType.MULTI_BLANK:
      case QuestionType.PHONE:
      case QuestionType.UPLOAD_PIC:
        return {
          flag: !!userValue,
          msg: '请填写信息'
        }
      case QuestionType.AREA:
        return {
          flag: !!oneId && !!twoId,
          msg: '请选择地址'
        }
      case QuestionType.MULTI_RADIO: {
        let maxChoose = 10;
        try {
          maxChoose = _.get(JSON.parse(memo), 'maxChoose');
        } catch(e) {
          // ignore
          console.log(e);
        }
        return {
          flag: !_.isEmpty(chosenIds) && chosenIds.length === maxChoose,
          msg: `本多选题必须选择${maxChoose}个选项`
        };
      }
      default:
        return {
          flag: false,
          msg: '请完成必做题'
        };
    }
  }

  /**
   * 计算做了多少题
   * @param allGroup 题目组
   * @return 做了多少题
   */
  calculateQuestionDoneCount(allGroup, userChoices) {
    return _.reduce(allGroup, (count, tempGroup) => {
      let questions = tempGroup.questions;
      for(let i = 0; i < questions.length; i++) {

        const { type, chosenId, chosenIds, preChoiceId, userValue, oneId, twoId, request, phoneCheckCode, memo } = questions[ i ];

        let checkResult = false;

        if(!!preChoiceId) {
          if(_.indexOf(userChoices, preChoiceId) === -1) {
            // 不满足前置条件，则不检查
            continue;
          }
        }
        if(!request) {
          // 不是必填
          continue;
        }

        switch(type) {
          case QuestionType.PICKER:
          case QuestionType.RADIO:
          case QuestionType.SPECIAL_RADIO:
            checkResult = !!chosenId;
            break;
          case QuestionType.BLANK:
          case QuestionType.MULTI_BLANK:
          case QuestionType.PHONE:
          case QuestionType.UPLOAD_PIC:
            checkResult = !!userValue;
            break;
          case QuestionType.AREA:
            checkResult = !!oneId && !!twoId;
            break;
          case QuestionType.MULTI_RADIO: {
            let maxChoose = 10;
            try {
              maxChoose = _.get(JSON.parse(memo), 'maxChoose');
            } catch(e) {
              // ignore
              console.log(e);
            }
            checkResult = !_.isEmpty(chosenIds) && chosenIds.length === maxChoose;
            break;
          }
          default:
            continue;
        }
        if(checkResult) {
          // 已经做完了
          count++;
        } else {
          continue;
        }
      }
      return count;
    }, 0);
  }

  /**
   * 检查是否可以提交
   * @param questionGroup
   * @param currentIndex
   * @return {Promise<any>}
   */
  async checkChoice(questionGroup, currentIndex) {
    const userChoices = this.calculateUserChoices(questionGroup);
    let group = questionGroup[ currentIndex ];
    let questions = group.questions;

    for(let i = 0; i < questions.length; i++) {
      let checkResult = this.checkQuestionComplete(questions[ i ], userChoices);
      if(!checkResult.flag) {
        return checkResult.msg;
      }
    }
    // 特殊检查电话
    let phoneQuestions = _.reduce(questionGroup, (questionList, nextGroup, key) => {
      // 忽略当前页之后的电话
      if(key !== currentIndex) {
        // 不是当前页，不检查
        return questionList;
      }
      let subQuestion = _.find(nextGroup.questions, { type: QuestionType.PHONE });
      if(!!subQuestion) {
        questionList.push(subQuestion);
      }
      return questionList;
    }, []);

    // TODO 这里只能检查一个电话
    let phoneInfo = _.get(phoneQuestions, '[0]');
    let hasPhone = true;
    if(!!phoneInfo) {
      // 有电话题目
      if(!!phoneInfo.preChoiceId) {
        // 如果有前置选项，并且前置选项没有选，则不渲染这个
        if(_.indexOf(userChoices, phoneInfo.preChoiceId) === -1) {
          hasPhone = false;
        }
      }
    } else {
      // 没有电话题目
      return '';
    }

    const { userValue, phoneCheckCode } = phoneInfo;

    if(hasPhone) {
      if(!phoneCheckCode) {
        return '请输入验证码'
      }

      let res = await validSMSCode({ phone: userValue, code: phoneCheckCode })
      if(res.code !== 200) {
        return '验证码错误，请重新输入'
      }
    }

    return ''
  }

  /**
   * 计算题数
   * @param allGroup 题目组
   * @return 题数
   */
  calculateQuestionCount(allGroup, userChoices) {
    return _.reduce(allGroup, (count, tempGroup) => {
      let questionCount = 0;
      let questions = questions = _.get(tempGroup, 'questions', []);
      _.forEach(questions, (item) => {
        if(!!item.preChoiceId && _.indexOf(userChoices, item.preChoiceId) === -1) {
          // 有preChoiceId 但是没有选中
          return;
        }
        questionCount++;
      });
      return questionCount + count;
    }, 0);
  }

  /**
   * 计算用户的选项
   * @param questionGroup 题目组
   * @return 用户选项id的数组
   */
  calculateUserChoices(questionGroup) {
    return _.reduce(questionGroup, (resultArray, tempGroup) => {
      let questions = _.get(tempGroup, 'questions', [])
      let tempArray = _.reduce(questions, (subArray, tempQuestion) => {
        if(tempQuestion.type === QuestionType.PICKER || tempQuestion.type === QuestionType.RADIO || tempQuestion.type === QuestionType.SPECIAL_RADIO) {
          if(!!tempQuestion.chosenId) {
            subArray.push(tempQuestion.chosenId);
          }
        } else if(tempQuestion.type === QuestionType.MULTI_RADIO) {
          if(!_.isEmpty(tempQuestion.chosenIds)) {
            subArray = subArray.concat(tempQuestion.chosenIds);
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
  async handleClickNextStep() {
    const { dispatch } = this.props;
    const { allGroup, currentIndex } = this.state
    let msg = await this.checkChoice(allGroup, currentIndex)
    if(msg) {
      dispatch(alertMsg(msg))
      return
    }

    this.nextStep()
  }

  /**
   * 跳下一页
   */
  nextStep() {
    const { allGroup, currentIndex, firstTips } = this.state
    const { dispatch, category } = this.props;
    let group = allGroup[ currentIndex ];
    let nextIndex = this.findNextVisibleIndex(allGroup, currentIndex);
    this.setState({ group: group }, () => {
      $('.question-group').animateCss('fadeOutLeft', () => {
        this.setState({ currentIndex: nextIndex }, () => {
          mark({ module: "问卷", function: category, action: "翻页", memo: _.get(allGroup, `[ ${nextIndex} ].series`) });
          $('.question-group').animateCss('fadeInRight');
          let type = _.get(allGroup[ nextIndex ], 'questions[0].type');
          let tips = _.get(firstTips, type);
          if(!!tips) {
            // 第一次提示
            dispatch(alertMsg(tips));
            this.setState({ firstTips: _.set(firstTips, `${type}`, false) })
          }
        })
      })
    })
  }

  findNextVisibleIndex(questionGroup, currentIndex) {
    let wannaIndex = currentIndex + 1;
    const userChoices = this.calculateUserChoices(questionGroup);

    if(questionGroup.length <= wannaIndex) {
      return wannaIndex
    } else {
      // 开始查找
      for(let i = wannaIndex; i < questionGroup.length; i++) {
        let group = questionGroup[ i ];
        // 可以显示的题目
        let filterGroup = _.filter(group.questions, item => {
          // 没有前置选项 || 有，但是满足
          return !item.preChoiceId || _.indexOf(userChoices, item.preChoiceId) !== -1;
        })
        if(!_.isEmpty(filterGroup)) {
          return i;
        }
      }
      // 如果一个也找不到，就return最后一组
      return questionGroup.length - 1;
    }
  }

  findPreVisibleIndex(questionGroup, currentIndex) {
    let wannaIndex = currentIndex - 1;
    const userChoices = this.calculateUserChoices(questionGroup);

    if(questionGroup.length <= wannaIndex) {
      return wannaIndex
    } else {
      // 开始查找
      for(let i = wannaIndex; i > 0; i--) {
        let group = questionGroup[ i ];
        // 可以显示的题目
        let filterGroup = _.filter(group.questions, item => {
          // 没有前置选项 || 有，但是满足
          return !item.preChoiceId || _.indexOf(userChoices, item.preChoiceId) !== -1;
        })
        if(!_.isEmpty(filterGroup)) {
          return i;
        }
      }
      // 如果一个也找不到，就return第一个
      return 0;
    }
  }

  /**
   * 点击上一步
   */
  prevStep() {
    const { allGroup, currentIndex, } = this.state
    let preIndex = this.findPreVisibleIndex(allGroup, currentIndex);
    $('.question-group').animateCss('fadeOutRight', () => {
      this.setState({ currentIndex: preIndex },
        () => {
          $('.question-group').animateCss('fadeInLeft');
        }
      )
    })
  }

  async handleClickSubmitBtn() {
    const { dispatch, region } = this.props;
    const { allGroup, currentIndex } = this.state
    let msg = await this.checkChoice(allGroup, currentIndex)
    if(msg) {
      dispatch(alertMsg(msg))
      return
    }
    this.setState({ showConfirmModal: true });
  }

  /**
   * 点击提交按钮
   */
  async handleClickSubmit() {
    const { dispatch, region } = this.props;
    const { allGroup, currentIndex } = this.state

    let msg = await this.checkChoice(allGroup, currentIndex)
    if(!!msg && msg != '验证码错误，请重新输入') {
      // 提交的时候不验证验证码,注意，手机号不能放最后一道题
      dispatch(alertMsg(msg))
      return
    }

    let result = _.reduce(allGroup, (submitList, nextGroup) => {
      let subParam = _.reduce(nextGroup.questions, (tempList, question) => {
        let subTempParam = {};
        switch(question.type) {
          case QuestionType.PICKER:
          case QuestionType.RADIO:
          case QuestionType.SPECIAL_RADIO: {
            _.merge(subTempParam, { questionCode: question.questionCode, choiceId: question.chosenId });
            break;
          }
          case QuestionType.BLANK:
          case QuestionType.MULTI_BLANK:
          case QuestionType.PHONE:
          case QuestionType.UPLOAD_PIC: {
            _.merge(subTempParam, { questionCode: question.questionCode, userValue: question.userValue });
            break;
          }
          case QuestionType.AREA: {
            const provinceName = _.find(_.get(region, "provinceList"), { id: question.oneId }).value;
            const cityName = _.find(_.get(region, "cityList"), { id: question.twoId }).value;
            _.merge(subTempParam, { questionCode: question.questionCode, userValue: provinceName + '-' + cityName });
            break;
          }
          case QuestionType.MULTI_RADIO: {
            _.merge(subTempParam, { questionCode: question.questionCode, choiceIds: question.chosenIds });
            break;
          }
          default:
          // ignore
        }
        if(!_.isEmpty(subTempParam)) {
          tempList.push(subTempParam);
        }

        return tempList;
      }, []);
      submitList = submitList.concat(subParam);
      return submitList;
    }, []);

    this.submitAPI({ userSubmits: result });
  }

  submitAPI(param) {
    const { dispatch, category, onSubmit, referId } = this.props;
    _.merge(param, { referId: referId });
    mark({ module: "打点", function: "问卷", action: "提交问卷", memo: category });
    // 开始提交
    dispatch(startLoad());
    submitSurvey(category, param).then(res => {
      dispatch(endLoad());
      if(res.code === 200) {
        window.localStorage.setItem(QUESTION_GROUP_SAVING, JSON.stringify({}));
        onSubmit(res.msg);
      } else {
        dispatch(alertMsg(res.msg));
      }
    }).catch(ex => {
      dispatch(endLoad());
      dispatch(alertMsg(ex));
    })
  }

  render() {
    const { region, header } = this.props
    const { currentIndex, allGroup = [], showConfirmModal } = this.state;
    let group = _.get(allGroup, `${currentIndex}`, {});
    const { questions = [] } = group
    const provinceList = _.get(region, "provinceList");
    const cityList = _.get(region, "cityList");
    let seriesCount = allGroup.length;

    // 用户选择的
    const userChoices = this.calculateUserChoices(allGroup);

    // 总共多少题
    const questionCount = this.calculateQuestionCount(allGroup, userChoices)

    // 已经做了多少
    const questionDoneCount = this.calculateQuestionDoneCount(allGroup, userChoices);

    const renderPickerQuestion = (questionInfo) => {
      const { choices, chosenId, placeholder } = questionInfo;
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
                        onChoice={(one) => this.commonHandleValueChange(questionInfo, Number.parseInt(one.id), 'chosenId')}
                        placeholder={placeholder}
          />
        </div>
      )
    }

    const mixQuestionDom = (questionInfo, QuestionDom) => {
      const { subject, request, tips } = questionInfo;
      const { upName } = this.props;

      return (
        <div className="question" key={questionInfo.id}>
          <div className="question-label">
            <span dangerouslySetInnerHTML={{ __html: _.replace(subject, '{username}', upName) }}/>
            {/*{request ? <span style={{ color: 'red' }}>*</span> : null}*/}
          </div>
          {tips ? <div className="question-tips" dangerouslySetInnerHTML={{ __html: tips }}/> : null}
          {QuestionDom}
        </div>
      )
    }

    const renderRadioQuestion = (questionInfo) => {
      const { choices, chosenId } = questionInfo;
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
      const { placeholder, userValue, phoneCheckCode } = questionInfo;
      const { codeTimeRemain = 0 } = this.state;
      return mixQuestionDom(questionInfo,
        <div>
          <div className="question-blank">
            <input type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                   onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}/>
          </div>
          <div className="check-code-wrapper">
            <span className="code-send-label">验证码：</span>
          </div>
          <div className="send-phone-blank" style={{ margin: '0 0 20px' }}>
            <input type="text" placeholder='请填写验证码' value={phoneCheckCode}
                   onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'phoneCheckCode')}/>
          </div>
          <div className={`send-phone-code ${codeTimeRemain === 0 ? 'free' : 'sending'}`}
               onClick={() => this.handleClickSendPhoneCode(questionInfo)}>
            {codeTimeRemain === 0 ? '发送验证码' : `${codeTimeRemain}秒后重新发送`}
          </div>
        </div>
      )
    }

    const renderBlankQuestion = (questionInfo) => {
      const { placeholder, userValue } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="question-blank">
          <input type="text" placeholder={placeholder ? placeholder : '请填写'} value={userValue}
                 onChange={(e) => this.commonHandleValueChange(questionInfo, e.target.value, 'userValue')}/>
        </div>
      )
    }

    const renderMultiBlankQuestion = (questionInfo) => {
      const { placeholder, userValue } = questionInfo;
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
      const { oneId, twoId } = questionInfo;
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

    const renderPic = (questionInfo) => {
      const { question } = questionInfo;

      return (
        <div className="question-pic">
          <div className="question-pic-text">
            你将会在以上时间收到招生委员会的电话/语音面试。委员会由圈外创始人团队、投资人、CEO教练和顶级公司HR等权威专家构成。
          </div>
          <img src={question} width={'100%'} height={'100%'} style={{ display: 'block' }}/>
        </div>
      )
    }

    const renderUploadPic = (questionInfo) => {

      return mixQuestionDom(questionInfo,
        <div className='upload-image'>
          <UploadComponent handleUploadError={(msg) => this.handleUploadError(msg, questionInfo)}
                           handleUploadStart={(msg) => this.handleUploadStart(msg, questionInfo)}
                           handleUploadSuccess={(msg) => this.handleUploadSuccess(msg, questionInfo)}
                           uploadedUrl={questionInfo.userValue}
                           successIcon={true}
          />
        </div>
      )
    }

    const renderSpecialRadio = (questionInfo = {}) => {
      const { choices } = questionInfo;
      return mixQuestionDom(questionInfo,
        <div className="special-radio">
          {choices && choices.map((item, key) => {
            let classNames = classnames('special-radio-box', {
              'chosen': _.indexOf(userChoices, item.id) !== -1
            });
            return (
              <div className={classNames}
                   onClick={() => this.commonHandleValueChange(questionInfo, Number.parseInt(item.id), 'chosenId', () => {
                     if(currentIndex !== seriesCount - 1) {
                       this.handleClickNextStep();
                     }
                   })}>
                {item.subject}
              </div>
            )
          })}
        </div>
      );
    }

    const renderMultiRadio = (questionInfo = {}) => {
      const { choices = [], memo } = questionInfo;
      const { dispatch } = this.props;
      return mixQuestionDom(questionInfo,
        <div className="multi-radio">
          {choices && choices.map((item, key) => {
            let classNames = classnames('multi-radio-box', {
              'chosen': _.indexOf(userChoices, item.id) !== -1
            });
            let maxChoose = 10;
            if(!!memo) {
              maxChoose = _.get(JSON.parse(memo), 'maxChoose', 10);
            }

            return (
              <div className={classNames}
                   onClick={() => {
                     let choices = _.cloneDeep(questionInfo.chosenIds);
                     if(!choices) {
                       choices = [];
                     }
                     if(_.indexOf(choices, item.id) !== -1) {
                       _.remove(choices, (k) => k == item.id);
                     } else {
                       if(choices.length < maxChoose) {
                         choices.push(item.id);
                       } else {
                         dispatch(alertMsg(`最多选择${maxChoose}个选项`));
                         return;
                       }
                     }
                     this.commonHandleValueChange(questionInfo, choices, 'chosenIds')
                   }}>
                {item.subject}
              </div>
            )
          })}
        </div>
      );
    }

    const renderButtons = () => {

      if(currentIndex === 0) {
        return (
          <FooterButton btnArray={[ {
            click: () => this.handleClickNextStep(),
            text: '下一步'
          } ]}/>
        )
      } else if(currentIndex === seriesCount - 1) {
        return (
          <FooterButton btnArray={[ {
            click: () => this.prevStep(),
            text: '上一步'
          }, {
            click: () => this.handleClickSubmitBtn(),
            text: '提交'
          } ]}/>
        )
      } else {
        return (
          <FooterButton btnArray={[ {
            click: () => this.prevStep(),
            text: '上一步'
          }, {
            click: () => this.handleClickNextStep(),
            text: '下一步'
          } ]}/>
        )
      }
    }
    return (
      <div className="question-group-container">
        <div className="apply-page-header">{header}</div>
        <div className="apply-progress">
          <div className="apply-progress-bar"
               style={{ width: `${(questionDoneCount / questionCount) * 100}%` }}/>
        </div>
        <div
          className="apply-progress-page-index">{!!questionCount ? (numeral(questionDoneCount / questionCount).format('0%')) : 0}</div>
        <div className='question-group'>
          {questions && questions.map((item, key) => {
            const { type, preChoiceId } = item;
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
              case QuestionType.PIC:
                return renderPic(item);
              case QuestionType.UPLOAD_PIC:
                return renderUploadPic(item);
              case QuestionType.SPECIAL_RADIO:
                return renderSpecialRadio(item);
              case QuestionType.MULTI_RADIO:
                return renderMultiRadio(item);
              default:
                return null;
            }
          })}
        </div>
        <div style={{ height: '80px', width: '100%' }}/>
        {renderButtons()}

        <Alert show={showConfirmModal} buttons={[
          {
            label: '取消',
            onClick: () => this.setState({ showConfirmModal: false })
          }, {
            label: '确定',
            onClick: () => this.handleClickSubmit()
          }
        ]} title='确认提交吗？'>
          <div className="global-pre"
               style={{ paddingTop: 0 }}
               dangerouslySetInnerHTML={{ __html: '提交后，本次测评答案无法修改' }}/>
        </Alert>
      </div>
    )
  }
}
