import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import api from '~/services/api'
import {
	login,
	loginFailure,
	loginSuccess,
	logout,
	logoutFailure,
	logoutSuccess,
} from '.'

export default function* rootSaga() {
	yield takeLatest('persist/REHYDRATE', setToken)
	yield takeEvery(login, loginSaga)
	yield takeEvery(logout, logoutSaga)
}

function* loginSaga({ payload }) {
	const { email, password, history } = payload
	try {
		const { data } = yield call(api.post, '/auth/login', {
			email,
			password,
		})

		api.defaults.headers['X-Auth-Token'] = data.token

		yield put(loginSuccess(data))
		history.push('/')
	} catch (error) {
		yield put(loginFailure(error))
	}
}

function* logoutSaga({ payload }) {
	const { history } = payload
	try {
		yield put(logoutSuccess())
		history.push('/login')
	} catch (error) {
		yield put(logoutFailure(error))
	}
}

export function setToken({ payload }) {
	if (!payload) return

	const { token } = payload.session

	if (token) {
		api.defaults.headers['X-Auth-Token'] = token
	}
}
