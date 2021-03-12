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

	const toObject = (arr) => {
		var obj = {}
		for (var i = 0; i < arr.length; ++i) obj[i] = arr[i]
		return obj
	}

	const arrangedSigners = (signers) => {
		const signersArray = []
		signers.parties.map((party) =>
			party.partySigners.map((partySigner) => signersArray.push(partySigner))
		)
		return signersArray
	}

	const workflow = {
		nodes: toObject(data.workflow.nodes),
		current_node: '0',
		created_by: '',
	}

	try {
		const { post } = yield call(api.post, '/templates/', {
			title: data.title,
			form: JSON.parse(data.form),
			workflow: workflow,
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
