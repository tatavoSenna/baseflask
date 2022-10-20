import {
	call,
	put,
	takeEvery,
	// select
} from 'redux-saga/effects'

import api from '~/services/api'
import { listQuestion, listQuestionSuccess, listQuestionFailure } from '.'
import { setResetAnswer } from '../answer'

export default function* rootSaga() {
	yield takeEvery(listQuestion, listQuestionSaga)
}

function* listQuestionSaga({ payload = {} }) {
	const { modelId, title, parent } = payload

	try {
		const { data } = yield call(api.get, `/documents/templates/${modelId}`)
		yield put(setResetAnswer())
		yield put(listQuestionSuccess({ modelId, title, parent, data }))
	} catch (error) {
		yield put(listQuestionFailure(error))
	}
}
