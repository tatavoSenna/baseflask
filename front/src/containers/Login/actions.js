// Libs
import axios from 'axios'

// Actions
import { changeUser, changeIsAuthenticated } from '../App/actions'

export const CHANGE_EMAIL = 'change_email'
export const CHANGE_PASSWORD = 'change_password'

export const changeEmail = (email) => {
  return {
    type: CHANGE_EMAIL,
    payload: email
  }
}

export const changePassword = (password) => {
  return {
    type: CHANGE_PASSWORD,
    payload: password
  }
}

export const login = (email, password) => {
  return dispatch => {
    return axios.post('/login', { email, password })
      .then(response => {
        const { token, user } = response.data

        // Change axios 'Authorization' header
        axios.defaults.headers.common['X-Auth-Token'] = token 

        // Change reducer
        dispatch(changeIsAuthenticated(true, token))
        dispatch(changeUser(user))
      })
      .catch(e => {
        console.log(e)
      })
  }
}
