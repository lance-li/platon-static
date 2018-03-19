import * as React from 'react'
import './Main.less'
import { connect } from 'react-redux'
import { getCertificate } from './async'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { changeTitle } from 'utils/helpers'
import AssetImg from '../../../components/AssetImg'

@connect(state => state)
export default class Main extends React.Component<any, any> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    changeTitle('圈外证书')
    const { dispatch, location } = this.props
    const { certificateNo } = location.query
    dispatch(startLoad())
    getCertificate(certificateNo).then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        //用户没有填姓名时，跳转填写姓名
        if(!res.msg.name) {
          this.context.router.push({ pathname: '/rise/static/customer/certificate/profile', query: { certificateNo } })
        } else {
          dispatch(startLoad())
          this.setState(res.msg, () => {
            setTimeout(() => {
              dispatch(endLoad())
            }, 1000)
          })
        }
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch((err) => {
      dispatch(alertMsg(err))
    })
  }

  componentDidMount() {
    const { hiddenTab } = this.props
    hiddenTab()
  }

  render() {
    const { imageUrl } = this.state
    return (
      <div className="certificate-container">
        <span className="tips">长按下方图片可保存至相册</span>
        <AssetImg
          className="certificate-image" url={imageUrl} ref="targetImage"
          width={`${375 / 667 * (window.innerHeight - 80) / window.innerWidth * 100}%`}/>
      </div>
    )
  }
}
