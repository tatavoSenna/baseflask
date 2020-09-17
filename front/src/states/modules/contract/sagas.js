import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import {
	listContract,
	listContractSuccess,
	listContractFailure,
	viewContract,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listContract, loginSaga)
	yield takeEvery(viewContract, viewSaga)
}

function* loginSaga({ payload = {} }) {
	const { perPage = 20, page = 1 } = payload
	try {
		const { data } = yield call(
			api.get,
			`/documents/?per_page=${perPage}&page=${page}`
		)

		yield put(listContractSuccess(data))
	} catch (error) {
		yield put(listContractFailure(error))
	}
}

function* viewSaga({ payload }) {
	const { documentId } = payload
	try {
		const { data } = yield call(
			api.get,
			`/documents/${documentId}/download`
		)
		window.open(data.download_url, '_blank')
	} catch (error) {
		// TODO: Show error
	}
}
