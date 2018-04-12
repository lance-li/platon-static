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

  autoFixedTimer

  componentDidMount () {
    let node = this.refs.discussTopBar
    this.autoFixedTimer = setInterval(() => {
      let rect = node.getBoundingClientRect()
      if (rect.top < 0) {
        node.classList.add('fixed')
      } else {
        node.classList.remove('fixed')
      }
    }, 500)
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
