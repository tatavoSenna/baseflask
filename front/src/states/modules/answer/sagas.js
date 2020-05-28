// import { call, put, takeEvery, select } from 'redux-saga/effects'

// import api from '~/services/api'
// import { answer, answerSuccess, answerFailure } from '.'

export default function* rootSaga() {}

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
