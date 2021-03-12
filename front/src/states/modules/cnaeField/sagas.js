import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { getCnaeField, getCnaeFieldSuccess, getCnaeFieldFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(getCnaeField, getCnaeFieldSaga)
}

function* getCnaeFieldSaga() {
	try {
		const { data } = yield call(
			api.get,
			`https://servicodados.ibge.gov.br/api/v2/cnae/classes`
		)
		yield put(getCnaeFieldSuccess(data))
	} catch (error) {
		yield put(getCnaeFieldFailure(error))
	}
}
