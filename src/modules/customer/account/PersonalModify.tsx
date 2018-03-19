import * as React from 'react'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import './PersonalModify.less'
import AssetImg from '../../../components/AssetImg'
import { mark } from '../../../utils/request'
import { MarkBlock } from '../../../components/markblock/MarkBlock'

/**
 * 个人中心头像昵称修改页
 */
@connect(state => state)
export default class PersonalModify extends React.Component {

  constructor() {
    super()
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    mark({
      module: '打点',
      function: '个人中心',
      action: '加载昵称头像修改页'
    })
  }

  handleClickGoNickNameModifyPage(nickName) {
    this.context.router.push({
      pathname: `/rise/static/customer/modify/nickname`
    })
  }

  handleClickGoHeadImgModifyPage(headImgUrl) {
    this.context.router.push({
      pathname: `/rise/static/customer/modify/headImg`,
      query: {
        headImgUrl: headImgUrl
      }
    })
  }

  render() {
    return (
      <div className="personal-modify-container">
        <div className="item">
          <div className="label">头像</div>
          <MarkBlock module={'打点'} func={'个人中心'} action={'点击修改头像'} className="content header-img"
                     onClick={() => this.handleClickGoHeadImgModifyPage(window.ENV.headImgUrl)}>
            <AssetImg ref="headImg" url={window.ENV.headImgUrl} alt=""/>
          </MarkBlock>
        </div>
        <MarkBlock module={'打点'} func={'个人中心'} action={'点击修改昵称'} className="item"
                   onClick={() => this.handleClickGoNickNameModifyPage(window.ENV.userName)}>
          <div className="label">昵称</div>
          <div className="content">{window.ENV.userName}</div>
        </MarkBlock>
      </div>
    )
  }

}
