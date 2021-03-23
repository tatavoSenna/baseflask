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
	deleteTemplate,
	deleteTemplateSuccess,
	deleteTemplateFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listTemplate, fetchTemplates)
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

function* deleteTemplateSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo template...',
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
			content: 'Template excluído com sucesso.',
			updateKey: 'deleteTemplateSaga',
		})
	} catch (error) {
		yield put(deleteTemplateFailure(error))
		errorMessage({
			content: 'Exclusão do template falhou.',
			updateKey: 'deleteTemplateSaga',
		})
	}
}
