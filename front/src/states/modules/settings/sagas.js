import { call, put, takeEvery } from 'redux-saga/effects'

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
} from '.'

export default function* rootSaga() {
	yield takeEvery(saveSettings, saveSettingsSaga)
	yield takeEvery(getSettings, getSettingsSaga)
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
