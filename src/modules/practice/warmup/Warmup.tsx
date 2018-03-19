import * as React from 'react'
import { connect } from 'react-redux'
import {
  loadWarmUpAnalysis,
  answer,
  getOpenStatus,
  consolidationStatus,
  loadWarmUpDiscuss,
  discuss,
  deleteComment,
} from './async'
import _ from 'lodash'
import { startLoad, endLoad, alertMsg, set } from '../../../redux/actions'
import { mark } from '../../../utils/request'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { SectionProgressHeader, SectionProgressStep } from '../components/SectionProgressHeader'
import Discuss from '../components/Discuss'
import DiscussShow from '../components/DiscussShow'
import SubDiscussShow from '../components/SubDiscussShow'
import AssetImg from '../../../components/AssetImg'
import './Main.less'

var $ = require('jquery')

const sequenceMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
}

const WARMUP_AUTO_SAVING = 'rise_warmup_autosaving'

@connect(state => state)
export default class Warumup extends React.Component<any, any> {
  constructor () {
    super()
    this.state = {
      list: [],
      currentIndex: 0,
      practiceCount: 0,
      showDiscuss: false,
      repliedId: 0,
      warmupPracticeId: 0,
      pageIndex: 1,
      integrated: false,
      isReply: false,
      placeholder: '解答同学的提问（限1000字）',
      content: '',
      analysis: false,
      submit: false,
      openStatus: {},
      data: {},
      moveDiscussArea: false,
    }
  }

  // 重新加载开关，只能加载一次
  reloadSwitch = true

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  componentWillMount () {
    mark({
      module: '打点',
      function: '学习',
      action: '加载选择题页面',
    })
    this.loadWarmup()
    getOpenStatus().then(res => {
      if (res.code === 200) {
        this.setState({openStatus: res.msg})
      }
    })
  }

  componentWillUnmount () {
    const {dispatch} = this.props
    dispatch(set('warmupCurrentIndex', undefined))
  }

  //加载选择题
  loadWarmup () {
    const {dispatch, location, warmupCurrentIndex} = this.props
    const {practicePlanId, integrated} = location.query
    const {submit} = this.state
    dispatch(startLoad())
    loadWarmUpAnalysis(practicePlanId).then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if (code === 200) {
        const {practice} = msg
        if (practice) {
          let idx = _.findIndex(practice, (item) => {
            const {choiceList} = item
            if (choiceList) {
              return choiceList.filter(choice => choice.selected).length > 0
            } else {
              return false
            }
          })
          //查看解析
          if (idx !== -1) {
            let currentIndex = 0
            //非从查看解析按钮过来的请求，从缓存中读取上次看到的选择题序号
            if (!submit) {
              if (warmupCurrentIndex) {
                currentIndex = warmupCurrentIndex
              }
            }

            this.setState({
              list: msg, practiceCount: msg.practice.length, currentIndex,
              analysis: true, integrated, submit: false,
            })
          } else {
            //做选择题
            let currentIndex = 0
            let selected = []
            if (practice) {
              //从localstorage中读取上次选择题答案
              let storageDraft = JSON.parse(window.localStorage.getItem(WARMUP_AUTO_SAVING))
              if (storageDraft && storageDraft.id == practicePlanId) {
                const selectedChoices = storageDraft.selectedChoices
                selectedChoices.map((choiceSelected, questionIdx) => {
                  _.set(msg, `practice.${questionIdx}.choice`, choiceSelected)
                })
                selected = _.get(msg, `practice.${selectedChoices.length - 1}.choice`)
                currentIndex = selectedChoices.length - 1
              }
              this.setState({
                list: msg, practiceCount: msg.practice.length, currentIndex, selected,
                analysis: false, integrated, submit: false,
              })
            }
          }
        }
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })

