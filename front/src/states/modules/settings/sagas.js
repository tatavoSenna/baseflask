import { call, put, select, takeEvery } from 'redux-saga/effects'

import {
	errorMessage,
	successMessage,
	loadingMessage,
} from '~/services/messager'

import api from '~/services/api'

import {
	saveSettings,
	saveSettingsSuccess,
	saveSettingsFailure,
	getSettings,
	getSettingsSuccess,
	getSettingsFailure,
	getWebhooks,
	getWebhooksSuccess,
	getWebhooksFailure,
	saveWebhooks,
	saveWebhooksSuccess,
	saveWebhooksFailure,
	deleteWebhooks,
	deleteWebhooksSuccess,
	deleteWebhooksFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(saveSettings, saveSettingsSaga)
	yield takeEvery(getSettings, getSettingsSaga)
	yield takeEvery(getWebhooks, getWebhooksSaga)
	yield takeEvery(saveWebhooks, saveWebhooksSaga)
	yield takeEvery(deleteWebhooks, deleteWebhooksSaga)
}

function* getSettingsSaga() {
	try {
		const { data } = yield call(api.get, `/company/download`)
		yield put(getSettingsSuccess(data))
	} catch (error) {
		yield put(getSettingsFailure(error))
	}
}

function* saveSettingsSaga({ payload }) {
	try {
		loadingMessage({
			content: 'Salvando dados...',
			updateKey: 'saveSettings',
		})

		const response = yield call(api.post, `/company/upload`, payload)
		successMessage({
			content: 'Dados salvos com sucesso',
			updateKey: 'saveSettings',
		})
		yield put(saveSettingsSuccess(response.data))
	} catch (error) {
		yield put(saveSettingsFailure(error))
		errorMessage({
			content: 'Problemas ao salvar dados',
			updateKey: 'saveSettings',
		})
	}
}

function* getWebhooksSaga() {
	try {
		const { data } = yield call(api.get, `/company/webhook`)
		yield put(getWebhooksSuccess(data))
	} catch (error) {
		yield put(getWebhooksFailure(error))
	}
}

function* saveWebhooksSaga({ payload }) {
	const { settings } = yield select()
	const { newWebhook = {} } = settings

	try {
		loadingMessage({
			content: 'Salvando dados...',
			updateKey: 'saveWebhooks',
		})
		const { data } = yield call(api.post, `/company/webhook`, {
			...newWebhook,
			...payload,
		})
		yield put(saveWebhooksSuccess(data))
		yield put(getWebhooks())
		successMessage({
			content: 'Webhook salvo com sucesso',
			updateKey: 'saveWebhooks',
		})
	} catch (error) {
		yield put(saveWebhooksFailure(error))
		errorMessage({
			content: 'Problemas ao salvar webhook',
			updateKey: 'saveWebhooks',
		})
	}
}

function* deleteWebhooksSaga({ payload }) {
	loadingMessage({
		content: 'Deletando usuário...',
		updateKey: 'deleteWebhook',
	})
	try {
		yield call(api.delete, `/company/webhook/${payload.id}`)
		successMessage({
			content: 'Webhook deletado com sucesso',
			updateKey: 'deleteWebhook',
		})
		yield put(deleteWebhooksSuccess())
		yield put(getWebhooks())
	} catch {
		errorMessage({
			content: 'Problemas ao deletar webhook',
			updateKey: 'deleteWebhook',
		})
		yield put(deleteWebhooksFailure(payload))
	}
}
