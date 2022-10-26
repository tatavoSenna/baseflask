import { call, put, takeEvery, select } from 'redux-saga/effects'

import api from '~/services/api'
import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'

import {
	answerRequest,
	answerModify,
	answerSuccess,
	answerFailure,
	setResetAnswer,
} from '.'

import { setResetQuestion } from '~/states/modules/question'
import { selectVisibleAnswers } from './selectors'

export default function* rootSaga() {
	yield takeEvery(answerRequest, answerSaga)
	yield takeEvery(answerModify, answerModifySaga)
}

function* answerSaga({ payload }) {
	const { history, draft } = payload

	loadingMessage({
		content: 'Nossos robôs estão trabalhando para gerar seu documento',
		updateKey: 'answer',
	})

	const { answer, modelId, title, parent, pages, visible } = yield select(
		(state) => {
			const {
				answer,
				question: { modelId, title, parent, data: pages, visible },
			} = state
			return { answer, modelId, title, parent, pages, visible }
		}
	)

	try {
		const { data } = yield call(api.post, '/documents/', {
			document_template: modelId,
			parent: parent,
			title,
			visible,
			draft,
			variables: selectVisibleAnswers(answer.data, pages, visible),
		})
		yield put(answerSuccess(data))
		successMessage({
			content: 'Documento criado com sucesso!',
			updateKey: 'answer',
		})
		history.push(`/documents/${data.id}`)
		yield put(setResetAnswer())
		yield put(setResetQuestion())
	} catch (error) {
		yield put(answerFailure(error))
		errorMessage({
			content: 'A criação do documento falhou',
			updateKey: 'answer',
		})
	}
}

function* answerModifySaga({ payload }) {
	const { id, history, draft } = payload

	loadingMessage({
		content: 'Nossos robôs estão trabalhando para gerar seu documento',
		updateKey: 'answer',
	})

	const { answer, pages, visible } = yield select((state) => {
		const {
			answer,
			question: { modelId, title, parent, data: pages, visible },
		} = state
		return { answer, modelId, title, parent, pages, visible }
	})

	try {
		const { data } = yield call(api.post, `documents/${id}/modify`, {
			variables: selectVisibleAnswers(answer.data, pages, visible),
			visible,
			draft,
		})

		yield put(answerSuccess(data))
		successMessage({
			content: 'Edição do documento feito com sucesso!',
			updateKey: 'answer',
		})
		history.push(`/documents/${id}`)
		yield put(setResetAnswer())
		yield put(setResetQuestion())
	} catch (error) {
		console.log(error)
		yield put(answerFailure(error))
		errorMessage({
			content: 'A edição de documento falhou',
			updateKey: 'answer',
		})
	}
}
