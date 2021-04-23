import { call, put, takeEvery, select } from 'redux-saga/effects'

import api from '~/services/api'
import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'

import { answerRequest, answerSuccess, answerFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(answerRequest, answerSaga)
}

function* answerSaga({ payload }) {
	const { history } = payload

	loadingMessage({
		content: 'Nossos robôs estão trabalhando para gerar seu documento',
		updateKey: 'answer',
	})

	const { answer, modelId, title } = yield select((state) => {
		const {
			answer,
			question: { modelId, title },
		} = state
		return { answer, modelId, title }
	})

	try {
		let dataImg = {}
		let objectData = answer.data

		for (var [key] of Object.entries(objectData)) {
			if (key.includes('image_')) {
				dataImg[key] = document
					.getElementById(key)
					.getElementsByTagName('input')[0].value
			}
		}
		const { data } = yield call(api.post, '/documents/', {
			document_template: modelId,
			title,
			variables: { ...answer.data, ...dataImg },
		})
		yield put(answerSuccess(data))
		successMessage({
			content: 'Documento criado com sucesso!',
			updateKey: 'answer',
		})
		history.push('/')
	} catch (error) {
		yield put(answerFailure(error))
		errorMessage({
			content: 'A criação do documento falhou',
			updateKey: 'answer',
		})
	}
}
