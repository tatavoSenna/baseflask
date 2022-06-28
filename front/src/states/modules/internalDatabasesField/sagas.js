import { call, put, takeEvery } from 'redux-saga/effects'

import api from 'services/api'

import {
	getDatabaseTexts,
	getDatabaseTextsSuccess,
	getDatabaseTextsFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getDatabaseTexts, getDatabaseTextsSaga)
}

function* getDatabaseTextsSaga({ payload = {} }) {
	const { id } = payload

	try {
		const { data } = yield call(api.get, `/internaldbs/${id}/textitems`)

		yield put(getDatabaseTextsSuccess({ ...data, id }))
	} catch (error) {
		yield put(getDatabaseTextsFailure({ error, id }))
	}
}
