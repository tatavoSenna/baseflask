import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { getStateField, getStateFieldSuccess, getStateFieldFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(getStateField, getStateFieldSaga)
}

function* getStateFieldSaga() {
	try {
		const { data } = yield call(
			api.get,
			`https://servicodados.ibge.gov.br/api/v1/localidades/estados`
		)
		yield put(getStateFieldSuccess(data))
	} catch (error) {
		yield put(getStateFieldFailure(error))
	}
}
