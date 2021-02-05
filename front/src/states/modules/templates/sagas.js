import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { listTemplate, listTemplateSuccess, listTemplateFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(listTemplate, fetchTemplates)
}

function* fetchTemplates({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload
	try {
		const { data } = yield call(
			api.get,
			`/templates/?per_page=${perPage}&page=${page}&search=${search}`
		)

		yield put(listTemplateSuccess(data))
	} catch (error) {
		yield put(listTemplateFailure(error))
	}
}
