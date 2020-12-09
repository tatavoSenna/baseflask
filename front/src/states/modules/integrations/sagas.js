import { call, put, select, takeEvery } from 'redux-saga/effects'

import {
	errorMessage,
	successMessage,
	loadingMessage,
} from '~/services/messager'

import api from '~/services/api'
import {
	getIntegration,
	getIntegrationSuccess,
	getIntegrationFailure,
	saveIntegration,
	saveIntegrationSuccess,
	saveIntegrationFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getIntegration, getIntegrationSaga)
	yield takeEvery(saveIntegration, saveIntegrationSaga)
}

function* getIntegrationSaga() {
	const { session } = yield select()
	try {
		const { data } = yield call(
			api.get,
			`/company/${session.loggedUser.companyId}/docusign`
		)
		yield put(getIntegrationSuccess(data))
	} catch (error) {
		yield put(getIntegrationFailure(error))
	}
}

function* saveIntegrationSaga({ payload }) {
	try {
		loadingMessage({
			content: 'Salvando dados...',
			updateKey: 'saveIntegrations',
		})
		const { session } = yield select()
		const response = yield call(
			api.post,
			`/company/${session.loggedUser.companyId}/docusign`,
			payload
		)
		successMessage({
			content: 'Dados salvo com sucesso',
			updateKey: 'saveIntegrations',
		})
		yield put(saveIntegrationSuccess(response.data))
	} catch (error) {
		yield put(saveIntegrationFailure(error))
		errorMessage({
			content: 'Problemas ao salvar dados',
			updateKey: 'saveIntegrations',
		})
	}
}
