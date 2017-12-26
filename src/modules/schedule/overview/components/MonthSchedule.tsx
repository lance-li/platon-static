import * as React from 'react'
import './MonthSchedule.less'
import Sortable from 'sortablejs'
import { startLoad, endLoad, alertMsg } from 'redux/actions'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { updateSelected } from '../../async'

interface MonthScheduleProps {
  id: any,
  schedules: any,
  draggable: boolean,
  enableAutoScroll: any,
  disableAutoScroll: any,
  toggleSubmitButton: any
}

@connect(state => state)
export class MonthSchedule extends React.Component<MonthScheduleProps, any> {

  constructor() {
    super()
    this.state = {}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  sortbale

  componentWillMount() {
    const { id, schedules, draggable } = this.props
    this.setState({ id: id, schedules: schedules, draggable: draggable })
  }

  componentDidMount() {
    const { enableAutoScroll, disableAutoScroll, toggleSubmitButton } = this.props

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
        toggleSubmitButton(false)
        evt.oldIndex  // element index within parent
      },
      onMove: (/**Event*/evt, /**Event*/originalEvent) => {
        toggleSubmitButton(false)
        evt.dragged // dragged HTMLElement
        evt.draggedRect // TextRectangle {left, top, right и bottom}
        evt.related // HTMLElement on which have guided
        evt.relatedRect // TextRectangle
        originalEvent.clientY // mouse position
      },
      onEnd: function(evt) {
        toggleSubmitButton(true)
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

  handleClickViewProblemDesc(draggable, schedule, e) {
    e.preventDefault()
    if(!draggable) {
      e.stopPropagation()
      if(schedule.problem.publish) {
        this.context.router.push(`/rise/static/plan/view?id=${schedule.problem.id}&show=true`)
      } else {
        this.context.router.push(`/rise/static/course/schedule/nopublish`)
      }
    }
  }

  handleClickChangePosition(schedule, draggable) {
    const { dispatch } = this.props
    if(!draggable) {
      // 主修课无法选择或者取消
      if(schedule.type === 1) {
        dispatch(alertMsg('主修课为每月小班教学，无法取消'))
        return
      } else {
        if(!schedule.adjustable && schedule.problem.publish) {
          dispatch(alertMsg('已开课的课程，无法取消'))
          return
        }
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

  render() {
    const { id, draggable } = this.state
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
                      ${schedule.selected ? 'selected' : 'no-selected'}
                      ${draggable ? 'hide' : ''}
                    `}
                    onClick={() => this.handleClickChangePosition(schedule, draggable)}>
                  <span className="problem-name">
                    {`${schedule.type === 1 ? '主修 | ' : '辅修 | '} ${schedule.problem.problem}`}
                  </span>
                  <div className={`
                          month-problem-desc
                          ${draggable ? schedule.adjustable ? 'draggable draggable-item' : 'lock' : ''}
                       `}
                       onTouchStart={ev => ev.preventDefault()}
                       onTouchMove={ev => ev.preventDefault()}
                       onClick={(e) => this.handleClickViewProblemDesc(draggable, schedule, e)}/>
                </li>
              )
            })
          }
        </ul>
      </section>
    )
  }

}
