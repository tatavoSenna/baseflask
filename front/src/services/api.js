import axios from 'axios'
import { errorMessage } from '~/services/messager'
import { Auth } from 'aws-amplify'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
})

api.interceptors.request.use(async (config) => {
	// in case there is a logged in user, get the token from amplify auth
	// and add it as an atuh beare token to the api
	try {
		const session = await Auth.currentSession()
		const accessToken = session.getAccessToken()
		const jwtToken = accessToken.getJwtToken()
		config.headers['Authorization'] = `Bearer ${jwtToken}`
	} catch (error) {
		//pass
	}
	return config
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
			//store.dispatch(logout())

			// return Promise.reject(error)
			return null
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
