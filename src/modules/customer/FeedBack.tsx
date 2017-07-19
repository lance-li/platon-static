import * as React from "react"
import "./FeedBack.less"
import {changeTitle} from "utils/helpers"
import {mark} from "../problem/async"
import AssetImg from "../../components/AssetImg";


export default class FeedBack extends React.Component<any,any>{
  constructor(props){
    super(props);
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount(){
    changeTitle("帮助");
    mark({module: "打点", function: "帮助", action: "打开帮助页面"})
  }

  render(){
    return (
      <div className="feedback">
        <div onClick={()=>this.context.router.push("/rise/static/customer/userprotocol")} className="feedback-header arrow">
          用户协议
        </div>
        <div className="feedback-container">
          <div className="tip">
            <p style={{fontSize:'15px',fontWeight:'bolder'}}>有疑问或建议，请给后台留言</p>
            <div className="serverCode">
              <AssetImg url="https://static.iqycamp.com/images/personalFeedbackv1.png"/>
            </div>
            <p style={{fontSize:'15px',fontWeight:'bolder'}}>常见问题</p><br/>

            <p className="q">-如何进入小课的上／下一节？</p>
            <p>-在屏幕下部「练习区」左右滑动即可</p><br/>

            <p className="q">-我学完这节了，为什么还是启动不了下一节呢？</p>
            <p>-每一节学完之后就直接能够进入下一节啦。但是需要保证上一节的「知识理解」和「巩固练习」的图标都标上了“√”哦（PS：「知识理解」务必点击“标记完成”哦）</p><br/>

            <p className="q">-可以在电脑端完成圈外小课练习吗？</p>
            <p>-可以登录www.iquanwai.com/community完成</p><br/>

            <p className="q">-为什么我的小课到期关闭了？</p>
            <p>-书非借不能读，为了每个人能有动力坚持完成练习，每个小课的开放天数=30天(拖延症福利)，到期后自动关闭</p><br/>


            <p className="q">-课程的老师是谁啊？</p>
            <p>-圈外的小课多数是圈圈设计、整个团队一同打磨出来的，另外的是和一些业界大V合作开发的</p><br/>

            <p className="q">-之前报名的是专业版，现在我想升级成精英版，可以吗？</p>
            <p>-可以的，补差价即可。差价=（升级时专业版或精英版的价格）－（您购买的价格）<br/>请微信添加圈外助手小Q完成付款（ID：quanwaizhushou）</p>
            <br/>
            <p className="q">啊哦～还想了解更多关于【圈外同学】使用的问题？戳链接直达吧——</p>
            <p><a style={{color:'#666'}} href="https://shimo.im/doc/lRPFODOw4CY7eHfv/">{'https://shimo.im/doc/lRPFODOw4CY7eHfv/'}</a></p>
            <br/>
          </div>
        </div>
        <div className="padding-footer"></div>
      </div>
    )
  }
}
