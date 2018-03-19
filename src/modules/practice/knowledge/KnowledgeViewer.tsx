import * as React from 'react'
import { connect } from 'react-redux'
import './KnowledgeViewer.less'
import AssetImg from '../../../components/AssetImg'
import Audio from '../../../components/Audio'
import WordUnfold from '../../../components/WordUnfold'
import {
  loadDiscuss,
  discussKnowledge,
  loadKnowledge,
  loadKnowledges,
  deleteKnowledgeDiscuss,
  learnKnowledge
} from './async'
import DiscussShow from '../components/DiscussShow'
import Discuss from '../components/Discuss'
import _ from 'lodash'
import { startLoad, endLoad, alertMsg, set } from '../../../redux/actions'
import { scroll } from '../../../utils/helpers'
import { mark } from '../../../utils/request'
import QYVideo from '../../../components/QYVideo'
import { FooterButton } from '../../../components/submitbutton/FooterButton'
import { Block } from '../../../components/Block'
import { SectionProgressHeader, SectionProgressStep } from '../components/SectionProgressHeader'

const sequenceMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G'
}

@connect(state => state)
export default class KnowledgeViewer extends React.Component<any, any> {
  constructor() {
    super()
    this.state = {
      showTip: false,
      showDiscuss: false,
      commentId: 0,
      knowledge: {},
      discuss: {},
      placeholder: '提出你的疑问或意见吧（限1000字）',
      isReply: false,
      content: ''
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    mark({ module: '打点', function: '学习', action: '打开知识点页面' })
    const { id, practicePlanId, complete } = this.props.location.query
    const { dispatch } = this.props
    dispatch(startLoad())
    if(practicePlanId) {
      loadKnowledges(practicePlanId).then(res => {
        if(res.code === 200) {
          this.setState({ knowledge: res.msg[0], referenceId: res.msg[0].id })
          dispatch(endLoad())
          loadDiscuss(res.msg[0].id, 1).then(res => {
            if(res.code === 200) {
              this.setState({ discuss: res.msg })
            }
          })
        } else {
          dispatch(endLoad())
          dispatch(alertMsg(res.msg))
        }
      })

      if(complete == 'false') {
        // 完成练习动效
        dispatch(set('completePracticePlanId', practicePlanId))
      }
    } else if(id) {
      loadKnowledge(id).then(res => {
        if(res.code === 200) {
          this.setState({ knowledge: res.msg })
          dispatch(endLoad())
          loadDiscuss(id, 1).then(res => {
            if(res.code === 200) {
              this.setState({ discuss: res.msg })
            }
          })
        } else {
          dispatch(endLoad())
          dispatch(alertMsg(res.msg))
        }
      })
    }
  }

  reply(item) {
    this.setState({
      showDiscuss: true,
      isReply: true,
      placeholder: '回复 ' + item.name + ':',
      content: '',
      repliedId: item.id,
      referenceId: item.knowledgeId
    })
  }

  reload() {
    const { knowledge } = this.state
    loadDiscuss(knowledge.id, 1).then(res => {
      if(res.code === 200) {
        this.setState({
          discuss: res.msg, showDiscuss: false, repliedId: 0, isReply: false,
          placeholder: '提出你的疑问或意见吧（限1000字）', content: ''
        })
        scroll('.discuss', '.container')
      }
    })
  }

  writeDiscuss() {
    this.setState({ showDiscuss: true, repliedId: 0 }, () => {
      scroll(0, 0)
    })
    if(this.props.trigger) {
      this.props.trigger()
    }
  }

  onChange(value) {
    this.setState({ content: value })
  }

  cancel() {
    this.setState({ placeholder: '提出你的疑问或意见吧（限1000字）', isReply: false, showDiscuss: false, repliedId: 0 })
  }

  onSubmit() {
    mark({
      module: '打点',
      function: '学习',
      action: '点击提交知识点评论'
    })
    const { dispatch } = this.props
    const { referenceId, repliedId, content } = this.state
    if(content.length == 0) {
      dispatch(alertMsg('请填写评论'))
      return
    }

    let discussBody = { comment: content, referenceId: this.state.knowledge.id }

    if(repliedId) {
      _.merge(discussBody, { repliedId: repliedId })
    }

    discussKnowledge(discussBody).then(res => {
      const { code, msg } = res
      if(code === 200) {
        this.reload()
      }
      else {
        dispatch(alertMsg(msg))
      }
    }).catch(ex => {
      dispatch(alertMsg(ex))
    })
  }

  onDelete(id) {
    const { dispatch } = this.props
    const { knowledge } = this.state
    dispatch(startLoad())
    deleteKnowledgeDiscuss(id).then(res => {
      loadDiscuss(knowledge.id, 1).then(res => {
        dispatch(endLoad())
        if(res.code === 200) {
          this.setState({
            discuss: res.msg, showDiscuss: false, repliedId: 0, isReply: false,
            placeholder: '提出你的疑问或意见吧（限1000字）', content: ''
          })
        }
      })
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  handleClickGoWarmup(practicePlanId) {
    const { dispatch } = this.props
    dispatch(startLoad())
    mark({ module: '打点', function: '知识点', action: '完成知识点学习' })
    learnKnowledge(practicePlanId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.refs.sectionProgress.goSeriesPage(SectionProgressStep.WARMUP, dispatch)
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(er => alertMsg(er))
  }

  render() {
    const { showTip, showDiscuss, knowledge, discuss = [], isReply, placeholder } = this.state
    const {
      analysis, means, keynote, audio, audioWords, pic, example, analysisPic, meansPic, keynotePic,
      analysisAudio, analysisAudioWords, meansAudio, meansAudioWords, keynoteAudio, keynoteAudioWords, videoUrl, videoPoster, videoWords
    } = knowledge
    const { location } = this.props
    const { practicePlanId, planId, complete } = location.query

    const choiceRender = (choice, idx) => {
      const { id, subject } = choice
      return (
        <div key={id} className={`choice${choice.isRight ? ' right' : ''}`}>
          <span className={`index`}>
            {sequenceMap[idx]}
          </span>
          <span className={`subject`}>{subject}</span>
        </div>
      )
    }

    const rightAnswerRender = (choice, idx) => {
      return (choice.isRight ? sequenceMap[idx] + ' ' : '')
    }

    return (
      <Block>
        <div className={`knowledge-view-container`}>
          {practicePlanId ? <SectionProgressHeader ref={'sectionProgress'}
                                                   practicePlanId={practicePlanId} currentIndex={0} planId={planId}/>
            : <div className="page-header">{knowledge.knowledge}</div>}
          {
            videoUrl && <QYVideo videoUrl={videoUrl} videoPoster={videoPoster} videoWords={videoWords}/>
          }
          <div className="intro-container">
            {
              audio &&
              <div className="context-audio">
                <Audio url={audio} words={audioWords}/>
              </div>
            }
            {pic && <div className="context-img"><img src={pic}/></div>}
            {
              analysis &&
              <div>
                <div className="context-title-img">
                  <AssetImg height={17} url="https://static.iqycamp.com/images/fragment/analysis3.png"/>
                </div>
                {analysisAudio &&
                <div className="context-audio"><Audio url={analysisAudio} words={analysisAudioWords}/></div>}
                <div className="text">
                  <pre dangerouslySetInnerHTML={{ __html: analysis }}/>
                </div>
                {analysisPic && <div className="context-img"><img src={analysisPic}/></div>}
              </div>
            }
            {
              means &&
              <div>
                <div className="context-title-img">
                  <AssetImg height={17} url="https://static.iqycamp.com/images/fragment/means3.png"/>
                </div>
                {meansAudio && <div className="context-audio"><Audio url={meansAudio} words={meansAudioWords}/></div>}
                <div className="text">
                  <pre dangerouslySetInnerHTML={{ __html: means }}/>
                </div>
                {meansPic && <div className="context-img"><img src={meansPic}/></div>}
              </div>
            }
            {
              keynote &&
              <div>
                <div className="context-title-img">
                  <AssetImg height={17} url="https://static.iqycamp.com/images/fragment/keynote3.png"/>
                </div>
                {
                  keynoteAudio &&
                  <div className="context-audio"><Audio url={keynoteAudio} words={keynoteAudioWords}/></div>
                }
                <div className="text">
                  <pre dangerouslySetInnerHTML={{ __html: keynote }}/>
                </div>
                {keynotePic && <div className="context-img"><img src={keynotePic}/></div>}
              </div>
            }
            {
              example &&
              <div>
                <div className="context-title-img">
                  <AssetImg height={17} url="https://static.iqycamp.com/images/fragment/example2.png"/>
                </div>
                <div className="question">
                  <pre dangerouslySetInnerHTML={{ __html: example.question }}></pre>
                </div>
                <div className="choice-list">
                  {example.choiceList.map((choice, idx) => choiceRender(choice, idx))}
                </div>
                {
                  showTip ?
                    <div className="analysis">
                      <div className="title-bar">解析</div>
                      <div className="context">
                        正确答案：{example.choiceList.map((choice, idx) => rightAnswerRender(choice, idx))}
                      </div>
                      <pre dangerouslySetInnerHTML={{ __html: example.analysis }}></pre>
                    </div> :
                    <WordUnfold words="点击查看解析" onUnfold={() => this.setState({ showTip: true })}/>
                }
              </div>
            }
            {showTip && <div className="title-bar">问答</div>}
            {showTip &&
            <div className="discuss">
              {
                !_.isEmpty(discuss) &&
                discuss.map(item => {
                  return (
                    <DiscussShow discuss={item} showLength={50} reply={() => {
                      this.reply(item)
                    }} onDelete={() => this.onDelete(item.id)}/>
                  )
                })
              }
              {
                discuss &&
                discuss.length > 0 ?
                  <div className="show-more">
                    你已经浏览完所有的讨论啦
                  </div> :
                  <div className="discuss-end">
                    <div className="discuss-end-img">
                      <AssetImg url="https://static.iqycamp.com/images/no_comment.png" width={94}
                                height={92}></AssetImg>
                    </div>
                    <span className="discuss-end-span">点击左侧按钮，发表第一个好问题吧</span>
                  </div>
              }
            </div>
            }
          </div>
          {showDiscuss && <div className="padding-comment-dialog"/>}
          {
            practicePlanId && !showDiscuss &&
            <FooterButton btnArray={[{
              click: () => this.handleClickGoWarmup(practicePlanId),
              text: complete == 'true' ? '下一题' : '学完了，下一题'
            }]}/>
          }
          {
            showDiscuss &&
            <Discuss isReply={isReply} placeholder={placeholder} limit={1000}
                     submit={() => this.onSubmit()}
                     onChange={(v) => this.onChange(v)}
                     cancel={() => this.cancel()}/>}
          {showTip && !showDiscuss &&
          <div className="write-discuss" onClick={() => this.setState({ showDiscuss: true })}>
            <AssetImg url="https://static.iqycamp.com/images/discuss.png" width={45} height={45}></AssetImg>
          </div>
          }
        </div>
      </Block>
    )
  }
}
