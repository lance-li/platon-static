import * as React from 'react'
import { connect } from 'react-redux'
import './KnowledgeReview.less'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { mark } from '../../../utils/request'
import { knowledgeReview, learnKnowledge } from './async'
import { SectionProgressHeader, SectionProgressStep } from '../components/SectionProgressHeader'
import { FooterButton } from '../../../components/submitbutton/FooterButton'

/**
 * 知识点回顾页面
 */
@connect(state => state)
export default class KnowledgeReview extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      showProblem: false,
      showKnowledge: false,
      knowledge: {},
      data: {}
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    mark({ module: '打点', function: '学习', action: '打开知识点回顾页面' })
    const { dispatch, location } = this.props
    const { id, practicePlanId, complete } = location.query
    dispatch(startLoad())
    if(complete == 'false') {
      dispatch(set('completePracticePlanId', practicePlanId))
    }
    knowledgeReview(practicePlanId).then(res => {
      const { code, msg } = res
      if(code === 200) {
        dispatch(endLoad())
        this.setState({ data: msg })
      }
      else dispatch(alertMsg(msg))
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  goKnowledgeIntro(section) {
    this.context.router.push({ pathname: '/rise/static/practice/knowledge', query: { id: section.knowledgeId } })
  }

  goProblemIntro() {
    const { data } = this.state
    this.context.router.push({ pathname: '/rise/static/plan/view', query: { id: data.id, show: true } })
  }

  handleClickGoWarmup(practicePlanId) {
    const { dispatch } = this.props
    dispatch(startLoad())
    mark({ module: '打点', function: '知识点', action: '完成知识点回顾' })
    learnKnowledge(practicePlanId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.refs.sectionProgress.goSeriesPage(SectionProgressStep.WARMUP, dispatch)
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(er => alertMsg(er))
  }

  complete() {
    window.history.back()
  }

  render() {
    const { data } = this.state
    const { chapterList = [] } = data
    const { practicePlanId, planId, complete } = this.props.location.query

    const renderRoadMap = (chapter, idx) => {
      const { sections } = chapter
      return (
        <div key={idx}>
          <div className='chapter'>{'第' + chapter.chapter + '章 '}{chapter.name}</div>
          {sections && sections.map((section, idx) => renderSection(section, idx, chapter.chapter)) }
        </div>
      )
    }

    const renderSection = (section, idx, chapter) => {
      return (
        section.integrated ?
          <div key={idx}>
            <div className='section'>{chapter}{'.'}{section.section + '节 '}{section.name}</div>
          </div> :
          <div key={idx} onClick={this.goKnowledgeIntro.bind(this, section)}>
            <div className='section click'>{chapter}{'.'}{section.section + '节 '}{section.name}</div>
          </div>
      )
    }

    return (
      <div className="knowledge-review-container">
        <SectionProgressHeader ref={'sectionProgress'} practicePlanId={practicePlanId} currentIndex={0}
                               planId={planId}/>
        <div className="detail-header">
          课程知识点
        </div>
        <div className="detail-container">
          {chapterList && chapterList.map((item, index) => renderRoadMap(item, index))}
        </div>
        {
          practicePlanId &&
          <FooterButton btnArray={[{
              click: () => this.handleClickGoWarmup(practicePlanId),
              text: complete == 'true' ? '下一题':'学完了，下一题'
            }]}/>
        }
      </div>
    )
  }
}
