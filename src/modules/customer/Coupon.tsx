import * as React from 'react'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'
import { mark } from 'utils/request'
import { changeTitle } from 'utils/helpers'
import './Coupon.less'
import { MarkBlock } from '../../../components/markblock/MarkBlock'
import { loadUserCoupon } from './async'

/**
 * 我的账户页面
 */
@connect(state => state)
export default class Coupon extends React.Component<any, any> {
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
    mark({ module: '打点', function: '个人中心', action: '打开优惠券页面' })
    changeTitle('我的优惠券')
    const { dispatch } = this.props
    dispatch(startLoad())
    loadUserCoupon().then(res => {
      dispatch(endLoad())
      if(res.code === 200) {
        this.setState({ data: res.msg })
      } else {
        dispatch(alertMsg(res.msg))
      }
    }).catch(err => {
      dispatch(endLoad())
      dispatch(alertMsg(err + ''))
    })
  }

  render() {
    const { data } = this.state
    const { coupons = [] } = data

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
      <div className="coupon-container">
        {renderCoupons()}
      </div>
    )
  }

}
