import { call, put, takeEvery } from 'redux-saga/effects'
import {
	successMessage,
	loadingMessage,
	errorMessage,
} from '~/services/messager'

import api from '~/services/api'
import { getUserProfile, getUserProfileSuccess, getUserProfileFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(getUserProfile, getUserProfileSaga)
}

function* getUserProfileSaga() {
	const url = `/users/me`
	try {
		const { data } = yield call(api.get, url)
		console.log(data)
		yield put(getUserProfileSuccess(data))
	} catch (error) {
		console.log(error)
		yield put(getUserProfileFailure())
	}
}
