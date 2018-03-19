import * as React from 'react'
import { connect } from 'react-redux'
import './Personal.less'
import * as _ from 'lodash'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import DropDownList from '../components/DropDownList'
import { loadUserProfileInfo, submitProfileInfo, getRegions } from './async'
import { ButtonArea, Button } from 'react-weui'
import { mark } from '../../../utils/request'
import { MarkBlock } from '../../../components/markblock/MarkBlock'

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
  { id: '10', value: '学术/科研/院校' },
  { id: '11', value: '医药/医疗设备' },
  { id: '12', value: '通信/电子' },
  { id: '13', value: '计算机硬件/半导体' },
  { id: '14', value: '能源/化工' },
  { id: '15', value: '物流' },
  { id: '16', value: '政府/公共事业/非营利' },
  { id: '17', value: '其他' }
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

/**
 * 生成证书页面
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
      realName: null,
      ready: false
    }
    this.btnWidth = 690 / 750 * window.innerWidth
  }

  componentWillMount() {
    mark({
      module: '打点',
      function: '生成圈外证书',
      action: '加载生成证书页面'
    })
    const { dispatch, location } = this.props
    const { certificateNo } = location.query
    dispatch(startLoad())
    loadUserProfileInfo().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState(_.merge({}, { ready: true }, res.msg))
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => {
      dispatch(endLoad())
      dispatch(alertMsg(err))
    })

    getRegions().then(res => {
      if(res.code === 200) {
        dispatch(set('region', res.msg))
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => dispatch(alertMsg(err)))
  }

  componentDidMount() {
    const { hiddenTab } = this.props
    hiddenTab()
  }

  changeValue(path, value) {
    this.setState(_.set(_.merge({}, this.state), path, value))
  }

  bind(field, getValue) {
    return {
      value: this.state[field],
      onChange: (e) => {
        this.changeValue(field, getValue ? getValue(e) : e)
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
    })
  }

  onChoiceIndustry(industry) {
    this.setState({ industry: industry.value })
  }

  onChoiceWorkingLife(workingLife) {
    this.setState({ workingLife: workingLife.value })
  }

  submitProfile() {
    const { dispatch, location } = this.props
    const { city, province, industry, workingLife, realName } = this.state
    const { certificateNo } = location.query
    const functionValue = _.get(this.state, 'function')

    if(city && province && industry && workingLife && functionValue && realName) {
      dispatch(startLoad())
      submitProfileInfo({
        city: city,
        province: province,
        industry: industry,
        workingLife: workingLife,
        function: functionValue,
        realName: realName ? realName.trim() : ''
      }).then(res => {
        dispatch(endLoad())
        if(res.code === 200) {
          this.context.router.push({
            pathname: '/rise/static/customer/certificate',
            query: { certificateNo }
          })
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

  render() {
    const { region } = this.props
    const provinceList = _.get(region, 'provinceList')
    const cityList = _.get(region, 'cityList')
    const { city, province, cityId, provinceId, industry, workingLife, ready } = this.state
    const functionValue = _.get(this.state, 'function')
    const realName = _.get(this.state, 'realName')

    const renderName = () => {
      return (
        <div className={realName ? 'select-wrapper-has-no-cut' : 'select-wrapper'}>
          <input placeholder="请填写" type="text" {...this.bind('realName', this.getInputValue)}/>
        </div>
      )
    }
    const renderFunction = () => {
      return (
        <div className={functionValue ? 'select-wrapper-has-no-cut' : 'select-wrapper'}>
          <input placeholder="请填写" type="text" {...this.bind('function', this.getInputValue)}/>
        </div>
      )
    }

    const renderRegion = () => {
      const userData = [{ value: province, id: provinceId }, { value: city, id: cityId }]
      return (
        <div className={provinceId && cityId ? 'select-wrapper-has' : 'select-wrapper'}>
          <DropDownList level={2} data={[provinceList, cityList]} userData={userData[1].id ? userData : null}
                        onChoice={(one, two) => this.onChoiceRegion(one, two)}/>
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
        <div className={industry ? 'select-wrapper-has' : 'select-wrapper'}>
          <DropDownList level={1} data={[industryList]} userData={myIndustry.id ? [myIndustry] : null}
                        onChoice={(one) => this.onChoiceIndustry(one)}/>
        </div>
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
        <div className={workingLife ? 'select-wrapper-has' : 'select-wrapper'}>
          <DropDownList level={1} data={[workingLifeList]} userData={myWorkingLife.id ? [myWorkingLife] : null}
                        onChoice={(one) => this.onChoiceWorkingLife(one)}/>
        </div>
      )
    }

    if(!ready) {
      return null
    }
    return (
      <div className="profile">
        <div className="profile-container">
          <div className="profile-item">
            <div className="item-label">
              真实姓名
            </div>
            <div className="item-content">
              {renderName()}
            </div>
          </div>
          <div className="profile-item">
            <div className="item-label">
              工作年限
            </div>
            <div className="item-content">
              {renderWorkingLife()}
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
          <div className="profile-item" style={{ marginBottom: '10px', borderBottom: 'none' }}>
            <div className="item-label">
              职业
            </div>
            <div className="item-content">
              {renderFunction()}
            </div>
          </div>
          <div className="profile-item" style={{ borderBottom: 'none' }}>
            <div className="item-label">
              省份/城市
            </div>
            <div className="item-content" id="region-select">
              {renderRegion()}
            </div>
          </div>
        </div>
        <div className="profile-bottom">
          <MarkBlock module={'打点'} func={'生成证书页面'} action={'点击生成证书'} className={`submit-btn`} style={{ width: `${this.btnWidth}px` }}
               onClick={this.submitProfile.bind(this)}>
            生成证书
          </MarkBlock>
        </div>
        <div className="padding-footer"></div>
      </div>
    )
  }
}


