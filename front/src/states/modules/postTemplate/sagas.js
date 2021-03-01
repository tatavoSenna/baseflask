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

function* postTemplateSaga() {
	loadingMessage({ content: 'Criando template...', updateKey: 'postTemplate' })

	const data = yield select((state) => {
		const { postTemplate } = state
		return postTemplate.data
	})

	const arrangedSigners = (signers) => {
		const signersArray = []
		signers.parties.map((party) =>
			party.partySigners.map((partySigner) => signersArray.push(partySigner))
		)
		return signersArray
	}

	try {
		const { post } = yield call(api.post, '/templates/', {
			title: data.title,
			form: JSON.parse(data.form),
			workflow: JSON.parse(data.workflow),
			signers: arrangedSigners(data.signers),
			text: data.text,
		})

		yield put(postTemplateSuccess(post))
		successMessage({
			content: 'Template criado com sucesso!',
			updateKey: 'postTemplate',
		})
		window.location.href = '/templates'
	} catch (error) {
		yield put(postTemplateFailure(error))
		errorMessage({
			content: 'A criação do template falhou',
			updateKey: 'postTemplate',
		})
	}
}
