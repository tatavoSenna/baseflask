import { call, put, takeEvery, delay } from 'redux-saga/effects'
import api from '~/services/api'
import { getUserProfile, getUserProfileSuccess, getUserProfileFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(getUserProfile, getUserProfileSaga)
}

/**
 * Saga responsible for loading the user profile, specially when the user logs in.
 * @date 2021-11-30
 * @param payload: Contains the history object, so that this saga can control browser navigation.
 * @returns {any}
 */
function* getUserProfileSaga({ payload = {} }) {
	const { history } = payload
	const url = `/users/me`
	try {
		const { data } = yield call(api.get, url)
		yield put(getUserProfileSuccess(data))
		history.push('/documents')
	} catch (error) {
		yield put(getUserProfileFailure())

		// Call to the get profile endpoint probably failed because amplify auth is not yet complete
		// We wait 2 seconds and then retry by dispatching the same action.
		yield delay(2000)
		yield put(getUserProfile({ history }))
	}
}
