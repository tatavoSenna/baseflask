import { call, put, takeEvery } from 'redux-saga/effects'

import axios from 'axios'
import { getLegalInfo, getLegalInfoSuccess, getLegalInfoFailure } from '.'

// lembrar que tem o request para pegar o token, além do request dos dados
const api = axios.create({
	baseURL: `https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/basica/`,
})

api.interceptors.request.use(async (config) => {
	config.headers['Authorization'] =
		'Bearer 06aef429-a981-3ec5-a1f8-71d38d86481e'
	return config
})

export default function* rootSaga() {
	yield takeEvery(getLegalInfo, getLegalInfoSaga)
}

function* getLegalInfoSaga({ payload }) {
	try {
		const { data } = yield call(api.get, `/${payload}`)
		yield put(getLegalInfoSuccess(data))
	} catch (error) {
		yield put(getLegalInfoFailure(error))
	}
}
