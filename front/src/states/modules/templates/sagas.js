import { call, put, takeEvery } from 'redux-saga/effects'

import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'
import api from '~/services/api'
import {
	listTemplate,
	listTemplateSuccess,
	listTemplateFailure,
	publishTemplate,
	publishTemplateSuccess,
	publishTemplateFailure,
	duplicateTemplate,
	duplicateTemplateSuccess,
	duplicateTemplateFailure,
	favorteTemplate,
	favoriteTemplateSuccess,
	favoriteTemplateFailure,
	deleteTemplate,
	deleteTemplateSuccess,
	deleteTemplateFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listTemplate, fetchTemplates)
	yield takeEvery(publishTemplate, publishTemplateSaga)
	yield takeEvery(duplicateTemplate, duplicateTemplateSaga)
	yield takeEvery(favorteTemplate, favoriteTemplateSaga)
	yield takeEvery(deleteTemplate, deleteTemplateSaga)
}

function* fetchTemplates({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload
	try {
		const { data } = yield call(
			api.get,
			`/templates/?per_page=${perPage}&page=${page}&search=${search}`
		)

		yield put(listTemplateSuccess(data))
	} catch (error) {
		yield put(listTemplateFailure(error))
	}
}

function* publishTemplateSaga({ payload = {} }) {
	const { id, status } = payload
	const message = status
		? ['Publicando', 'publicado', 'Publicação']
		: ['Despublicando', 'despublicado', 'Despublicação']

	loadingMessage({
		content: `${message[0]} modelo...`,
		updateKey: 'publishTemplateSaga',
	})

	try {
		const { data } = yield call(api.patch, `/templates/${id}/publish`, {
			status: status,
		})
		yield put(publishTemplateSuccess(data))
		successMessage({
			content: `Modelo ${message[1]} com sucesso.`,
			updateKey: 'publishTemplateSaga',
		})
	} catch (error) {
		yield put(publishTemplateFailure(error))
		errorMessage({
			content: `${message[2]} do modelo falhou.`,
			updateKey: 'publishTemplateSaga',
		})
	}
}

function* duplicateTemplateSaga({ payload = {} }) {
	const { id, companyId, pages, targetId } = payload
	const { perPage = 10, page = 1, search = '' } = pages

	try {
		let response = yield call(api.post, `/templates/${id}/duplicate`, {
			company_id: parseInt(targetId),
		})
		if (`${companyId}` === targetId || companyId === targetId) {
			response = yield call(
				api.get,
				`/templates/?per_page=${perPage}&page=${page}&search=${search}`
			)
		}
		yield put(duplicateTemplateSuccess(response.data))
		successMessage({
			content: `Modelo duplicado com sucesso.`,
			updateKey: 'duplicateTemplateSaga',
		})
	} catch (error) {
		yield put(duplicateTemplateFailure(error))
		errorMessage({
			content: `Erro ao duplicar o modelo.`,
			updateKey: 'duplicateTemplateSaga',
		})
	}
}

function* favoriteTemplateSaga({ payload = {} }) {
	const { id, status } = payload
	const message = status
		? ['Adicionando', 'adicionado', 'Adição']
		: ['Removendo', 'removido', 'Remoção']

	loadingMessage({
		content: `${message[0]} modelo favorito...`,
		updateKey: 'favoriteTemplateSaga',
	})

	try {
		const { data } = yield call(api.patch, `/templates/${id}/favorite`, {
			status: status,
		})
		yield put(favoriteTemplateSuccess(data))
		successMessage({
			content: `Modelo favorito ${message[1]} com sucesso.`,
			updateKey: 'favoriteTemplateSaga',
		})
	} catch (error) {
		yield put(favoriteTemplateFailure(error))
		errorMessage({
			content: `${message[2]} do modelo favorito falhou.`,
			updateKey: 'favoriteTemplateSaga',
		})
	}
}

function* deleteTemplateSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo modelo...',
		updateKey: 'deleteTemplateSaga',
	})
	const { id, pages } = payload
	const { perPage = 10, page = 1, search = '' } = pages
	try {
		yield call(api.delete, `/templates/${id}`)
		const { data } = yield call(
			api.get,
			`/templates/?per_page=${perPage}&page=${page}&search=${search}`
		)
		yield put(deleteTemplateSuccess(data))
		successMessage({
			content: 'Modelo excluído com sucesso.',
			updateKey: 'deleteTemplateSaga',
		})
	} catch (error) {
		yield put(deleteTemplateFailure(error))
		errorMessage({
			content: 'Exclusão do modelo falhou.',
			updateKey: 'deleteTemplateSaga',
		})
	}
}
