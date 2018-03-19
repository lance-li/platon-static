import * as React from 'react'
import './NickName.less'
import { mark, ppost } from '../../../../utils/request'
import { MarkBlock } from '../../../../components/markblock/MarkBlock'

/**
 * 修改昵称页面
 */
export default class NickName extends React.Component {

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
      action: '修改昵称页面'
    })
    const { hiddenTab = () => {} } = this.props
    hiddenTab()
    this.setState({ nickname: window.ENV.userName })
  }

  componentWillUnmount() {
    const { showTab = () => {} } = this.props
    showTab()
  }

  handleUpdateNickname() {
    ppost(`/rise/customer/profile/nickname/update`, { 'nickname': this.refs.text.value }).then(res => {
      if(res.code === 200) {
        window.ENV.userName = this.refs.text.value
        this.context.router.goBack()
      }
    })
  }

  render() {
    const { nickname = '' } = this.state

    return (
      <div className="nickname-modify-component">
        <div className="nickname-edit">
          <input className="text" type="text" ref="text" defaultValue={nickname} autoFocus={true}/>
        </div>
        <MarkBlock module={'打点'} func={'修改昵称页面'} action={'点击修改昵称按钮'} className="nickname-submit">
          <span onClick={() => this.handleUpdateNickname()}>提交</span>
        </MarkBlock>
      </div>
    )
  }

}
