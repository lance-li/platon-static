import * as React from 'react'
import './PlanList.less'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from '../../redux/actions'
import { loadPlanList, createCampPlan, openAudition, unlockCampPlan } from './async'
import AssetImg from '../../components/AssetImg'
import { changeTitle } from '../../utils/helpers'
import { ToolBar } from '../base/ToolBar'
import Swiper from 'swiper'
import Banner from '../../components/Banner'
import { Dialog } from 'react-weui'
import * as _ from 'lodash'
import { MarkBlock } from '../../components/markblock/MarkBlock'
import { mark } from 'utils/request'

const {Alert} = Dialog

/**
 * rise_icon_hr 左侧较宽 TODO
 */
@connect(state => state)
export default class PlanList extends React.Component<any, any> {
  constructor () {
    super()
    this.state = {
      riseMember: 1,
      showPage: false,
      auditions: []
    }
    this.picWidth = (window.innerWidth - 15 - 10 - 10) / 2.5
    this.picHeight = (80 / 130) * this.picWidth
    this.runPicWidth = (window.innerWidth / (750 / 270)) > 135 ? 135 : (window.innerWidth / (750 / 270))
    this.runTextWidth = (window.innerWidth - 30 - this.runPicWidth - 5)
    this.completedRightTextWidth = 45
    let gup = 0
    if (window.innerWidth > 350) {
      gup = 30
    }
    this.completedLeftTextWidth = window.innerWidth - 56 - 84 - 8 - gup - 15 - 45
    changeTitle('圈外同学')
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount () {
    mark({
      module: '打点',
      function: '学习',
      action: '打开学习页面',
      memo: window.ENV.osName
    })

    const {dispatch, location} = this.props
    dispatch(startLoad())

    loadPlanList().then(res => {
      dispatch(endLoad())
      if (res.code === 200) {
        const {runningPlans = [], riseMember, recommendations = [], currentCampPlans = [], auditions = []} = res.msg

        let showEmptyPage = false
        if (!runningPlans || runningPlans.length === 0) {
          showEmptyPage = true
        }
        this.setState({
          planList: res.msg,
          showEmptyPage: showEmptyPage,
          riseMember,
          currentCampPlans: currentCampPlans,
          recommendations: recommendations,
          auditions: auditions,
          showPage: true,
          campBanner: res.msg.campBanner
        }, () => {
          var swiper = new Swiper('#problem-recommendation', {
            scrollbar: '#problem-recommendation-bar',
            scrollbarHide: true,
            slidesPerView: 'auto',
            centeredSlides: false,
            spaceBetween: 0,
            grabCursor: true
          })
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(ex => {
      dispatch(endLoad())
      dispatch(alertMsg(ex))
    })
  }

  handleClickPlan (plan) {
    const {learnable, startDate} = plan
    const {dispatch} = this.props
    if (learnable) {
      this.context.router.push({
        pathname: '/rise/static/plan/study',
        query: {planId: plan.planId}
      })
    } else {
      dispatch(alertMsg(`专项课将于${startDate}统一开营\n在当天开始学习哦！`))
    }
  }

  handleClickAuditionPlan (plan) {
    const {planId, errMsg} = plan
    const {dispatch} = this.props
    // 如果 planId 为 null，代表当前课程未开，点击弹窗提醒
    if (errMsg) {
      dispatch(alertMsg(errMsg))
      return
    }
    if (planId) {
      this.context.router.push(`/rise/static/plan/study?planId=${planId}`)
    } else {
      this.setState({
        dialogButtons: [
          {
            label: '取消',
            onClick: () => {
              this.setState({dialogShow: false, dialogButtons: [], dialogContent: ''})
            }
          },
          {
            label: '确认',
            onClick: () => {
              dispatch(startLoad())
              this.setState({dialogShow: false})
              openAudition().then(res => {
                dispatch(endLoad())
                if (res.code === 200) {
                  this.context.router.push(`/rise/static/plan/study?planId=${res.msg}`)
                } else {
                  dispatch(alertMsg(res.msg))
                }
              }).catch(e => {
                dispatch(alertMsg(e))
              })
            }
          }
        ],
        dialogShow: true,
        dialogContent: '试听课开启后，学习期限为30天。期间完成学习即可永久查看内容。确认开启吗？'
      })
    }
  }

  handleClickCampPlan (planId, problemId) {
    const {dispatch} = this.props
    if (planId === null) {
      // 如果 planId 为 null，代表当前课程未开，点击弹窗提醒
      this.setState({
        dialogButtons: [
          {
            label: '取消',
            onClick: () => {
              this.setState({dialogShow: false, dialogButtons: [], dialogContent: ''})
            }
          },
          {
            label: '确认',
            onClick: () => {
              dispatch(startLoad())
              this.setState({dialogShow: false})
              createCampPlan(problemId).then(res => {
                dispatch(endLoad())
                if (res.code === 200) {
                  this.context.router.push(`/rise/static/plan/study?planId=${res.msg}`)
                } else {
                  dispatch(alertMsg(res.msg))
                }
              }).catch(e => {
                dispatch(alertMsg(e))
              })
            }
          }
        ],
        dialogShow: true,
        dialogContent: '课程开启后，学习期限为30天。期间完成学习即可永久查看内容。确认开启吗？'
      })
    } else {
      // 如果 planId 不为 null，则当前课程正在学习当中，点击进入学习页面开始学习
      unlockCampPlan(planId).then(res => {
        if (res.code === 200) {
          this.context.router.push(`/rise/static/plan/study?planId=${planId}`)
        } else {
          dispatch(alertMsg(res.msg))
        }
      }).catch(e => {
        dispatch(alertMsg(e))
      })
    }
  }

  handleClickProblemChoose () {
    this.context.router.push({
      pathname: '/rise/static/problem/explore'
    })
  }

  handleClickRecommend (problem) {
    this.context.router.push({pathname: '/rise/static/plan/view', query: {id: problem.id}})
  }

  handleClickMoreProblem () {
    this.context.router.push({
      pathname: '/rise/static/problem/explore'
    })
  }

  handleClickBanner (banner) {
    let url = banner.linkUrl
    if (url.indexOf('https') >= 0) {
      window.location.href = url
    } else {
      this.context.router.push(url)
    }
  }

  render () {
    const {planList = {}, showEmptyPage, riseMember, showPage, currentCampPlans = [], recommendations = [], auditions} = this.state
    const {location} = this.props
    const {completedPlans, runningPlans = []} = planList
    const renderAuditions = () => {
      // if(riseMember !== 1) return
      if (_.isEmpty(auditions)) return
      return (
        <div className="problem-camp">
          <div className="camp-header">
            <span className="header-title">试听课</span>
          </div>
          {
            auditions.map((item, index) => {
              return (
                <MarkBlock module={'打点'} func={'学习'} action={'点击试听课'} className="problem-block" key={index}
                           onClick={() => {
                             this.handleClickAuditionPlan(item)
                           }}>
                  <div className="problem-item" style={{padding: index === 0 ? '18px 15px 20px' : '20px 15px'}}>
                    <div className="problem-item-pic">
                      <div className={`problem-item-backcolor catalog${item.problem.catalogId}`}/>
                      <div className={`problem-item-backimg catalog${item.problem.catalogId}`}/>
                      <div className="problem-item-subCatalog">{item.problem.abbreviation}</div>
                    </div>
                    <div className="problem-item-text">
                      <div className="problem-item-text-title">
                        {item.name}
                      </div>
                      {
                        item.planId ? <div className="problem-item-text-done">
                          已完成：{`${item.completeSeries}/${item.totalSeries}节`}
                        </div> : null
                      }
                      {item.planId ? renderDeadline(item.deadline) : null}
                      {
                        item.planId ? <div className={`running-problem-button`}>去上课</div> :
                          <div className={`running-problem-button`}>{item.errMsg ? '即将开课' : '开课'}</div>
                      }
                    </div>
                  </div>
                </MarkBlock>
              )
            })
          }
        </div>
      )

    }
    const renderCampProblems = () => {
      if (riseMember !== 1) return
      return (
        <div className="problem-camp">
          <div className="camp-header">
            <span className="header-title">本月专项课</span>
          </div>
          {
            currentCampPlans.map((item, index) => {
              return (
                <MarkBlock module={'打点'} func={'学习'} action={'点击训练营课程'} memo={window.ENV.osName}
                           className="problem-block" key={index}
                           onClick={() => {
                             this.handleClickCampPlan(item.planId, item.problemId)
                           }}>
                  <div className="problem-item" style={{padding: index === 0 ? '18px 15px 20px' : '20px 15px'}}>
                    <div className="problem-item-pic">
                      <div className={`problem-item-backcolor catalog${item.problem.catalogId}`}/>
                      <div className={`problem-item-backimg catalog${item.problem.catalogId}`}/>
                      <div className="problem-item-subCatalog">{item.problem.abbreviation}</div>
                    </div>
                    <div className="problem-item-text">
                      <div className="problem-item-text-title">
                        {item.name}
                      </div>
                      {
                        item.planId ? <div className="problem-item-text-done">
                          已完成：{`${item.completeSeries}/${item.totalSeries}节`}
                        </div> : null
                      }
                      {renderDeadline(item.deadline)}
                      {
                        item.planId ? <div className={`running-problem-button`}>去上课</div> :
                          <div className={`running-problem-button`}>开课</div>
                      }
                    </div>
                  </div>
                </MarkBlock>
              )
            })
          }
        </div>
      )
    }

    const renderDeadline = (deadline) => {
      if (!deadline || deadline < 0) {
        return null
      } else {
        return (
          <div className="problem-item-text-close">
            距关闭：{deadline}&nbsp;天
          </div>
        )
      }
    }

    const renderBanners = () => {
      const banners = [{
        'imageUrl': 'https://static.iqycamp.com/images/fragment/rise_member_banner_2.jpg?imageslim',
        'linkUrl': `https://${window.location.hostname}/pay/rise`
      }, {
        'imageUrl': this.state.campBanner,
        'linkUrl': `https://${window.location.hostname}/pay/camp`
      }]
      if (banners.length === 0 || riseMember === 1) return
      return (
        <Banner>
          {
            banners.map((banner, index) => {
              return (
                <MarkBlock module={'打点'} func={'学习'} action={'点击学习首页banner'} memo={banner.linkUrl}
                           className="banner-item swiper-slide" key={index}
                           onClick={() => this.handleClickBanner(banner)}>
                  <img style={{width: '100%'}}
                       src={banner.imageUrl}/>
                </MarkBlock>
              )
            })
          }
        </Banner>
      )
    }

    const renderDialog = () => {
      const {dialogShow = false, dialogButtons = [], dialogContent} = this.state

      return (
        <Alert
          show={dialogShow}
          buttons={dialogButtons}
        >
          {dialogContent}
        </Alert>
      )
    }

    return (
      <div className="plan-list-page" style={{minHeight: window.innerHeight + 30}}>
        {renderBanners()}
        <ToolBar/>
        {renderAuditions()}
        {renderCampProblems()}


        <div className="plp-running plp-block">
          <div className="p-r-header">
            <span className="p-r-h-title">进行中</span>
          </div>
          {showEmptyPage ? <div className="plp-empty-container">
            <div className="plp-empty-img">
              <AssetImg url="https://static.iqycamp.com/images/plan_empty.png" width={55} height={56}/>
            </div>
            <div className="plp-empty-text">
              <span>还没有学习中的课程哦</span>
            </div>
            <MarkBlock module={'打点'} func={'学习'} action={'点击选课'} memo={window.ENV.osName}
                       className="plp-empty-button"><span
              onClick={this.handleClickProblemChoose.bind(this)}>去选课</span>
            </MarkBlock>
          </div> : runningPlans.map((item, key) => {
            return (
              <div id={`problem-${item.planId}`}
                   className={`problem-block`}
                   key={key} onClick={() => this.handleClickPlan(item)}>
                <div className="problem-item" style={{padding: key === 0 ? '18px 15px 20px' : '20px 15px'}}>
                  <div className="problem-item-pic">
                    <div className={`problem-item-backcolor catalog${item.problem.catalogId}`}/>
                    <div className={`problem-item-backimg catalog${item.problem.catalogId}`}/>
                    <div className="problem-item-subCatalog">{item.problem.abbreviation}</div>
                  </div>
                  <div className="problem-item-text">
                    <div className="problem-item-text-title">
                      {item.name}
                    </div>
                    <div className="problem-item-text-done">
                      已完成：{`${item.completeSeries}/${item.totalSeries}节`}
                    </div>
                    {renderDeadline(item.deadline)}
                    <div className={`running-problem-button ${item.learnable ? '' : 'lock'}`}>
                      {item.learnable ? '去上课' : '即将开营'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {recommendations && recommendations.length !== 0 ? <div className="problem-recommendation ">
          <div className="recommendation-header">
            <span className="header-title">推荐学习</span>
          </div>
          <div className="swiper-container" id="problem-recommendation">
            <div className="swiper-wrapper">
              {recommendations ? recommendations.map((problem, index) => {
                return (
                  <MarkBlock module={'打点'} func={'学习'} action={'学习页面点击推荐课程'} memo={window.ENV.osName}
                             key={index} className="problem-item-show swiper-slide"
                             onClick={() => this.handleClickRecommend(problem)}>
                    <div className="img">
                      {problem.newProblem ?
                        <AssetImg url="https://static.iqycamp.com/images/fragment/problem_new_icon_03.png"
                                  style={{zIndex: 1, left: 0, top: 0}} size={25}/> : null
                      }
                      {problem.trial ?
                        <AssetImg url="https://static.iqycamp.com/images/fragment/problem_trial_icon_01.png"
                                  style={{zIndex: 1, left: 6, top: 6}} width={20}/> : null
                      }
                      <div className={`problem-item-backcolor catalog${problem.catalogId}`}/>
                      <div className={`problem-item-backimg catalog${problem.catalogId}`}/>
                      <div className="problem-item-subCatalog">{problem.abbreviation}</div>
                    </div>
                    <span>{problem.problem}</span>
                  </MarkBlock>
                )
              }) : null}
              <MarkBlock module={'打点'} func={'学习'} action={'学习页面点击发现更多'} memo={window.ENV.osName}
                         onClick={() => this.handleClickMoreProblem()}
                         className="swiper-slide problem-item-show found-more">
                <div className="tips-word">
                  点击发现更多
                </div>
                <div className="icon-next">
                  <AssetImg type="rise_icon_arrow_right" size="25px"/>
                </div>
              </MarkBlock>
            </div>
            <div className="swiper-scrollbar" id="problem-recommendation-bar"/>
          </div>
        </div> : null}

        <div className="plp-completed plp-block">
          <div className="p-c-header">
            <span className="p-c-h-title">已完成</span>
          </div>
          {completedPlans && completedPlans.length !== 0 ? <div className="p-c-container">
            <div className="p-c-c-right">
              {completedPlans.map((plan, key) => {
                return (
                  <div id={`problem-${plan.planId}`} className={`p-c-c-r-block ${key === 0 ? 'first' : ''}`}
                       onClick={() => this.handleClickPlan(plan)}>
                    <div className="p-c-b-text" style={{padding: key === 0 ? '18px 15px 20px' : '20px 15px'}}>
                      <div className="p-c-b-t-left">
                        <div className="p-c-b-t-l-title">
                          {plan.name}
                        </div>
                        <div className="p-c-b-t-l-close">
                          {plan.closeTime}
                        </div>
                      </div>
                      <div className="p-c-b-t-right">
                        {plan.point}分
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div> : null}
          {completedPlans && completedPlans.length === 0 ? <div className="complete-plan-empty">
            <AssetImg url='https://static.iqycamp.com/images/complete_plan_empty.png?imageslim'/>
          </div> : null}
        </div>
        <div className="padding-footer"/>
        {renderDialog()}
      </div>
    )
  }
}
