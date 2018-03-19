import * as React from 'react'
import { connect } from 'react-redux'
import { merge } from 'lodash'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import './MoreProblem.less'
import { loadCatalog } from './async'
import ProblemItem from './components/ProblemItem'
import { mark } from '../../utils/request'
import { MarkBlock } from '../../components/markblock/MarkBlock'

@connect(state => state)
export default class MoreProblem extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      point: null
    }
    this.picWidth = window.innerWidth * 0.4 - 25
    this.picHeight = 80 / 130 * this.picWdith
  }

  componentWillMount() {
    const { dispatch } = this.props
    mark({
      module:'打点',
      function:'学习',
      action:'加载发现更多页面',
      memo: this.props.location.query.catalogId
    })
    dispatch(startLoad())
    loadCatalog(this.props.location.query.catalogId).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ problemList: res.msg })
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })

    this.picWidth = 130 / 375 * window.innerWidth
    this.picHeight = 80 / 130 * this.picWidth
  }

  openProblem(problem) {
    let param = {
      id: problem.id
    }
    if(this.props.location.query.show) {
      merge(param, { show: true })
    }
    this.context.router.push({ pathname: '/rise/static/plan/view', query: param })
  }

  render() {
    const { problemList } = this.state
    return (
      <div className="more-problem">
        <div className="simple-page-header">
          <span className="title">{problemList ? problemList[ 0 ].catalog : null}</span>
          <span className="desc">{problemList ? problemList[ 0 ].catalogDescribe : null}</span>

        </div>
        <div className="more-problem-container">
          {problemList ? problemList.map((item, key) => {
            return (
              <MarkBlock module={'打点'} func={'发现更多页面'} action={'点击课程介绍'} memo={item.id} className="more-problem-box">
                <ProblemItem problem={item} clickHandler={(problem) => this.openProblem(problem)}/>
              </MarkBlock>
            )
          }) : null}
        </div>
        <div className="show-more" style={{ borderTop: '1px solid #efefef' }}>没有更多了</div>
      </div>
    )
  }
}
