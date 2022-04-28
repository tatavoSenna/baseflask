import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { apiRequest, apiRequestSuccess, apiRequestFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(apiRequest, apiRequestSaga)
}

function* apiRequestSaga({ payload = {} }) {
	const { url } = payload

	try {
		const response = yield axios.get(url)
		let data = response.data

		if (Array.isArray(data)) yield put(apiRequestSuccess({ url, data }))
		else throw new Error('Malformed data')
	} catch (error) {
		yield put(apiRequestFailure({ url, error }))
	}
}
