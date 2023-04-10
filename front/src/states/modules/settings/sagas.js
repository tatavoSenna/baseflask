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
	getStripePlan,
	getStripePlanSuccess,
	getStripePlanFailure,
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
	editWebhooks,
	editWebhooksSuccess,
	editWebhooksFailure,
	uploadStripePlan,
	uploadStripePlanSuccess,
	uploadStripePlanFailure,
	uploadStripePlanPortal,
	uploadStripePlanPortalSuccess,
	uploadStripePlanPortalFailure,
} from '.'
import Axios from 'axios'

export default function* rootSaga() {
	yield takeEvery(saveSettings, saveSettingsSaga)
	yield takeEvery(getSettings, getSettingsSaga)
	yield takeEvery(getWebhooks, getWebhooksSaga)
	yield takeEvery(saveWebhooks, saveWebhooksSaga)
	yield takeEvery(deleteWebhooks, deleteWebhooksSaga)
	yield takeEvery(editWebhooks, editWebhooksSaga)
	yield takeEvery(getStripePlan, getStripePlanSaga)
	yield takeEvery(uploadStripePlan, uploadStripePlanSaga)
	yield takeEvery(uploadStripePlanPortal, uploadStripePlanPortalSaga)
}

function* getSettingsSaga() {
	try {
		const { data } = yield call(api.get, `/company/download`)

		// checking if the url is valid
		const response = yield Axios.get(data.url)

		if (response) yield put(getSettingsSuccess(data.url))
	} catch (error) {
		yield put(getSettingsFailure(error))
	}
}

function* getStripePlanSaga() {
	try {
		const { data } = yield call(api.get, `/company/stripe_plan`)
		yield put(getStripePlanSuccess(data))
	} catch (error) {
		yield put(getStripePlanFailure(error))
	}
}

function* uploadStripePlanSaga({ payload }) {
	try {
		const response = yield call(api.post, `/company/checkout`, {
			price_id: payload,
		})
		window.location.href = response.data.url
		yield put(uploadStripePlanSuccess(response.data))
	} catch (error) {
		yield put(uploadStripePlanFailure(error))
	}
}

function* uploadStripePlanPortalSaga() {
	try {
		const response = yield call(api.post, `/company/portal`)
		window.location.href = response.data.url
		yield put(uploadStripePlanPortalSuccess(response.data))
	} catch (error) {
		yield put(uploadStripePlanPortalFailure(error))
	}
}

function* saveSettingsSaga({ payload }) {
	try {
		loadingMessage({
			content: 'Salvando dados...',
			updateKey: 'saveSettings',
		})

		yield call(api.post, `/company/upload`, payload)
		successMessage({
			content: 'Dados salvos com sucesso',
			updateKey: 'saveSettings',
		})

		yield put(saveSettingsSuccess())
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
	} catch (error) {
		errorMessage({
			content: 'Problemas ao deletar webhook',
			updateKey: 'deleteWebhook',
		})
		yield put(deleteWebhooksFailure(error))
	}
}

function* editWebhooksSaga({ payload }) {
	loadingMessage({
		content: 'Editando webhook...',
		updateKey: 'editWebhook',
	})

	try {
		yield call(api.post, `/company/webhook/edit/${payload.id}`, {
			url: payload.url,
			docx: payload.docx,
			pdf: payload.pdf,
		})
		successMessage({
			content: 'Webhook editado com sucesso',
			updateKey: 'editWebhook',
		})
		yield put(editWebhooksSuccess())
		yield put(getWebhooks())
	} catch (error) {
		yield put(editWebhooksFailure(error))
		errorMessage({
			content: 'Problemas ao editar webhook',
			updateKey: 'editWebhook',
		})
	}
}
