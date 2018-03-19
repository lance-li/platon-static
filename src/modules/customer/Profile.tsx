import * as React from 'react'
import { connect } from 'react-redux'
import './Profile.less'
import * as _ from 'lodash'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import DropDownList from './components/DropDownList'
import WorkStep from '../../components/WorkStep'
import { pget, ppost, mark } from 'utils/request'
import { loadUserProfileInfo } from './async'
import { changeTitle } from 'utils/helpers'
import { MarkBlock } from '../../components/markblock/MarkBlock'

const industryList = [
  { id: '1', value: '互联网/电商' },
  { id: '2', value: '软件/IT服务' },
  { id: '3', value: '咨询' },
  { id: '4', value: '人力资源' },
  { id: '5', value: '法律' },
  { id: '6', value: '快消品' },
  { id: '7', value: '银行/证券/保险' },
  { id: '8', value: '机械/重工' },
  { id: '9', value: '房地产' },
  { id: '10', value: '教育/学术/科研/院校' },
  { id: '11', value: '医药/医疗设备' },
  { id: '12', value: '通信/电子' },
  { id: '13', value: '计算机硬件/半导体' },
  { id: '14', value: '能源/化工' },
  { id: '15', value: '物流' },
  { id: '16', value: '政府/公共事业/非营利' },
  { id: '17', value: '学生' },
  { id: '18', value: '其他' }
]

const workingLifeList = [
  { id: '2', value: '0' },
  { id: '3', value: '0~1年' },
  { id: '4', value: '1~3年' },
  { id: '5', value: '3~5年' },
  { id: '6', value: '5~7年' },
  { id: '7', value: '7~10年' },
  { id: '8', value: '10~15年' },
  { id: '9', value: '15年以上' }
]

const marryList = [
  { id: '0', value: '已婚' },
  { id: '1', value: '未婚有对象' },
  { id: '2', value: '单身' }
]

/**
 * 个人信息修改页
 */
