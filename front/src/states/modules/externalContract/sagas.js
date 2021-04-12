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
	} catch (error) {
		yield put(verifyTokenFailure(error))
	}
}

function* createContractExternalSaga() {
	loadingMessage({
		content: 'Nossos robôs estão trabalhando para gerar seu documento',
		updateKey: 'createContractExternal',
	})

	const { answer, id, token } = yield select((state) => {
		const {
			answer,
			externalContract: { data },
		} = state
		return { answer, id: data.id, token: data.token }
	})

	try {
		yield call(api.post, '/external/create', {
			document_template: id,
			token,
			variables: answer.data,
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
