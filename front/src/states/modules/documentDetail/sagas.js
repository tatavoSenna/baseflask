import { all, call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import {
	getDocumentDetail,
	getDocumentDetailSuccess,
	getDocumentDetailFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getDocumentDetail, getDocumentDetailSaga)
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
