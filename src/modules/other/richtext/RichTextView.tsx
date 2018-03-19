import * as React from 'react'
import './RichTextView.less'
import { connect } from 'react-redux'
import { loadArticle } from '../async'

@connect(state => state)
export default class RichTextView extends React.Component {

  constructor () {
    super()
    this.state = {
      data: {},
    }
  }

  async componentWillMount () {
    const { id } = this.props.location.query
    let res = await loadArticle(id)
    if (res.code === 200) {
      this.setState({ data: res.msg })
    }
  }

  render () {
    const { title = '默认标题', content = '' } = this.state.data

    return (
      <div className="richtext-view-container">
        <div className="title">{title}</div>
        <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    )
  }

}
