import axios from 'axios'
import { store } from 'states/store'
import { logout } from '~/states/modules/session'
import { errorMessage } from '~/services/messager'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
})

api.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (!window.navigator.onLine) {
			errorMessage({
				content:
					'Não conseguimos contato com nossos servidores. O dispositivo está conectado?',
			})
		} else if (error.response.status === 401 || error.response.status === 403) {
			store.dispatch(logout())

			return Promise.reject(error)
		} else if (error.response.status === 400) {
			return Promise.reject(error)
		} else {
			errorMessage({
				content:
					'Ooops, ocorreu um erro. Já avisamos nossos engenheiros, por favor tente mais tarde.',
			})
		}
	}
)

export default api
