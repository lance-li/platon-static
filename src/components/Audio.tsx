import * as React from "react";
import "./Audio.less";
import Slider from "react-rangeslider";
import AssetImg from "./AssetImg";
import render = ReactDOM.render

let timer;
let duration_load_timer;

enum Device {
  IPHONE = 1,
  ANDROID,
  OTHER
}

interface AudioProps {
  url: string,
  words?: string,
}

export default class Audio extends React.Component<AudioProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      duration: 0,
      currentSecond: 0,
      cntSecond: 0,
      device: "",
      playing: false,
      pause: false,
      loading: false,
      start: false,
      showWords: false,
    }
  }

  componentWillMount() {
    if(window.navigator.userAgent.indexOf("Android") > 0) {
      this.setState({ device: Device.ANDROID })
    } else if(window.navigator.userAgent.indexOf("iPhone") > 0 || window.navigator.userAgent.indexOf("iPad") > 0) {
      this.setState({ device: Device.IPHONE })
    } else {
      this.setState({ device: Device.OTHER })
    }
  }

  componentDidMount() {
    const { device } = this.state
    if(device == Device.ANDROID) {
      try {
        //华为某些机型不支持https的语音
        this.refs.sound.src = this.refs.sound.src.replace('https', 'http')
        this.refs.sound.load()
      } catch(e) {
        alert(e)
      }

    }
  }

  componentWillUnmount() {
    clearInterval(timer);
    clearInterval(duration_load_timer);
  }

  onEnd() {
    this.setState({ currentSecond: this.state.duration, playing: false })
    clearInterval(timer)
  }

  start() {
    let self = this
    // 首次点击播放按钮
    this.setState({ playing: true, start: true })
    // 首次加载
    if(this.state.duration === 0 && !this.state.start) {
      // 加载音频
      this.setState({ loading: true })
      self.refs.sound.load()
      duration_load_timer = setInterval(() => {
        if(self.state.duration) {
          clearInterval(duration_load_timer)
          return
        }
        //【IOS bug解决方法】先播放，再暂停，获取控件duration
        self.refs.sound.play()
        self.refs.sound.pause()
        if(self.refs.sound.duration) {
          self.setState({ duration: Math.floor(self.refs.sound.duration), loading: false })
          self.play()
        }
      }, 500)
    } else {
      // 重头开始播放
      if(Math.floor(this.state.currentSecond) === this.state.duration) {
        this.setState({ currentSecond: 0 })
      }
      this.play()
    }
  }

  play() {
    const self = this
    if(timer) {
      clearInterval(timer)
    }
    this.setState({ playing: true, pause: false }, () => {
      self.refs.sound.play()
      timer = setInterval(() => {
        if(this.state.currentSecond < this.state.duration) {
          //设置已播放时长
          self.setState({ currentSecond: self.refs.sound.currentTime })
        } else {
          clearInterval(timer)
          this.setState({ playing: false })
        }
      }, 100)
    })
  }

  pause() {
    this.setState({ playing: false, pause: true })
    clearInterval(timer)
    this.refs.sound.pause()
  }

  //手动更改时间
  onProgressChange(value) {
    //如果没有加载完成，不允许拖动
    if(this.state.duration === 0) {
      return
    }
    clearInterval(timer)
    this.setState({ playing: true, currentSecond: value }, () => {
      this.refs.sound.currentTime = value
      this.play()
    })
  }

  //使用原生audio标签
  renderOrigin(url) {
    const { words } = this.props;
    return (
      <audio ref="sound" src={url} controls="controls"/>
    )
  }

  //使用定制化audio组件
  renderCustomize(url) {
    const { currentSecond, playing, duration, loading, showWords } = this.state
    return (
      <div className="audio">
        <div className="audio-container">
          {loading ?
            <div className="audio-btn" onClick={this.pause.bind(this)}>
              <AssetImg url="https://www.iqycamp.com/images/audio_loading.gif" size={20}/>
            </div>
            : playing ?
              <div className="audio-btn" onClick={this.pause.bind(this)}>
                <AssetImg url="https://www.iqycamp.com/images/audio_pause.png" size={20}/>
              </div> :
              <div className="audio-btn" onClick={this.start.bind(this)}>
                <AssetImg url="https://www.iqycamp.com/images/audio_play.png" size={20}/>
              </div>
          }
          <div className="audio-progress">
            <Slider min={0} max={duration} value={currentSecond} onChange={this.onProgressChange.bind(this)}
                    withBars={true}/>
          </div>
          <div className="audio-duration">
            {intToTime(currentSecond)} / {intToTime(duration)}
          </div>
          <audio ref="sound" src={url}
                 onEnded={this.onEnd.bind(this)}
          />
        </div>
      </div>
    )
  }

  handleClickShowWords(showWords) {
    this.setState({ showWords: !showWords });
  }

  temprenderWordsComponent(showWords, words) {
    return (
      <div className="audio-words-container">
        <div className={`audio-words-btn ${showWords ? 'open' : ''}`}
             onClick={() => this.handleClickShowWords(showWords)}>
          <span className="awb-tips">语音文字版</span>
        </div>
        {showWords ?
          <pre className="audio-words" dangerouslySetInnerHTML={{ __html: words }}/>
          : null}
      </div>
    )
  }

  renderWordsComponent(showWords, words) {
    return (
      <div className={`audio-words-container ${showWords ? 'show-all' : ''}`}>
        <div className="audio-words" dangerouslySetInnerHTML={{ __html: words }}/>
        <div className={`audio-mask ${showWords ? 'hide' : 'show'}`}
             onClick={() => this.handleClickShowWords(showWords)}>
          {showWords ? '点击收起' : '点击查看语音文字稿'}
        </div>
      </div>
    )
  }

  render() {
    const { url } = this.props
    const { words } = this.props;
    const { showWords, device } = this.state;
    let renderList = [];
    let wordsComponent = null;
    if(words) {
      // 有文字，显示文字提示
      wordsComponent = this.renderWordsComponent(showWords, words);
    }
    // 区分平台显示不同的音频组件
    if(device === Device.ANDROID) {
      renderList.push(this.renderOrigin(url));
    } else {
      renderList.push(this.renderCustomize(url));
    }

    // 语音文字
    if(wordsComponent) {
      renderList.push(wordsComponent);
    }
    return (
      <div className="audio-wrapper">
        {renderList}
      </div>
    );
  }
}

function intToTime(val) {
  return new Date(val * 1000).toISOString().substr(14, 5)
}
