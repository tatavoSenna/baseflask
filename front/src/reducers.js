import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import appReducer from './containers/App/reducer'
import loginReducer from './containers/Login/reducer'

const reducers = combineReducers({
  app: persistReducer({ key: 'app', storage, blacklist: ['loading', 'new_document_download_dialog_open']}, appReducer),
  login: loginReducer
})

export default reducers
