import { call, put, takeEvery } from 'redux-saga/effects'

import { loadingMessage, errorMessage } from '~/services/messager'
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
	loadingMessage({
		content: 'O download começará em instantes...',
		updateKey: 'viewSaga',
	})
	const { documentId } = payload
	try {
		const { data } = yield call(api.get, `/documents/${documentId}/download`)
		window.open(data.download_url, '_blank')
	} catch (error) {
		errorMessage({
			content: 'Falha na conexão com o servidor. Tente novamente mais tarde.',
			updateKey: 'viewSaga',
		})
	}
}
