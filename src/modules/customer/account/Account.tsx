import * as React from 'react'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { mark } from 'utils/request'
import { changeTitle, unScrollToBorder } from 'utils/helpers'
import './Account.less'
import { MarkBlock } from '../../../components/markblock/MarkBlock'
import { loadUserAccount } from '../async'

/**
 * 我的账户页面
 */
@connect(state => state)
export default class Rise extends React.Component<any, any> {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount() {
    mark({ module: '打点', function: '个人中心', action: '打开我的账户页面' })
    changeTitle('我的账户')
    const { dispatch } = this.props
    dispatch(startLoad())
    loadUserAccount().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg }, () => {
          unScrollToBorder('.coupon-box')
        })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => {
      dispatch(endLoad())
      dispatch(alertMsg(err + ''))
    })
  }

  handleClickGoMemberDesc() {
    const memberType = this.state.data.memberType
    switch(memberType) {
      case '专项课':
        window.location.href = 'https://shimo.im/doc/zPvwOCCxqygcof0B?r=L8QE82/'
        break
      default:
        this.context.router.push('/rise/static/customer/member')
        break
    }
  }

  goMobileCheck() {
    this.context.router.push('/rise/static/customer/mobile/check')
  }

  render() {
    const { data } = this.state
    const { riseId, memberType, mobile, nickName, memberId, coupons = [] } = data

    const renderCoupons = () => {
      if(coupons.length === 0) {
        return (
          <div>
            <div className="item">
              <div className="label">奖学金/优惠券</div>
              <div className="content-no-cut">暂无</div>
            </div>
          </div>
        )
      } else {
        return (
          <div>
            <div className="item ">奖学金/优惠券</div>
            <div className="coupon-box">
              {
                coupons.map((coupon, index) => {
                  let jxjSrc = 'https://static.iqycamp.com/images/fragment/person_coupon_jxj.png'
                  let yhqSrc = 'https://static.iqycamp.com/images/fragment/person_coupon_yhq.png'
                  let imgSrc = (coupon.description && coupon.description.indexOf('奖学金')) >= 0 ? jxjSrc : yhqSrc
                  return (
                    <div className="item" key={index}>
                      <img src={imgSrc} alt={coupon.description}
                           className="coupon-img" style={{ float: 'left' }}/>
                      <div className='label'>{coupon.description} ￥{coupon.amount} 元</div>
                      <div className='content-no-cut'>{coupon.expiredDateString}到期</div>
                    </div>
                  )
                })
              }
              <div style={{ height: 56 }}/>
            </div>
          </div>
        )
      }
    }

    return (
      <div className="account">
        <div className="item">
          <div className="label">昵称</div>
          <div className="content-no-cut">{nickName}</div>
        </div>
        <div className="item">
          <div className="label">圈外 ID</div>
          <div className="content-no-cut">{riseId}</div>
        </div>
        {
          memberId ?
            <div className="item">
              <div className="label">学号</div>
              <div className="content-no-cut">{memberId}</div>
            </div> : null
        }
        <MarkBlock module={'打点'} func={'我的账户'} action={'点击圈外会员'} className="item"
                   onClick={() => this.handleClickGoMemberDesc()}>
          <div className="label">圈外会员</div>
          <div className="content">
            {memberType ? memberType : '点击加入'}&nbsp;&nbsp;
          </div>
        </MarkBlock>
        <MarkBlock module={'打点'} func={'我的账户'} action={'修改手机号'} className="item item-margin"
             style={{ margin: '25px 0' }}
             onClick={() => this.goMobileCheck()}>
          <div className="label">
            {mobile ? '修改手机号' : '手机号'}
          </div>
          <div className='content'>
            {mobile ? <span>{mobile}</span> : <span style={{ color: '#ccc' }}>去绑定手机号&nbsp;&nbsp;</span>}
          </div>
        </MarkBlock>
        {/*{renderCoupons()}*/}
      </div>
    )
  }
}
