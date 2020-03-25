// Libs
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import thunk from 'redux-thunk'
import axios from 'axios'

// Styles
import './styles/index.less'

// Reduccers
import reducers from './reducers'

// Containers or components
import App from './containers/App'

axios.defaults.baseURL = process.env.REACT_APP_API_URL

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
)

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
      <Route path='/' component={() => <App />} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
