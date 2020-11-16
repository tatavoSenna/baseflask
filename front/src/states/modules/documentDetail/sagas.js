import { all, call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import {
	getDocumentDetail,
	getDocumentDetailSuccess,
	getDocumentDetailFailure,
	previousStep,
	previousStepSuccess,
	previousStepFailure,
	nextStep,
	nextStepSuccess,
	nextStepFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getDocumentDetail, getDocumentDetailSaga)
	yield takeEvery(previousStep, previousStepSaga)
	yield takeEvery(nextStep, nextStepSaga)
}

function* getDocumentDetailSaga({ payload = {} }) {
	const { id } = payload
	try {
		const [detail, detailText] = yield all([
			call(api.get, `/documents/${id}`),
			call(api.get, `/documents/${id}/text`),
		])
		yield put(getDocumentDetailSuccess({ ...detail.data, ...detailText.data }))
	} catch (error) {
		yield put(getDocumentDetailFailure(error))
	}
}

function* previousStepSaga({ payload }) {
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/previous`)
		yield put(previousStepSuccess(response.data))
	} catch (error) {
		yield put(previousStepFailure(error))
	}
}

function* nextStepSaga({ payload = {} }) {
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/next`)
		yield put(nextStepSuccess(response.data))
	} catch (error) {
		yield put(nextStepFailure(error))
	}
}
