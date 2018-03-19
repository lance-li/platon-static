import * as React from 'react'
import { connect } from 'react-redux'
import './ProblemGallery.less'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { pget, ppost } from 'utils/request'
import { mark } from 'utils/request'
import { changeTitle } from 'utils/helpers'
import { MarkBlock } from '../../components/markblock/MarkBlock'

/**
 * 我的课程页面
 */
@connect(state => state)
export default class ProblemGallery extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    mark({ module: '打点', function: '个人中心', action: '打开我的课程页面' })
    changeTitle('我的课程')
    const { dispatch } = this.props
    dispatch(startLoad())
    pget('/rise/customer/plans').then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState(res.msg)
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => {
      dispatch(endLoad())
      dispatch(alertMsg(err + ''))
    })
  }

  goPointTip() {
    this.context.router.push({ pathname: '/rise/static/customer/point/tip' })
  }

  goPlanView(item) {
    this.context.router.push({
      pathname: '/rise/static/problem/cards',
      query: { planId: item.planId }
    })
  }

  goCertificateView(item) {
    let query = { certificateNo: item.certificateNo }
    this.context.router.push({ pathname: '/rise/static/customer/certificate', query })
  }

  render() {
    const { runningPlans = [], donePlans = [], point, riseCertificates = [], problemCollections = [] } = this.state

    const renderGalleyList = (plans) => {
      plans = plans.filter(plan => plan.learnable === true)
      return (
        <div className="galley-module-content">
          { plans.map((item, index) => {
            return (
              <MarkBlock module={'打点'} func={'我的课程页面'} action={'点击课程学习'} key={index} className="item"
                         onClick={() => this.goPlanView(item)}>
                <div className="item-label">
                  {item.name}
                </div>
                <div className="item-content">
                  {item.point + ' 积分'}
                </div>
              </MarkBlock>
            )
          }) }
        </div>
      )
    }

    const renderCertificateList = (certificates) => {
      return (
        <div className="galley-module-content">
          {certificates.map((item, index) => {
              return (
                <MarkBlock module={'打点'} func={'我的课程页面'} action={'点击查看证书'} key={index} className="item"
                           onClick={() => this.goCertificateView(item)}>
                  <div className="item-label">
                    {item.type == 1 ? '【优秀班长】' + item.month + '月训练营' : ''}
                    {item.type == 2 ? '【优秀组长】' + item.month + '月训练营' : ''}
                    {item.type == 3 ? '【优秀学员】' + item.month + '月训练营' : ''}
                    {item.type == 4 ? '【优秀团队】' + item.month + '月训练营' : ''}
                    {item.type == 5 ? '【结课证书】' + item.month + '月训练营' : ''}
                    {item.type == 6 ? '【优秀助教】' + item.month + '月训练营' : ''}
                  </div>
                  <div className="item-content">

                  </div>
                </MarkBlock>
              )
            }) }
        </div>
      )
    }

    const renderProblemCollection = (problemCollections) => {
      return (
        problemCollections.map((problem, index) => (
          <div key={index} className="item"
               onClick={() => this.context.router.push(`/rise/static/plan/view?id=${problem.id}&show=true`)}>
            <div className="item-label">
              {problem.problem}
            </div>
            <div className="item-content"/>
          </div>
        ))
      )
    }

    return (
      <div className="problem-gallery">
        <MarkBlock module={'打点'} func={'我的课程页面'} action={'点击总积分按钮'} className="problem-galley-header"
                   onClick={() => this.goPointTip()}
                   style={{ marginBottom: '10px', borderBottom: 'none' }}>
          <div className="header-label" style={{ float: 'left' }}>
            总积分
          </div>
          <div className="header-content arrow" style={{ float: 'right', marginRight: '20px' }}>
            {point}{'积分'}
          </div>
        </MarkBlock>

        <div className="problem-galley-container">
          {riseCertificates.length > 0 &&
            <div className="galley-module">
              <div className="galley-module-header">
                <div className="label">
                  训练营证书
                </div>
              </div>
              {renderCertificateList(riseCertificates)}
            </div>
          }
          {problemCollections.length > 0 &&
            <div className="galley-module">
              <div className="galley-module-header">
                <div className="label">
                  已收藏
                </div>
              </div>
              <div className="galley-module-content">
                {renderProblemCollection(problemCollections)}
              </div>
            </div>
          }
          {runningPlans.length > 0 &&
            <div className="galley-module">
              <div className="galley-module-header">
                <div className="label">
                  进行中
                </div>
              </div>
              {renderGalleyList(runningPlans)}
            </div>
          }

          <div className="galley-module">
            <div className="galley-module-header">
              <div className="label">
                已完成
              </div>
            </div>
            {renderGalleyList(donePlans)}
          </div>
        </div>
        <div className="padding-footer"/>
      </div>
    )
  }
}
