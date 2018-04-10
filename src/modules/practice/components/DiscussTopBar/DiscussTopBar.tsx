import * as React from 'react'
import './DiscussTopBar.less'

interface DiscussTopBarProps {
  leftLabel: string,
  rightLabel: string,
  rightOnClick: any
}

export default class DiscussTopBar extends React.Component<DiscussTopBarProps, any> {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    let node = this.refs.discussTopBar
    let startX, startY, moveEndX, moveEndY, X, Y
    let body = document.getElementsByTagName('body')[0]
    if (node) {
      body.addEventListener('touchstart', e => {
        startX = e.touches[0].pageX
        startY = e.touches[0].pageY
      })
      body.addEventListener('touchmove', (e) => {
        moveEndX = e.changedTouches[0].pageX
        moveEndY = e.changedTouches[0].pageY
        X = moveEndX - startX
        Y = moveEndY - startY
        let rect = node.getBoundingClientRect()
        if (Y > 0) {
          node.classList.remove('fixed')
        } else if (Y < 0) {
          if (rect.top < 0) {
            node.classList.add('fixed')
          }
        }
      })
      body.addEventListener('touchcancel', (e) => {
        moveEndX = e.changedTouches[0].pageX
        moveEndY = e.changedTouches[0].pageY
        X = moveEndX - startX
        Y = moveEndY - startY
        let rect = node.getBoundingClientRect()
        if (Y > 0) {
          node.classList.remove('fixed')
        } else if (Y < 0) {
          if (rect.top < 0) {
            node.classList.add('fixed')
          }
        }
      })
      body.addEventListener('scroll', (e) => {
        moveEndX = e.changedTouches[0].pageX
        moveEndY = e.changedTouches[0].pageY
        X = moveEndX - startX
        Y = moveEndY - startY
        let rect = node.getBoundingClientRect()
        if (Y > 0) {
          node.classList.remove('fixed')
        } else if (Y < 0) {
          if (rect.top < 0) {
            node.classList.add('fixed')
          }
        }
      })
    }
  }

  render () {
    const {
      leftLabel = '',
      rightLabel = '',
      rightOnClick = () => {
      },
    } = this.props

    return (
      <div className="discuss-top-bar-component"
           ref="discussTopBar">
        <span className="left-title">{leftLabel}</span>
        <span className="right-title"
              onClick={() => rightOnClick()}>{rightLabel}</span>
      </div>
    )
  }
}
