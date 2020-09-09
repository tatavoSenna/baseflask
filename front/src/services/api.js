import axios from 'axios'
import { store } from 'states/store'
import { logout } from '~/states/modules/session'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
})

api.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response.status === 401 || error.response.status === 403) {
			store.dispatch(logout())
		} else {
			return Promise.reject(error)
		}
	}
)

export default api
