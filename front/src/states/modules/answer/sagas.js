import { call, put, takeEvery, select } from 'redux-saga/effects'

import api from '~/services/api'
import { answerRequest, answerSuccess, answerFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(answerRequest, answerSaga)
}

function* answerSaga({ payload }) {
	const { history } = payload
	const { answer } = yield select()

	try {
		const { data } = yield call(api.post, `/documents/create`, {
			document: 10,
			questions: answer.data,
		})

		yield put(answerSuccess(data))
		history.push('/')
	} catch (error) {
		yield put(answerFailure(error))
	}
}
