import * as React from 'react'
import './MonthSchedule.less'
import Sortable from 'sortablejs'
import { ProblemDescription } from './ProblemDescription'
import { startLoad, endLoad, alertMsg } from 'redux/actions'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { updateSelected } from '../../async'

interface MonthScheduleProps {
  id: any,
  schedules: any,
  draggable: boolean,
  switchSubmitButton: any,
  showDescBox: boolean,
  enableAutoScroll: any,
  disableAutoScroll: any,
}

interface MonthScheduleState {
}

@connect(state => state)
export class MonthSchedule extends React.Component<MonthScheduleProps, MonthScheduleState> {

  constructor() {
    super()
    this.state = {}
  }

  sortbale

  componentWillMount() {
    const { id, schedules, draggable } = this.props
    this.setState({ id: id, schedules: schedules, draggable: draggable })
  }

  componentDidMount() {
    const { enableAutoScroll, disableAutoScroll } = this.props

    let node = document.getElementById(this.props.id)
    this.sortbale = Sortable.create(node, {
      group: 'sorting',
      sort: false,
      animation: 150,
      handle: '.draggable-item',
      ghostClass: 'ghost',
      dragClass: 'drag',
      onStart: function(evt) {
        enableAutoScroll()
        evt.oldIndex  // element index within parent
      },
      onEnd: function(evt) {
        disableAutoScroll()
        var itemEl = evt.item  // dragged HTMLElement
        evt.to    // target list
        evt.from  // previous list
        evt.oldIndex  // element's old index within old parent
        evt.newIndex  // element's new index within new parent
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.props = nextProps
      const { id, schedules, draggable } = this.props
      this.setState({ id: id, schedules: schedules, draggable: draggable })
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto'
  }

  getInnerState() {
    return this.state
  }

  handleClickChangePosition(schedule, draggable) {
    if(!draggable) {
      // 主修课无法选择或者取消
      if(schedule && schedule.type === 1) {
        return
      }
      updateSelected(schedule.id, !schedule.selected)
      const { schedules } = this.state
      schedules.forEach(item => {
        if(item.id === schedule.id) {
          item.selected = !schedule.selected
        }
      })
      this.setState({ schedules: schedules })
    } else {
      const { dispatch } = this.props
      if(schedule.type === 1) {
        dispatch(alertMsg('主修课为每月小班教学，无法移动'))
      } else {
        if(!schedule.adjustable) {
          if(schedule.problem.publish) {
            dispatch(alertMsg('已开课的课程，无法移动'))
          } else {
            dispatch(alertMsg('课程开发中，暂时不能移动'))
          }
        }
      }
    }
  }

  handleClickProblemDesc(draggable) {
    if(!draggable) {
      this.setState({ showDescBox: true })
      switchSubmitButton(false)
      document.body.style.overflow = 'hidden'
    }

  }

  render() {
    const { switchSubmitButton } = this.props
    const { id, draggable, showDescBox = false } = this.state
    let { schedules = [] } = this.state
    schedules = _.orderBy(schedules, ['type'], ['asc'])

    let firstSchedule = schedules[0]
    return (
      <section id={`year-${firstSchedule.year}-month-${firstSchedule.month}`} className="month-schedule-component">
        <div className="schedule-topic">{`${firstSchedule.month}月 ${firstSchedule.topic}`}</div>
        <div className="split-line"/>
        <ul id={id} className="schedule-box">
          {
            schedules.map((schedule, index) => {
              return (
                <li key={index} id={`problemid-${schedule.problem.id}-id-${schedule.id}`}
                    className={`
                      problem
                      ${schedule.type === 2 ? 'minor-problem' : ''}
                      ${schedule.adjustable ? schedule.selected ? 'selected' : 'no-selected' : 'dis-ajustable'}
                      ${draggable ? 'hide' : ''}
                    `}
                    onClick={() => this.handleClickChangePosition(schedule, draggable)}>
                  <span className="problem-name">
                    {`${schedule.type === 1 ? '主修 | ' : '辅修 | '} ${schedule.problem.problem}`}
                  </span>
                  <div
                    className={`
                      month-problem-desc
                      ${draggable ? schedule.adjustable ? 'draggable draggable-item' : 'lock' : ''}
                    `}
                    onClick={() => this.handleClickProblemDesc(draggable)}/>
                </li>
              )
            })
          }
        </ul>
        <ProblemDescription show={showDescBox} schedules={schedules}
                            closeCallBack={() => {
                              this.setState({ showDescBox: false })
                              switchSubmitButton(true)
                              document.body.style.overflow = 'auto'
                            }}/>
      </section>
    )
  }

}
