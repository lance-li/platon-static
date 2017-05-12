import * as React from "react"
import {connect} from "react-redux"
import * as _ from "lodash"
import {set, startLoad, endLoad, alertMsg} from "redux/actions"
import {pget, ppost} from "utils/request"
import {changeTitle} from "utils/helpers"
import "./Account.less"


@connect(state=>state)
export default class Rise extends React.Component<any,any>{
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state={
        data:{},
    }
  }

  componentWillMount(){
    changeTitle("我的账户");
    const {dispatch} = this.props;
    dispatch(startLoad());
    pget("/rise/customer/account")
      .then(res=>{
        dispatch(endLoad());
        if(res.code===200){
          this.setState({data:res.msg});
        } else {
          dispatch(alertMsg(res.msg));
        }
      }).catch(err=>{
      dispatch(endLoad());
      dispatch(alertMsg(err+""));
    })
  }
  render(){
    const {data} = this.state
    const {riseId, memberType} = data
    return (
     <div className="rise">
       <div className="item">
         <div className="label">
           RISE ID
         </div>
         <div className="content-no-cut">
           {riseId}
         </div>
       </div>

       <div className="item" onClick={()=>{this.context.router.push("/rise/static/customer/member")}}>
         <div className="label">
           RISE会员
         </div>
         <div className="content">
             {memberType}
         </div>
       </div>
     </div>
    )
  }
}