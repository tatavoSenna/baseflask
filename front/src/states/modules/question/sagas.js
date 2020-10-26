import {
	call,
	put,
	takeEvery,
	// select
} from 'redux-saga/effects'

import api from '~/services/api'
import { listQuestion, listQuestionSuccess, listQuestionFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(listQuestion, listQuestionSaga)
}

function* listQuestionSaga({ payload = {} }) {
	const { modelId } = payload

	try {
		const { data } = yield call(
			api.get,
			`/documents/templates/${modelId}`
		)

		yield put(listQuestionSuccess({ modelId, data }))
	} catch (error) {
		yield put(listQuestionFailure(error))
	}
}
