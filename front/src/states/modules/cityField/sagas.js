import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { getCityField, getCityFieldSuccess, getCityFieldFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(getCityField, getCityFieldSaga)
}

function* getCityFieldSaga() {
	try {
		const { data } = yield call(
			api.get,
			`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
		)
		yield put(getCityFieldSuccess(data))
	} catch (error) {
		yield put(getCityFieldFailure(error))
	}
}
