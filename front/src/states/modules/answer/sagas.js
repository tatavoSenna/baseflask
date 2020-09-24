import { call, put, takeEvery, select } from 'redux-saga/effects'

import api from '~/services/api'
import { answerRequest, answerSuccess, answerFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(answerRequest, answerSaga)
}

function* answerSaga({ payload }) {
	const { history } = payload
	const { answer, modelId } = yield select((state) => {
		const {
			answer,
			question: { modelId },
		} = state
		return { answer, modelId }
	})
	try {
		const { data } = yield call(api.post, `/documents/create`, {
			model: modelId,
			variables: answer.data,
		})

		yield put(answerSuccess(data))
		history.push('/')
	} catch (error) {
		yield put(answerFailure(error))
	}
}
