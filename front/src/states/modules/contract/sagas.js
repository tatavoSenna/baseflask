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
	createLink,
	createLinkSuccess,
	createLinkFailure,
	deleteContract,
	deleteContractSuccess,
	deleteContractFailure,
	viewContract,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listContract, loginSaga)
	yield takeEvery(createLink, createLinkSaga)
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

function* createLinkSaga({ payload = {} }) {
	loadingMessage({
		content: 'Criando link externo...',
		updateKey: 'createLinkSaga',
	})
	const { modelId, title } = payload
	try {
		const { data } = yield call(api.post, `/external/token`, {
			document_template: modelId,
			title,
		})
		yield put(
			createLinkSuccess({
				link: `${process.env.REACT_APP_BASE_URL}/documentcreate/${data.token}`,
			})
		)
		successMessage({
			content: 'Contrato excluído com sucesso.',
			updateKey: 'createLinkSaga',
		})
	} catch (error) {
		yield put(createLinkFailure(error))
		errorMessage({
			content: 'Exclusão do contrato falhou.',
			updateKey: 'createLinkSaga',
		})
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
