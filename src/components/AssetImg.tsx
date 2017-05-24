import * as React from "react";
import { merge } from "lodash";

export default class AssetImg extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading:true
    }

  }

  render() {
    const { size, type, width, height, marginTop, style, marginRight } = this.props
    let {url} = this.props
    //来自七牛云的图片，自动添加瘦身参数
    if(url.indexOf('static.iqycamp.com')!=-1 && url.indexOf('imageslim')!=-1){
      url = url + '?imageslim'
    }
    const { loading } = this.state;
    const _style = {
      width: size || width,
      height: size || height,
      marginTop: marginTop,
      marginRight: marginRight,
    }

    return (
      <img className={`${loading?'loading':''}`} src={type ? require(`../../assets/img/${type}.png`) : url} onLoad={()=>this.setState({loading:false})} style={merge(_style, style)}/>
    )
  }
}
