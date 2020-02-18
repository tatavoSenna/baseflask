import { combineReducers } from 'redux'

import appReducer from './containers/App/reducer'
import loginReducer from './containers/Login/reducer'

const reducers = combineReducers({
  app: appReducer,
  login: loginReducer
})

export default reducers
