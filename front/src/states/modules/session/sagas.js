import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import api from '~/services/api'
import {
	getJWToken,
	getJWTFailure,
	getJWTSuccess,
	logout,
	logoutFailure,
	logoutSuccess,
} from '.'

export default function* rootSaga() {
	yield takeLatest('persist/REHYDRATE', setToken)
	yield takeEvery(getJWToken, getTokenSaga)
	yield takeEvery(logout, logoutSaga)
}

function* getTokenSaga({ payload }) {
	const { state, code,} = payload
	try {

		const { data } = yield call(api.get, '/auth/callback', {
			params: {
				state,
				code,
			}
		})

		api.defaults.headers['Authorization'] = `Bearer ${data.access_token}`
		yield put(getJWTSuccess(data))

	} catch (error) {
		yield put(getJWTFailure(error))
	}
}

function* logoutSaga({ payload }) {
	try {
		yield put(logoutSuccess())
		window.open(process.env.REACT_APP_API_SIGN_IN_URL)
	} catch (error) {
		yield put(logoutFailure(error))
	}
}

export function setToken({ payload }) {
	if (!payload) return

	const { token } = payload.session

	if (token) {
		api.defaults.headers['Authorization'] = `Bearer ${token}`
	}
}
