import { call, put, takeEvery, select } from 'redux-saga/effects'

import api from '~/services/api'
import {
	verifyToken,
	verifyTokenSuccess,
	verifyTokenFailure,
	createContractExternal,
	createContractExternalSuccess,
	createContractExternalFailure,
} from '.'
import { listQuestionSuccess } from '../question'
import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'

export default function* rootSaga() {
	yield takeEvery(verifyToken, verifyTokenSaga)
	yield takeEvery(createContractExternal, createContractExternalSaga)
}

function* verifyTokenSaga({ payload = {} }) {
	const { token } = payload

	try {
		const { data } = yield call(api.post, `/external/authorize`, {
			token,
		})

		yield put(
			verifyTokenSuccess({
				data: { ...data, token, ...data.Template },
			})
		)
		const modelId = data.Template.id
		const title = 'Meu processo'
		const parent = null
		const templateData = data.Template
		yield put(
			listQuestionSuccess({ modelId, title, parent, data: templateData })
		)
	} catch (error) {
		yield put(verifyTokenFailure(error))
	}
}

function* createContractExternalSaga({ payload }) {
	loadingMessage({
		content: 'Nossos robôs estão trabalhando para gerar seu documento',
		updateKey: 'createContractExternal',
	})

	const { data, dataImg } = yield select((state) => {
		const { answer } = state
		return answer
	})

	const { token, visible } = payload

	try {
		yield call(api.post, '/external/create', {
			token,
			variables: { ...data, ...dataImg },
			visible,
		})
		yield put(createContractExternalSuccess())
		successMessage({
			content: 'Documento criado com sucesso!',
			updateKey: 'createContractExternal',
		})
	} catch (error) {
		yield put(createContractExternalFailure(error))
		errorMessage({
			content: 'A criação do documento falhou',
			updateKey: 'createContractExternal',
		})
	}
}
