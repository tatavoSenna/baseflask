import { call, put, takeEvery } from 'redux-saga/effects'

import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'
import api from '~/services/api'
import {
	listContract,
	listContractSuccess,
	listContractFailure,
	deleteContract,
	deleteContractSuccess,
	deleteContractFailure,
	viewContract,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listContract, loginSaga)
	yield takeEvery(deleteContract, deleteContractSaga)
	yield takeEvery(viewContract, viewSaga)
}

function* loginSaga({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload
	try {
		const { data } = yield call(
			api.get,
			`/documents/?per_page=${perPage}&page=${page}&search=${search}`
		)

		yield put(listContractSuccess(data))
	} catch (error) {
		yield put(listContractFailure(error))
	}
}

function* deleteContractSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo contrato...',
		updateKey: 'deleteContractSaga',
	})
	const { id, pages } = payload
	const { perPage = 10, page = 1, search = '' } = pages
	try {
		yield call(api.delete, `/documents/${id}`)
		const { data } = yield call(
			api.get,
			`/documents/?per_page=${perPage}&page=${page}&search=${search}`
		)
		yield put(deleteContractSuccess(data))
		successMessage({
			content: 'Contrato excluído com sucesso.',
			updateKey: 'deleteContractSaga',
		})
	} catch (error) {
		yield put(deleteContractFailure(error))
		errorMessage({
			content: 'Exclusão do contrato falhou.',
			updateKey: 'deleteContractSaga',
		})
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
		window.open(data.download_url, 'self')
	} catch (error) {}
}
