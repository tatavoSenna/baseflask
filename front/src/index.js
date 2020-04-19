// Libs
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import documentSaga from './sagas/DocumentSaga'
import axios from 'axios'

// Styles
import './styles/index.less'

// Reduccers
import reducers from './reducers'

// Containers or components
import App from './containers/App'

axios.defaults.baseURL = process.env.REACT_APP_API_URL

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducers,
  composeWithDevTools( applyMiddleware(thunk), applyMiddleware(sagaMiddleware) )
)
const persistor = persistStore(store)
sagaMiddleware.run(documentSaga)

axios.interceptors.response.use(
  response => {
    // Do something with response data
    return response;
  },
  error => {
    // Do something with response error
    // if (error.response.status === 401) store.dispatch(logout())
    return Promise.reject(error);
  }
)

render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}> 
        <Route path='/' component={() => <App />} />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
