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
	const { documentId } = payload

	try {
		const { data } = yield call(api.get, `/documents/questions?document=${documentId}`)

		yield put(listQuestionSuccess(data))
	} catch (error) {
		yield put(listQuestionFailure(error))
	}
}

// function* answerSaga({ payload }) {
// 	const { history } = payload
// 	const { question } = yield select()

// 	try {
// 		const { data } = yield call(api.post, `/create`, {
// 			document: 8,
// 			questions: question.questions,
// 		})

// 		yield put(answerSuccess(data))
// 		history.push('/contracts')
// 	} catch (error) {
// 		yield put(answerFailure(error))
// 	}
// }
