import * as React from 'react'
import './AnnualSummary.less'
import { connect } from 'react-redux'
import { startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { NextStepButton } from './components/NextStepButton'
import { TwoStepButton } from './components/TwoStepButton'
import { Step_Start } from './steps/Step_Start'
import { Step1_SchoolGate } from './steps/Step1_SchoolGate'
import { Step2_TeachingBuilding } from './steps/Step2_TeachingBuilding'
import { Step3_ActivityCenter } from './steps/Step3_ActivityCenter'
import { Step4_Library } from './steps/Step4_Library'
import { Step5_Auditorium } from './steps/Step5_Auditorium'
import { getPromotionUserInfo, receivePrizeCard } from './async'
import AssetImg from '../../../components/AssetImg'
import { mark } from '../../../utils/request'
import { configShare } from '../../helpers/JsConfig'

@connect(state => state)
export default class AnnualSummary extends React.Component {

  constructor() {
    super()
    this.state = {
      personStep: this.PERSON_STEPS.init,
      showShareTip: false,
      showPage: false
    }
  }

  PERSON_STEPS = {
    init: 'init',
    building1: 'building1',
    building2: 'building2',
    building3: 'building3',
    building4: 'building4',
    building5: 'building5',
    jumpBuilding5: 'jumpBuilding5',
    directBuilding5: 'directBuilding5'
  }

  async componentWillMount() {
    mark({ module: '打点', function: '年终回顾', action: '年终回顾流程页', memo: this.props.location.query.riseId })
    const { riseId } = this.props.location.query
    this.setState({ originRiseId: riseId })
    let userInfo = await getPromotionUserInfo(riseId)
    if(userInfo.code === 200) {
      let msg = userInfo.msg
      this.setState({
        riseId: msg.masterRiseId,
        nickName: msg.masterNickName,
        headImageUrl: msg.masterHeadImageUrl,
        isSelf: msg.currentRiseId === msg.masterRiseId,
        showPage: true
      }, () => {
        configShare(
          `回顾在圈外商学院的2017，我郑重向你发出这个邀请`,
          `https://${window.location.hostname}/rise/static/guest/annual/summary?riseId=${this.state.riseId}`,
          'https://static.iqycamp.com/images/share_link_icon.jpg?imageslim',
          '一份最有价值的新年礼')
        this.setState({ stepBox: this.loadCurrentBuilding() })
      })
    }
  }

  goLastStep() {
    this.setState({ personStep: this.PERSON_STEPS.directBuilding5 }, () => {
      this.setState({
        stepBox: this.loadCurrentBuilding()
      })
    })
  }

  handleNextStep(sleepTime = 2000) {
    this.setState({
      stepBox: <div></div>
    })
    let person = document.getElementById('person')
    let step = person.dataset.nextstep
    let nextStep = ''
    switch(step) {
      case this.PERSON_STEPS.init:
        nextStep = this.PERSON_STEPS.building1
        break
      case this.PERSON_STEPS.building1:
        nextStep = this.PERSON_STEPS.building2
        break
      case this.PERSON_STEPS.building2:
        nextStep = this.PERSON_STEPS.building3
        break
      case this.PERSON_STEPS.building3:
        if(this.state.isSelf) {
          nextStep = this.PERSON_STEPS.building4
        } else {
          nextStep = this.PERSON_STEPS.jumpBuilding5
        }
        break
      case this.PERSON_STEPS.building4:
        nextStep = this.PERSON_STEPS.building5
        break
      default:
        break
    }
    person.dataset.nextstep = nextStep
    this.setState({ personStep: nextStep }, () => {
      setTimeout(() => {
        this.setState({
          stepBox: this.loadCurrentBuilding()
        })
      }, sleepTime)
    })
  }

  loadCurrentBuilding() {
    const { personStep, isSelf } = this.state

    let result = []
    switch(personStep) {
      case this.PERSON_STEPS.init:
        result.push(<Step_Start getGlobalState={() => this.state}/>)
        if(isSelf) {
          result.push(<NextStepButton buttonText="点击开启" clickFunc={() => this.handleNextStep(1000)} noAnimation={true}
                                      style={{
                                        backgroundColor: '#f8aa08', color: '#fff', bottom: '20rem'
                                      }}/>)
        } else {
          result.push(<NextStepButton buttonText="点击开始" clickFunc={() => this.handleNextStep(1000)} noAnimation={true}
                                      style={{
                                        backgroundColor: '#f8aa08', color: '#fff', bottom: '20rem'
                                      }}/>)
        }
        return result
      case this.PERSON_STEPS.building1:
        result.push(<Step1_SchoolGate getGlobalState={() => this.state}/>)

        if(isSelf) {
          result.push(<NextStepButton buttonText="下一步" clickFunc={() => this.handleNextStep()}/>)
        } else {
          result.push(<TwoStepButton buttons={[{ buttonText: '领取邀请函', clickFunc: () => this.goLastStep() },
            { buttonText: '下一步', clickFunc: () => this.handleNextStep() }
          ]}/>)
        }
        break
      case this.PERSON_STEPS.building2:
        result.push(<Step2_TeachingBuilding getGlobalState={() => this.state}/>)
        if(isSelf) {
          result.push(<NextStepButton buttonText="下一步" clickFunc={() => this.handleNextStep()}/>)
        } else {
          result.push(<TwoStepButton buttons={[{ buttonText: '领取邀请函', clickFunc: () => this.goLastStep() },
            { buttonText: '下一步', clickFunc: () => this.handleNextStep() }
          ]}/>)
        }
        break
      case this.PERSON_STEPS.building3:
        result.push(<Step3_ActivityCenter getGlobalState={() => this.state}/>)
        if(isSelf) {
          result.push(<NextStepButton buttonText="下一步" clickFunc={() => this.handleNextStep(isSelf ? 2000 : 4000)}/>)
        } else {
          result.push(<TwoStepButton buttons={[{ buttonText: '领取邀请函', clickFunc: () => this.goLastStep() },
            { buttonText: '下一步', clickFunc: () => this.handleNextStep(isSelf ? 2000 : 4000) }
          ]}/>)
        }
        break
      case this.PERSON_STEPS.building4:
        result.push(<Step4_Library getGlobalState={() => this.state}/>)
        if(isSelf) {
          result.push(<NextStepButton buttonText="下一步" clickFunc={() => this.handleNextStep()}/>)
        } else {
          result.push(<TwoStepButton buttons={[{ buttonText: '领取邀请函', clickFunc: () => this.goLastStep() },
            { buttonText: '下一步', clickFunc: () => this.handleNextStep() }
          ]}/>)
        }
        break
      case this.PERSON_STEPS.building5:
        result.push(<Step5_Auditorium getGlobalState={() => this.state}/>)
        result.push(<NextStepButton buttonText="分享" clickFunc={() => this.configShareOption()}/>)
        break
      case this.PERSON_STEPS.jumpBuilding5:
        result.push(<Step5_Auditorium getGlobalState={() => this.state}
                                      receivePrizeCardFunc={(prizeCardNo) => this.handleClickReceivePrizeCard(prizeCardNo)}/>)
        break
      case this.PERSON_STEPS.directBuilding5:
        result.push(<Step5_Auditorium getGlobalState={() => this.state}
                                      receivePrizeCardFunc={(prizeCardNo) => this.handleClickReceivePrizeCard(prizeCardNo)}/>)
        break
      default:
        return
    }
    result.push(<div className="mask" id='mask'></div>)
    return result
  }

  configShareOption() {
    mark({ module: '打点', function: '年终回顾', action: '点击分享' })
    this.setState({
      showShareTip: true
    })
  }

  async handleClickReceivePrizeCard(prizeCardNo) {
    mark({ module: '打点', function: '年终回顾', action: '点击立即领取', memo: prizeCardNo })
    const { dispatch } = this.props
    let res = await receivePrizeCard(prizeCardNo)
    if(res.code === 200) {
      mark({ module: '打点', function: '年终回顾', action: '年终回顾礼品卡领取成功', memo: prizeCardNo })
      dispatch(alertMsg('领取成功'))
    } else if(res.code === 201) {
      document.getElementById('mask').style.zIndex = 20
      this.setState({
        showQrCode: true,
        qrCodeUrl: res.msg
      })
    } else {
      dispatch(alertMsg(res.msg))
    }
    return res
  }

  render() {
    const {
      personStep = this.PERSON_STEPS.init,
      stepBox = <div></div>,
      headImageUrl = '',
      showQrCode = false,
      qrCodeUrl = 'https://static.iqycamp.com/images/serverQrCode.jpg?imageslim',
      showShareTip,
      showPage
    } = this.state

    if(!showPage) return <div></div>

    return (
      <div className="annual-summary-container">
        <div className="move-block">
          <div id="person" className={`person step-${personStep}`}
               data-nextstep={this.PERSON_STEPS.init}>
            <div className="headimage"
                 style={{ background: `url(${headImageUrl}) no-repeat` }}>
            </div>
          </div>
          {
            showShareTip ?
              <div className="mask" id='mask'></div> :
              stepBox
          }
          {/*<Step1_SchoolGate getGlobalState={() => this.state}/>*/}
          {/*<Step2_ActivityCenter getGlobalState={() => this.state}/>*/}
          {/*<Step3_TeachingBuilding getGlobalState={() => this.state}/>*/}
          {/*<Step4_Library getGlobalState={() => this.state}/>*/}
          {/*<Step5_Auditorium getGlobalState={() => this.state}/>*/}
          {/*<div className="mask" id='mask'></div>*/}
          {
            showQrCode &&
            <div className="qrcode-box"
                 onClick={() => {
                   document.getElementById('mask').style.zIndex = 5
                 }}>
              <AssetImg className="qrcode" url={qrCodeUrl}/>
            </div>
          }
          {
            showShareTip &&
            <AssetImg className="annual-share" url="https://static.iqycamp.com/images/annual_share.png"/>
          }
        </div>
      </div>
    )
  }

}
