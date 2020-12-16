import {
	call,
	put,
	takeEvery,
	// select
} from 'redux-saga/effects'

import api from '~/services/api'
import { listQuestion, listQuestionSuccess, listQuestionFailure } from '.'
import onlineChecking from '../../errorHandling'

export default function* rootSaga() {
	yield takeEvery(listQuestion, listQuestionSaga)
}

function* listQuestionSaga({ payload = {} }) {
	const { modelId, title } = payload

	try {
		const { data } = yield call(api.get, `/documents/templates/${modelId}`)

		yield put(listQuestionSuccess({ modelId, title, data }))
	} catch (error) {
		onlineChecking()
		yield put(listQuestionFailure(error))
	}
}
