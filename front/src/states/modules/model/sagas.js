import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { listModel, listModelSuccess, listModelFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(listModel, listModelSaga)
}

function* listModelSaga() {
	try {
		const { data } = yield call(
			api.get,
			`/documents/templates`
		)
		yield put(listModelSuccess(data))
	} catch (error) {
		yield put(listModelFailure(error))
	}
}
