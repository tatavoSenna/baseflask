import { call, put, takeEvery } from 'redux-saga/effects'

import axios from 'axios'
import { getCityField, getCityFieldSuccess, getCityFieldFailure } from '.'

const api = axios.create({
	baseURL: `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`,
})

export default function* rootSaga() {
	yield takeEvery(getCityField, getCityFieldSaga)
}

function* getCityFieldSaga() {
	try {
		const { data } = yield call(api.get)
		yield put(getCityFieldSuccess(data))
	} catch (error) {
		yield put(getCityFieldFailure(error))
	}
}
