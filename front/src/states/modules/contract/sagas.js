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
	deleteFolder,
	deleteSelected,
	deleteSuccess,
	deleteFailure,
	viewContract,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listContract, loginSaga)
	yield takeEvery(createLink, createLinkSaga)
	yield takeEvery(deleteContract, deleteContractSaga)
	yield takeEvery(deleteFolder, deleteFolderSaga)
	yield takeEvery(deleteSelected, deleteSelectedSaga)
	yield takeEvery(viewContract, viewSaga)
}

function* loginSaga({ payload = {} }) {
	const {
		perPage = 10,
		page = 1,
		search = '',
		parent,
		order_by,
		order,
	} = payload
	let url = `/documents/?per_page=${perPage}&page=${page}&search=${search}`
	if (parent) {
		url = `/documents/?per_page=${perPage}&page=${page}&search=${search}&folder=${parent}`
	}
	if (order_by && order) {
		url = `/documents/?per_page=${perPage}&page=${page}&search=${search}&order_by=${order_by}&order=${order}`
		if (parent) {
			url = `/documents/?per_page=${perPage}&page=${page}&search=${search}&folder=${parent}&order_by=${order_by}&order=${order}`
		}
	}
	try {
		let { data } = yield call(api.get, url)
		if (parent) {
			data.parent = parent
		}
		if (order && order_by) {
			data.order_by = order_by
			data.order = order
		}

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
	const { modelId, title, maxUses } = payload
	try {
		const { data } = yield call(api.post, `/external/token`, {
			document_template: modelId,
			title,
			max_uses: maxUses,
		})
		yield put(
			createLinkSuccess({
				link: `${process.env.REACT_APP_BASE_URL}/documentcreate/${data.token}`,
			})
		)
		successMessage({
			content: 'Link criado com sucesso.',
			updateKey: 'createLinkSaga',
		})
	} catch (error) {
		yield put(createLinkFailure(error))
		errorMessage({
			content: 'Criação do link falhou.',
			updateKey: 'createLinkSaga',
		})
	}
}

function* deleteContractSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo documento...',
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
		yield put(deleteSuccess(data))
		successMessage({
			content: 'Documento excluído com sucesso.',
			updateKey: 'deleteContractSaga',
		})
	} catch (error) {
		yield put(deleteFailure(error))
		errorMessage({
			content: 'Falha ao excluir documento.',
			updateKey: 'deleteContractSaga',
		})
	}
}

function* deleteFolderSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo pasta...',
		updateKey: 'deleteFolderSaga',
	})
	const { id, pages } = payload
	const { perPage = 10, page = 1, search = '' } = pages
	try {
		yield call(api.delete, `/documents/${id}`)
		const { data } = yield call(
			api.get,
			`/documents/?per_page=${perPage}&page=${page}&search=${search}`
		)
		yield put(deleteSuccess(data))
		successMessage({
			content: 'Pasta excluída com sucesso.',
			updateKey: 'deleteFolderSaga',
		})
	} catch (error) {
		yield put(deleteFailure(error))
		errorMessage({
			content: 'Falha ao excluir pasta.',
			updateKey: 'deleteFolderSaga',
		})
	}
}

function* deleteSelectedSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo itens selecionados...',
		updateKey: 'deleteSelectedSaga',
	})
	const { ids, pages } = payload
	const { perPage = 10, page = 1, search = '' } = pages
	try {
		yield call(api.delete, '/documents/', { data: { document_ids: ids } })
		const { data } = yield call(
			api.get,
			`/documents/?per_page=${perPage}&page=${page}&search=${search}`
		)
		yield put(deleteSuccess(data))
		successMessage({
			content: 'Seleção excluída com sucesso.',
			updateKey: 'deleteSelectedSaga',
		})
	} catch (error) {
		yield put(deleteFailure(error))
		errorMessage({
			content: 'Falha ao excluir seleção.',
			updateKey: 'deleteSelectedSaga',
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