@connect(state => state)
export default class Profile extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      function: null,
      industry: null,
      workingLife: null,
      city: null,
      province: null,
      isFull: false,
      workingTime: null,
      realName: null,
      address: null,
      receiver: null,
      married: null
    }
    this.btnWidth = 690 / 750 * window.innerWidth
  }

  componentWillMount() {
    mark({ module: '打点', function: '个人中心', action: '打开我的信息页面' })
    changeTitle('个人信息')
    const { dispatch, region, location } = this.props
    const { goRise, goCamp } = location.query
    dispatch(startLoad())
    loadUserProfileInfo().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        let defaultIsFull = goRise ? false : res.msg.isFull
        this.setState(_.merge({}, { defaultIsFull: defaultIsFull }, res.msg), () => {
          if(this.checkIsFull() && goRise ) {
            if(goCamp){
              // 加载的时候就填写过，然后是goRise，则去绑定电话页面
              this.context.router.push({
                pathname: '/rise/static/customer/mobile/check',
                query: { goRise: true, goCamp:true }
              })
            }else{
              this.context.router.push({
                pathname: '/rise/static/customer/mobile/check',
                query: { goRise: true }
              })
            }
          }
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => {
      dispatch(endLoad())
      dispatch(alertMsg(err + ''))
    })

    if(!region) {
      pget('/rise/customer/region').then(res => {
        if(res.code === 200) {
          dispatch(set('region', res.msg))
        } else {
          dispatch(alertMsg(res.msg))
        }
      }).catch(err => dispatch(alertMsg(err.msg)))
    }

    // workingTime
    let workingYearList = []
    for(let i = 1960; i <= 2017; i++) {
      workingYearList.push({ id: '' + i, value: '' + i })
    }
    this.setState({ workingYearList: workingYearList })
  }

  componentDidMount() {
    const { location, hiddenTab } = this.props
    const { goRise } = location.query
    // if(goRise){
    hiddenTab()
    // }
  }

  changeValue(path, value, callback) {
    this.setState(_.set(_.merge({}, this.state), path, value), () => {
      if(callback) {
        callback()
      }
    })
  }

  bind(field, getValue) {
    return {
      value: this.state[field],
      onChange: (e) => {
        this.changeValue(field, getValue ? getValue(e) : e, () => {
          this.checkIsFull()
        })
      }
    }

  }

  getInputValue(e) {
    return e.currentTarget.value
  }

  onChoiceRegion(provinceRegion, cityRegion) {
    this.setState({
      province: provinceRegion.value,
      provinceId: provinceRegion.id,
      city: cityRegion.value,
      cityId: cityRegion.id
    }, () => {
      this.checkIsFull()
    })
  }

  onChoiceIndustry(industry) {
    this.setState({ industry: industry.value }, () => {
      this.checkIsFull()
    })
  }

  onChoiceWorkingLife(workingLife) {
    this.setState({ workingLife: workingLife.value }, () => {
      this.checkIsFull()
    })
  }

  onChoiceWorkingYear(workingYear) {
    this.setState({ workingYear: workingYear.value }, () => {
      this.checkIsFull()
    })
  }

  onChoiceMarry(marry) {
    this.setState({ married: marry.value })
  }

  checkFull() {
    const { dispatch, location } = this.props
    const functionValue = _.get(this.state, 'function')
    const { goRise, goCamp } = location.query
    const { city, province, industry, workingYear, bindMobile, realName, address, receiver } = this.state
    if(goCamp) {
      if(city && province && industry && workingYear && functionValue && realName) {
        return true;
      }
    }else{
      if(city && province && industry && workingYear && functionValue && realName && address && receiver) {
        return true
      }
    }
    return false
  }

  submitProfile() {
    const { dispatch, location } = this.props
    const { city, province, industry, workingYear, bindMobile, realName, address, receiver, married } = this.state
    const functionValue = _.get(this.state, 'function')
    const { goRise, goCamp } = location.query
    if(this.checkFull()) {
      let param = {
        city: city,
        province: province,
        industry: industry,
        workingYear: workingYear,
        function: functionValue
      }

      _.merge(param, { realName: realName, address: address, receiver: receiver, married })
      dispatch(startLoad())
      ppost('/rise/customer/profile', param).then(res => {
        dispatch(endLoad())
        if(res.code === 200) {
          //从付款页跳转过来的，填完个人信息后引导去学习页面
          if(goCamp) {
            this.context.router.push({
              pathname: '/rise/static/customer/mobile/check',
              query: { goRise: true, goCamp:true }
            })
          } else if(goRise){
            this.context.router.push({
              pathname: '/rise/static/customer/mobile/check',
              query: { goRise: true }
            })
          } else {
            dispatch(alertMsg('提交成功'))
            this.setState({ isFull: true })
          }
        } else {
          dispatch(alertMsg(res.msg))
        }
      }).catch(err => {
        dispatch(endLoad())
        dispatch(alertMsg(err + ''))
      })
    } else {
      dispatch(alertMsg('请全部填写后提交'))
    }
  }

  checkIsFull() {
    let isFull = this.checkFull()
    this.setState({ isFull: isFull })
    return isFull
  }

  render() {
    const { region, location } = this.props
    const { goRise, goCamp } = location.query

    const provinceList = _.get(region, 'provinceList')
    const cityList = _.get(region, 'cityList')
    const { city, province, cityId, provinceId, industry, workingLife, isFull, bindMobile, defaultIsFull, workingYearList, workingYear, realName, address, receiver, married } = this.state
    const functionValue = _.get(this.state, 'function')
    const renderFunction = () => {
      return (
        <div className={functionValue ? 'select-wrapper-has-no-cut' : 'select-wrapper'}>
          <input id="functionInput" placeholder="请填写" type="text" {...this.bind('function', this.getInputValue)}/>
        </div>
      )
    }

    const renderRegion = () => {
      const userData = [{ value: province, id: provinceId }, { value: city, id: cityId }]
      return (
        <MarkBlock module={'打点'} func={'个人信息页'} action={'选择居住地点'}
                   className={provinceId && cityId ? 'select-wrapper-has' : 'select-wrapper'}>
          <DropDownList level={2} data={[provinceList, cityList]} userData={userData[1].id ? userData : null}
                        placeholder="以便参加当地校友会"
                        onChoice={(one, two) => this.onChoiceRegion(one, two)}/>
        </MarkBlock>
      )
    }

    const renderRealName = () => {
      return (
        <div className={realName ? 'select-wrapper-has-no-cut' : 'select-wrapper'}>
          <input id="realName" placeholder="用于颁发毕业证书" type="text" {...this.bind('realName', this.getInputValue)}/>
        </div>
      )
    }

    const renderReceiver = () => {
      return (
        <div className={receiver ? 'select-wrapper-has-no-cut' : 'select-wrapper'}>
          <input id="realName" placeholder="请填写" type="text" {...this.bind('receiver', this.getInputValue)}/>
        </div>
      )
    }

    const renderIndustry = () => {
      let myIndustry = { value: industry }
      for(let item in industryList) {
        if(_.isEqual(industryList[item].value, industry)) {
          myIndustry.id = industryList[item].id
          break
        }
      }

      return (
        <MarkBlock module={'打点'} func={'个人信息页'} action={'选择行业'}
                   className={industry ? 'select-wrapper-has' : 'select-wrapper-choice'}>
          <DropDownList level={1} data={[industryList]} userData={myIndustry.id ? [myIndustry] : null} placeholder="请选择"
                        onChoice={(one) => this.onChoiceIndustry(one)}/>
        </MarkBlock>
      )
    }

    const renderWorkingLife = () => {
      let myWorkingLife = { value: workingLife }
      for(let item in workingLifeList) {
        if(_.isEqual(workingLifeList[item].value, workingLife)) {
          myWorkingLife.id = workingLifeList[item].id
          break
        }
      }

      return (
        <div className={workingLife ? 'select-wrapper-has' : 'select-wrapper-choice'}>
          <DropDownList level={1} data={[workingLifeList]} userData={myWorkingLife.id ? [myWorkingLife] : null}
                        placeholder="请选择"
                        onChoice={(one) => this.onChoiceWorkingLife(one)}/>
        </div>
      )
    }

    const renderMarried = () => {
      let myMarried = { value: married }
      for(let item in marryList) {
        if(_.isEqual(marryList[item].value, married)) {
          myMarried.id = marryList[item].id
          break
        }
      }

      return (
        <MarkBlock module={'打点'} func={'个人信息页'} action={'选择感情状态'}
                   className={married ? 'select-wrapper-has' : 'select-wrapper-choice'}>
          <DropDownList level={1} data={[marryList]} userData={myMarried.id ? [myMarried] : null}
                        placeholder="以便参加脱单群等活动"
                        onChoice={(one) => this.onChoiceMarry(one)}/>
        </MarkBlock>
      )
    }

    const renderWorkingYear = () => {
      let myWorkingLife = { value: workingYear }
      for(let item in workingYearList) {
        if(_.isEqual(workingYearList[item].value, workingYear)) {
          myWorkingLife.id = workingYearList[item].id
          break
        }
      }

      return (
        <MarkBlock module={'打点'} func={'个人信息页'} action={'选择工作年份'}
                   className={workingYear ? 'select-wrapper-has' : 'select-wrapper-choice'}>
          <DropDownList level={1} data={[workingYearList]} userData={myWorkingLife.id ? [myWorkingLife] : null}
                        defaultData={[{ id: '2000', value: '2000' }]}
                        onChoice={(one) => this.onChoiceWorkingYear(one)}/>
        </MarkBlock>
      )
    }

    const renderProfileHeader = () => {
      if(isFull) {
        return (
          <div className="profile-header-tip" style={{ color: '#f7a466', backgroundColor: '#FFFFFF' }}>
            个人资料完整，30积分get！
          </div>
        )
      } else {
        return (
          <div className="profile-header-tip" style={{ color: '#FFFFFF', backgroundColor: '#f9b685' }}>
            完整的个人资料=30积分
          </div>
        )
      }
    }
    return (
      <div className="profile">
        {goRise ? (
          <div className="go-rise">
            <WorkStep
              works={[{ text: '填写信息', done: !!defaultIsFull, cur: true },
                { text: '绑定手机', done: !!bindMobile }, { text: '去上课', done: false }]}/>
            <div className="guide">
              { goCamp ?
              <div className="first-guide">填写工作和地址信息<br/>才能加入校友会！</div>
                : <div className="first-guide">填写工作和地址信息<br/>才能加入校友会，收到入学礼包！</div> }
              <div className="second-guide">数据仅用于提升学习服务，圈外会严格保密。</div>
            </div>
          </div>
        ) : (
          <div className="profile-header">
            {renderProfileHeader()}
          </div>
        )}
        <div className="profile-container">
          <div className="profile-item">
            <div className="item-label">
              首次参加工作年份
            </div>
            <div className="item-content">
              {renderWorkingYear()}
            </div>
          </div>
          <div className="profile-item">
            <div className="item-label">
              行业
            </div>
            <div className="item-content">
              {renderIndustry()}
            </div>
          </div>
          <div className="profile-item" style={{ marginBottom: '1px', borderBottom: 'none' }}>
            <div className="item-label">
              职业
            </div>
            <div className="item-content">
              {renderFunction()}
            </div>
          </div>

          <div className="profile-item" style={{ marginBottom: '1px', borderBottom: 'none' }}>
            <div className="item-label">
              居住地点
            </div>
            <div className="item-content" id="region-select">
              {renderRegion()}
            </div>
          </div>

          <div className="profile-item" style={{ marginBottom: '1px', borderBottom: 'none' }}>
            <div className="item-label">
              真实姓名
            </div>
            <div className="item-content">
              {renderRealName()}
            </div>
          </div>

          <div className="profile-item" style={{ marginBottom: '10px', borderBottom: 'none' }}>
            <div className="item-label">
              感情状态（选填）
            </div>
            <div className="item-content">
              {renderMarried()}
            </div>
          </div>

          { !goCamp &&
          <div className="profile-item" style={{ marginTop: '1px', borderBottom: 'none', height: '80px' }}>
            <div className="address-tips">收件地址</div>
            <textarea className="address" placeholder="商学院学员入学后，礼包会寄送到该地址（限大陆，海外用户请填写国内住址信息）" value={address}
                      onChange={(e) => this.setState({ address: e.currentTarget.value }, () => {
                        this.checkIsFull()
                      })}
            />
          </div> }

          { !goCamp &&
          <div className="profile-item" style={{ marginTop: '1px', borderBottom: 'none' }}>
            <div className="item-label">
              收件人
            </div>
            <div className="item-content">
              {renderReceiver()}
            </div>
          </div> }

        </div>
        <div className="profile-bottom">
          <MarkBlock module={'打点'} func={'个人信息页'} action={'提交个人信息修改'}
                     className={`submit-btn ${isFull ? '' : 'disabled'}`} style={{ width: `${this.btnWidth}px` }}
                     onClick={this.submitProfile.bind(this)}>
            {goRise ? `下一步` : `完成`}
          </MarkBlock>
        </div>
      </div>
    )
  }
}
