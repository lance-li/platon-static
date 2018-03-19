import * as React from 'react'
import './MonthSchedule.less'
import Sortable from 'sortablejs'
import { startLoad, endLoad, alertMsg, set } from 'reduxutil/actions'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { updateSelected } from '../../async'
import DropDownList from '../../../customer/components/DropDownList'

interface MonthScheduleProps {
  id: any,
  schedules: any,
  draggable: boolean,
  enableAutoScroll: any,
  disableAutoScroll: any,
  toggleSubmitButton: any,
  compatible: boolean
}

const monthList = [
  { id: '1', value: '1月' },
  { id: '2', value: '2月' },
  { id: '3', value: '3月' },
  { id: '4', value: '4月' },
  { id: '5', value: '5月' },
  { id: '6', value: '6月' },
  { id: '7', value: '7月' },
  { id: '8', value: '8月' },
  { id: '9', value: '9月' },
  { id: '10', value: '10月' },
  { id: '11', value: '11月' },
  { id: '12', value: '12月' }
]

// 动画移动 StyleSheet
var problemMovingStyle

@connect(state => state)
export class MonthSchedule extends React.Component<MonthScheduleProps, any> {

  constructor() {
    super()
    this.state = {
      compatible: false
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  sortbale

  componentWillMount() {
    const { id, schedules, draggable, compatible = false } = this.props
    this.setState({ id: id, schedules: schedules, draggable: draggable, compatible: compatible })
  }

  componentDidMount() {
    if(!this.state.compatible) {
      this.renderSortableJS()
    }
  }

  renderSortableJS() {
    const { enableAutoScroll, disableAutoScroll, toggleSubmitButton } = this.props

    let node = document.getElementById(this.props.id)
    this.sortbale = Sortable.create(node, {
      group: 'sorting',
      sort: true,
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
    this.context.router.setState({ pageScrollY: window.pageYOffset })

    if(!draggable) {
      e.stopPropagation()
      if(schedule.problem.publish) {
        this.context.router.push(`/rise/static/plan/view?id=${schedule.problem.id}&show=true`)
      } else {
        this.context.router.push(`/rise/static/course/schedule/nopublish`)
      }
    } else {
      if(!schedule.adjustable || !this.state.compatible) {
        return
      }
      e.stopPropagation()
      e.preventDefault()

      this.setState({
        currentHandleSchedule: schedule,
        originScrollY: window.scrollY
      })

      let dropDown = this.refs.dropDown
      if(dropDown) {
        dropDown.choice()
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

  handleChooseMonth(month) {
    const chooseMonth = month.id
    const schedule = this.state.currentHandleSchedule
    let node = document.getElementById(`problemid-${schedule.problem.id}-id-${schedule.id}`)
    let originTop = node.offsetTop
    let parentNode = document.getElementById(chooseMonth)
    parentNode.appendChild(node)
    let finalTop = node.offsetTop
    let rule = `
        @keyframes problemMove {
          from {
            position: absolute;
            z-index: 10;
            top: ${originTop}px;
          }
          to {
            position: absolute;
            z-index: 10;
            top: ${finalTop}px;
          }
        }
      `
    problemMovingStyle = document.createElement('style')
    problemMovingStyle.innerHTML = rule
    document.head.appendChild(problemMovingStyle)
    let delayTime = Math.abs(finalTop - originTop) / 500
    node.style.animation = `problemMove ${delayTime}s linear`
    node.style.animationFillMode = 'forwards'

    setTimeout(() => {
      node.style.animation = ''
      node.style.animationFillMode = ''
      document.head.removeChild(problemMovingStyle)
    }, delayTime * 1000)
  }

  render() {
    const { id, draggable, compatible } = this.state
    let { schedules = [] } = this.state
    schedules = _.orderBy(schedules, ['type'], ['asc'])

    let firstSchedule = schedules[0]
    return (
      <section id={`year-${firstSchedule.year}-month-${firstSchedule.month}`} className="month-schedule-component">
        <div className="schedule-topic">{`${firstSchedule.month}月 ${firstSchedule.topic}`}</div>
        <div className="split-line"/>
        <ul id={firstSchedule.month} className="schedule-box">
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
                    {`${schedule.type === 1 ? '主修 | ' : '辅修 | '} ${schedule.problem.abbreviation}`}
                  </span>
                  <div className={`month-problem-desc
                        ${draggable && !compatible ? schedule.adjustable ? 'draggable draggable-item' : 'lock' : ''}
                        ${draggable && compatible ? 'draggable' : ''}
                       `}
                       style={
                         compatible &&
                         draggable ?
                           {
                             background: 'none',
                             color: `${schedule.adjustable ? '#1f87ff' : '#999999'}`,
                             width: '6rem',
                             textAlign: 'right'
                           } : {}
                       }
                       onClick={(e) => this.handleClickViewProblemDesc(draggable, schedule, e)}>
                    {
                      compatible &&
                      draggable && schedule.type === 2 ? '移动到' : ''
                    }
                  </div>
                </li>
              )
            })
          }
        </ul>
        <DropDownList ref='dropDown' level={1} data={[monthList]} placeholder={` `} onChoice={(month) => this.handleChooseMonth(month)}/>
      </section>
    )
  }

}
