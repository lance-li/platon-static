import './style.less'
import 'whatwg-fetch'
import * as React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './redux/configureStore'
import routes from './routes'
import './style/weui.min.css'
import './components/CustomerWeuiSwitch.less'
import './style/swiper.min.css'
import './style/animate.min.css'

const store = configureStore()

declare var window: {
  ENV
}

render(<Provider store={store}>
  <Router history={browserHistory} routes={routes}/>
</Provider>, document.getElementById(window.ENV.reactMountPoint))

let fontCssLink = document.createElement('link')
fontCssLink.href = 'https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
fontCssLink.rel = 'stylesheet'
document.body.appendChild(fontCssLink)

let fontSize = 0
if (document.body.clientWidth > 414) {
  fontSize = 414 / 37.5
} else {
  fontSize = document.body.clientWidth / 37.5
}
document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px'
