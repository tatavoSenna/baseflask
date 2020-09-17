import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { listModel, listModelSuccess, listModelFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(listModel, listModelSaga)
}

function* listModelSaga({ payload = {} }) {
	const { perPage = 20, page = 1 } = payload
	try {
		const { data } = yield call(
			api.get,
			`/documents/models?per_page=${perPage}&page=${page}`
		)
		yield put(listModelSuccess(data))
	} catch (error) {
		yield put(listModelFailure(error))
	}
}
