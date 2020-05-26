import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import appReducer from './containers/App/reducer'
import loginReducer from './containers/Login/reducer'
import dialogReducer from './components/Dialog/reducer' 

const reducers = combineReducers({
  app: persistReducer({ key: 'app', storage, blacklist: ['loading', 'logs'] }, appReducer),
  login: loginReducer,
  dialog: dialogReducer
})

export default reducers
