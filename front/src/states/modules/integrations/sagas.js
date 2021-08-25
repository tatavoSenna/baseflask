import { call, put, takeEvery } from 'redux-saga/effects'

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
	try {
		const { data } = yield call(api.get, `/company/docusign`)
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
		const response = yield call(api.post, `/company/docusign`, payload)
		successMessage({
			content: 'Dados salvo com sucesso',
			updateKey: 'saveIntegrations',
		})
		yield put(saveIntegrationSuccess(response.data))
	} catch (error) {
		console.log(error)
		yield put(saveIntegrationFailure(error))
		errorMessage({
			content: 'Problemas ao salvar dados',
			updateKey: 'saveIntegrations',
		})
	}
}