    window.scrollTo(0, 0)
  }

  //更新用户选择的选项
  setChoice (cb) {
    let {list, currentIndex, selected} = this.state
    _.set(list, `practice.${currentIndex}.choice`, selected)
    this.setState({list})
    if (cb) {
      cb(list.practice)
    }
  }

  //当用户选择选项时调用
  onChoiceSelected (choiceId) {
    const {practicePlanId} = this.props.location.query
    const {list, currentIndex, selected} = this.state
    let _list = selected
    if (_list.indexOf(choiceId) > -1) {
      _.remove(_list, n => n === choiceId)
    } else {
      _list.push(choiceId)
    }
    // 答案保存到localstorage
    let storageDraft = JSON.parse(window.localStorage.getItem(WARMUP_AUTO_SAVING))
    if (storageDraft && storageDraft.id == practicePlanId) {
      let {selectedChoices} = storageDraft
      if (selectedChoices.length >= currentIndex + 1) {
        selectedChoices[currentIndex] = _list
      } else {
        selectedChoices.push(_list)
      }
    } else {
      // 初始化
      storageDraft = {id: practicePlanId, selectedChoices: [_list]}
    }
    window.localStorage.setItem(WARMUP_AUTO_SAVING, JSON.stringify(storageDraft))
    this.setState({selected: _list})
  }

  //下一题
  next () {
    const {dispatch} = this.props
    const {currentIndex, practiceCount, list, selected, analysis} = this.state
    if (!analysis && selected && selected.length === 0) {
      dispatch(alertMsg('你还没有选择答案哦'))
      return
    }
    if (currentIndex < practiceCount - 1) {
      this.setChoice()
      let selected = list.practice[`${currentIndex + 1}`].choice
      if (!selected) {
        selected = []
      }
      this.setState({currentIndex: currentIndex + 1, selected})
      //保存当前解析的题目index
      dispatch(set('warmupCurrentIndex', currentIndex + 1))
      let questionId = _.get(list, `practice[${currentIndex}].id`)
      let action = analysis ? '查看解析' : '做选择题'
      mark({module: '打点', function: questionId, action, memo: currentIndex})
    }
    window.scrollTo(0, 0)
  }

  //上一题
  prev () {
    const {dispatch} = this.props
    const {currentIndex, list} = this.state
    if (currentIndex > 0) {
      this.setChoice()
      const selected = list.practice[`${currentIndex - 1}`].choice
      this.setState({currentIndex: currentIndex - 1, selected})
      //保存当前解析的题目index
      dispatch(set('warmupCurrentIndex', currentIndex - 1))
    }
    window.scrollTo(0, 0)
  }

  //选择题提交
  onSubmit () {
    const {dispatch} = this.props
    const {selected, currentIndex, practiceCount, list, openStatus} = this.state
    const {openConsolidation = true} = openStatus
    const {practicePlanId} = this.props.location.query
    if (selected.length === 0) {
      dispatch(alertMsg('你还没有选择答案哦'))
      return
    }
    if (!openConsolidation) {
      consolidationStatus().then(res => {
        const {code, msg} = res
        if (code === 200) {
          this.setState({openStatus: _.merge({}, openStatus, {openConsolidation: true})})
        } else {
          dispatch(alertMsg(msg))
        }
      })
    }
    if (currentIndex === practiceCount - 1) {
      let questionId = _.get(list, `practice[${currentIndex}].id`)
      mark({
        module: '打点',
        function: questionId,
        action: '做选择题',
        memo: currentIndex,
      })
      this.setChoice(p => {
        dispatch(startLoad())
        let res = answer({practice: p}, practicePlanId).then(res => {
          dispatch(endLoad())
          const {code, msg} = res
          if (code === 200) {
            const {total, rightNumber, point} = msg
            dispatch(set('completePracticePlanId', practicePlanId))
            this.clearStorage()
            // redux 存储弹卡片弹出区分变量
            dispatch(set('completeChapterPracticePlanId', practicePlanId))
            this.setState({data: msg, submit: true}, () => {
              $('.result').circleProgress({
                value: rightNumber / total,
                size: 138,
                startAngle: -Math.PI / 2,
                fill: {
                  gradient: ['#FF983F', '#FFC701'],
                },
              })
            })
          } else {
            dispatch(alertMsg(msg))
          }
        }).catch(e => {
          dispatch(alertMsg(e))
        })
      })
    }
  }

  //更新评论
  reload () {
    const {dispatch} = this.props
    let {list, currentIndex} = this.state
    const {practice = []} = list
    const {id} = practice[currentIndex]

    loadWarmUpDiscuss(id, 1).then(res => {
      dispatch(endLoad())
      const {code, msg} = res
      if (code === 200) {
        _.set(list, `practice.${currentIndex}.discussList`, msg)
        this.setState({
          showDiscuss: false, list, content: '', placeholder: '解答同学的提问（限1000字）', repliedId: 0, isReply: false,
        })
        scroll('.discuss', '.warm-up-container')
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  //点击回复评论
  reply (item) {
    this.setState({
      showDiscuss: true, isReply: true,
      placeholder: '回复 ' + item.name + ':', content: '',
      repliedId: item.id, referenceId: item.warmupPracticeId,
    })
  }

  //评论更新
  onChange (value) {
    this.setState({content: value})
  }

  //取消评论
  cancel () {
    this.setState({placeholder: '解答同学的提问（限1000字）', isReply: false, showDiscuss: false, repliedId: 0})
  }

  //提交评论
  onDiscuss () {
    const {dispatch} = this.props
    const {repliedId, content, list, currentIndex} = this.state
    const {practice = []} = list
    const {id} = practice[currentIndex]
    if (content.length == 0) {
      dispatch(alertMsg('请填写评论'))
      return
    }

    let discussBody = {comment: content, referenceId: id}
    if (repliedId) {
      _.merge(discussBody, {repliedId: repliedId})
    }

    discuss(discussBody).then(res => {
      const {code, msg} = res
      if (code === 200) {
        this.reload()
      }
      else {
        dispatch(alertMsg(msg))
      }
    }).catch(ex => {
      dispatch(alertMsg(ex))
    })
  }

  //删除评论
  onDelete (discussId) {
    const {dispatch} = this.props

    deleteComment(discussId).then(res => {
      let {list, currentIndex} = this.state
      const {practice = []} = list
      const {id} = practice[currentIndex]

      loadWarmUpDiscuss(id, 1).then(res => {
        dispatch(endLoad())
        const {code, msg} = res
        if (code === 200) {
          _.set(list, `practice.${currentIndex}.discussList`, msg)
          this.setState({showDiscuss: false, list})
        }
        else dispatch(alertMsg(msg))
      }).catch(ex => {
        dispatch(endLoad())
        dispatch(alertMsg(ex))
      })
    })
  }

  clearStorage () {
    window.localStorage.removeItem(WARMUP_AUTO_SAVING)
  }

  render () {
    const {
      list, currentIndex, selected, practiceCount, showDiscuss, isReply,
      integrated, placeholder, openStatus, analysis, submit, data, moveDiscussArea,
    } = this.state
    const {openConsolidation = true} = openStatus
    const {total, rightNumber, point} = data
    const {practice = []} = list
    const {dispatch, location} = this.props
    const {planId} = location.query

    const questionRender = (practice) => {
      const {id, question, pic, choiceList = [], score = 0, discussList = []} = practice
      return (
        <div>
          <div className="intro-container">
            {
              practiceCount !== 0 && currentIndex <= practiceCount - 1 && <div className="intro-index">
                <span className="index">第{currentIndex + 1}/{practiceCount}题</span>
                <span className="tip">正确选项可能不止一个</span>
                <span className="type"><span className="number">{score}</span>分</span>
              </div>
            }
            {
              pic &&
              <div className="context-img">
                <AssetImg url={pic}/>
              </div>
            }
            <div className="question">
              <div dangerouslySetInnerHTML={{__html: question}}/>
            </div>
            <div className="choice-list">
              {choiceList.map((choice, idx) => choiceRender(choice, idx))}
            </div>
            {
              analysis &&
              <div className="answer-display">
                <div className="chosen" style={{marginBottom: 15}}>
                  已选答案：{choiceList.map((choice, idx) => myAnswerRender(choice, idx))}
                </div>
                <div className="right">
                  正确答案：{choiceList.map((choice, idx) => rightAnswerRender(choice, idx))}
                </div>
              </div>
            }

          </div>
          {analysis &&
          <div className="analysis">
            <div className="analysis-icon">解析</div>
            <div className="analysis-context"
                 dangerouslySetInnerHTML={{__html: practice ? practice.analysis : ''}}/>
            {integrated == 'false' &&
            <div className="knowledge-link"
                 onClick={() => this.refs.sectionProgress.goSeriesPage(SectionProgressStep.KNOWLEDGE, dispatch)}>
              点击查看相关知识点
            </div>
            }
          </div>
          }
          {
            analysis &&
            <div className="discuss-container" ref={'discussContainer'} id={'discuss-container'}>
              <div className="discuss">
                <div className="discuss-bar">问答</div>
                {
                  !_.isEmpty(discussList) &&
                  discussList.map((discuss, idx) => discussRender(discuss, idx))
                }
                {
                  !_.isEmpty(discussList) ? <div className="show-more">
                    你已经浏览完所有的讨论啦
                  </div> : <div className="discuss-end">
                    <div className="discuss-end-img">
                      <AssetImg url="https://static.iqycamp.com/images/no_comment.png" width={94} height={92}/>
                    </div>
                    <span className="discuss-end-span">点击左侧按钮，发表第一个好问题吧</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      )
    }

    const discussRender = (comment, idx) => {
      const {warmupPracticeDiscussList} = comment
      return (
        <div key={idx}>
          <DiscussShow discuss={comment} showLength={50} reply={() => this.reply(comment)}
                       onDelete={this.onDelete.bind(this, comment.id)}/>
          {
            !_.isEmpty(warmupPracticeDiscussList) &&
            <div>
              <div className="discuss-triangle"></div>
              {warmupPracticeDiscussList.map((discuss, idx) => subDiscussRender(discuss, idx))}
              <div className="discuss-padding"></div>
            </div>
          }
        </div>
      )
    }

    const subDiscussRender = (discuss, idx) => {
      return (
        <SubDiscussShow discuss={discuss} showLength={50} reply={() => this.reply(discuss)}
                        onDelete={this.onDelete.bind(this, discuss.id)}/>
      )
    }

    const choiceRender = (choice, idx) => {
      const {id, subject} = choice
      const {analysis} = this.state
      if (analysis) {
        return (
          <div key={idx} className={`choice${choice.selected ? ' selected' : ''}${choice.isRight ? ' right' : ''}`}>
            <span className={`index${choice.selected ? ' selected' : ''}`}/>
            <span className={`text${choice.isRight ? ' right' : ''}`}>{sequenceMap[idx]}&nbsp;&nbsp;{subject}</span>
          </div>
        )
      } else {
        return (
          <div key={idx} className={`choice${selected.indexOf(id) > -1 ? ' selected' : ''}`}
               onClick={e => this.onChoiceSelected(id)}>
            <span className={`index ${selected.indexOf(id) > -1 ? ' selected' : ''}`}>{sequenceMap[idx]}</span>
            <span className={`text`}>{sequenceMap[idx]}&nbsp;&nbsp;{subject}</span>
          </div>
        )
      }
    }

    const rightAnswerRender = (choice, idx) => {
      return (choice.isRight ? sequenceMap[idx] + ' ' : '')
    }

    const myAnswerRender = (choice, idx) => {
      return (choice.selected ? sequenceMap[idx] + ' ' : '')
    }

    const footerButtonRender = () => {
      if (analysis) {
        if (!showDiscuss) {
          return (
            <FooterButton btnArray={[
              {
                click: () => {
                  this.prev()
                },
                className: `${currentIndex === 0 ? 'disable' : ''}`,
                text: '上一题',
              },
              {
                click: () => {
                  currentIndex + 1 < practiceCount ? this.next() : this.refs.sectionProgress.goSeriesPage(
                    SectionProgressStep.BASE_APPLICATION, dispatch)
                },
                text: '下一题',
              },
            ]}/>
          )
        }
      } else {
        return (
          <FooterButton btnArray={[
            {click: () => this.prev(), text: '上一题', className: `${currentIndex == 0 ? 'disable' : ''}`},
            {
              click: () => {
                currentIndex !== practiceCount - 1 ? this.next() : this.onSubmit()
              },
              text: currentIndex !== practiceCount - 1 ? '下一题' : '提交',
            },
          ]}/>
        )
      }
    }

    const discussAreaRender = () => {
      if (analysis) {
        if (showDiscuss) {
          return (
            <Discuss isReply={isReply} placeholder={placeholder} limit={1000} submit={() => this.onDiscuss()}
                     onChange={(v) => this.onChange(v)} cancel={() => this.cancel()}/>
          )
        } else {
          return (
            <div className="write-discuss" onClick={() => this.setState({showDiscuss: true})}>
              <AssetImg url="https://static.iqycamp.com/images/discuss.png" width={45} height={45}/>
            </div>
          )
        }
      }
    }

    return (
      <div className="warm-up-container">
        <SectionProgressHeader ref={'sectionProgress'} planId={planId}
                               practicePlanId={this.props.location.query.practicePlanId} currentIndex={1}/>
        {
          !openConsolidation &&
          <div className="progress-section-tip">
            <div className="tip-angle"/>
            点这里可以回看学过的知识点
          </div>
        }
        {questionRender(practice[currentIndex] || {})}
        {showDiscuss && <div className="padding-comment-dialog"/>}
        {discussAreaRender()}
        {footerButtonRender()}
        {
          submit &&
          <div className="result-mask">
            <div className="result-dialog">
              <div className="result">
                <div className="result-title">答对题数</div>
                <div className="result-number">{rightNumber + '/' + total}</div>
              </div>
              <div className="award-title">获得奖励</div>
              <div className="award-detail">任务得分{' '}<span>{'+' + point}</span></div>
              <div className="go-analysis" onClick={() => this.loadWarmup()}>查看解析</div>
            </div>
          </div>
        }
      </div>
    )
  }

}
