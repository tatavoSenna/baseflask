import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD
} from './actions'

export default function (state = {
  email: '',
  password: ''
}, action) {
  switch (action.type) {
    case CHANGE_EMAIL:
      return { ...state, email: action.payload }
    case CHANGE_PASSWORD:
      return { ...state, password: action.payload }
    default:
      return state
  }
}
