import { call, put, takeEvery, select } from 'redux-saga/effects'

import api from '~/services/api'
import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'

import {
	postTemplateRequest,
	postTemplateSuccess,
	postTemplateFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(postTemplateRequest, postTemplateSaga)
}

function* postTemplateSaga({ payload }) {
	const { history } = payload

	loadingMessage({ content: 'Criando template...', updateKey: 'postTemplate' })

	const data = yield select((state) => {
		const { postTemplate } = state
		return postTemplate.data
	})

	try {
		const { post } = yield call(api.post, '/templates/', {
			title: data.title,
			form: JSON.parse(data.form),
			workflow: JSON.parse(data.workflow),
			signers: JSON.parse(data.signers),
			text: data.text,
		})

		yield put(postTemplateSuccess(post))
		successMessage({
			content: 'Template criado com sucesso!',
			updateKey: 'postTemplate',
		})
		history.push('/templates')
	} catch (error) {
		yield put(postTemplateFailure(error))
		errorMessage({
			content: 'A criação do template falhou',
			updateKey: 'postTemplate',
		})
	}
}
