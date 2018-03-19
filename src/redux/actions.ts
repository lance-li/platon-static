import ActionFactory from './ActionFactory'

let actions = new ActionFactory().getActions()
const { set, push, splice, start, end, open, close, startLoad, endLoad, alertMsg } = actions

export {
  set, push, splice, start, end, open, close, startLoad, endLoad, alertMsg
}
