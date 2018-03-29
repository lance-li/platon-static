import * as React from 'react'
import requestProxy from './requestProxy'
import { connect } from 'react-redux'
import { set, startLoad, endLoad, alertMsg } from 'reduxutil/actions'

@connect(state => state)
export default class RequestComponent extends React.Component {

  constructor () {
    super()
  }

  componentDidMount () {
    requestProxy.addObserver(this)
  }

  startLoad () {
    const { dispatch } = this.props
    dispatch(startLoad())
  }

  endLoad () {
    const { dispatch } = this.props
    dispatch(endLoad())
  }

  alertMessage (message) {
    const { dispatch } = this.props
    dispatch(alertMsg(message))
  }

  render () {
    return (
      <div></div>
    )
  }

}
