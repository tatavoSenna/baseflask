import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import api from '~/services/api'
import {
	getJWToken,
	getJWTFailure,
	getJWTSuccess,
	logout,
	logoutFailure,
	logoutSuccess,
	getLoggedUser,
	getLoggedUserSuccess,
} from '.'

export default function* rootSaga() {
	yield takeLatest('persist/REHYDRATE', setToken)
	yield takeEvery(getJWToken, getTokenSaga)
	yield takeEvery(logout, logoutSaga)
	yield takeEvery(getLoggedUser, getLoggedUserSaga)
}

function* getTokenSaga({ payload }) {
	const { state, code, history } = payload
	try {
		const { data } = yield call(api.get, '/auth/callback', {
			params: {
				state,
				code,
			},
		})

		api.defaults.headers['Authorization'] = `Bearer ${data.access_token}`
		yield put(getJWTSuccess(data))
		yield put(getLoggedUserSuccess(data.user))
		history.push('/')
	} catch (error) {
		yield put(getJWTFailure(error))
	}
}

function* logoutSaga() {
	try {
		yield put(logoutSuccess())
		window.location.replace(process.env.REACT_APP_API_SIGN_IN_URL)
	} catch (error) {
		yield put(logoutFailure(error))
	}
}

function* getLoggedUserSaga() {
	try {
		const url = '/users/me'
		const { data } = yield call(api.get, url)
		yield put(getLoggedUserSuccess(data))
	} catch {}
}

export function setToken({ payload }) {
	if (!payload) return

	const { token } = payload.session

	if (token) {
		api.defaults.headers['Authorization'] = `Bearer ${token}`
	}
}
