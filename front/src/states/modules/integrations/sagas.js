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
	connectDocusign,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getIntegration, getIntegrationSaga)
	yield takeEvery(saveIntegration, saveIntegrationSaga)
	yield takeEvery(connectDocusign, connectDocusignSaga)
}

function* getIntegrationSaga() {
	try {
		const { data } = yield call(api.get, `/company/docusign`)
		yield put(getIntegrationSuccess(data))
	} catch (error) {
		yield put(getIntegrationFailure(error))
	}
}

function* connectDocusignSaga() {
	try {
		const { data } = yield call(api.get, `/company/docusign`)
		yield put(getIntegrationSuccess(data))
		if (data.company.docusign_integration_key) {
			return window.location.assign(
				process.env.REACT_APP_DOCUSIGN_OAUTH_URL +
					'/auth?response_type=code&scope=signature&client_id=' +
					data.company.docusign_integration_key +
					'&redirect_uri=' +
					process.env.REACT_APP_DOCUSIGN_REDIRECT_URL
			)
		} else {
			errorMessage({
				content:
					'Erro no Docusign, ajuste em Integração no menu de Configurações',
			})
		}
	} catch (error) {
		yield put(getIntegrationFailure(error))
		errorMessage({
			content: 'Oooops. Algo deu errado. Já notificamos nossos engenheiros.',
		})
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
