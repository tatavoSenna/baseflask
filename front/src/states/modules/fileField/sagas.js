import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios'
import { appendAnswer } from '~/states/modules/answer'
import { fileUploadRequest, fileUploadSuccess, fileUploadFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(fileUploadRequest, fileUploadRequestSaga)
}

function* fileUploadRequestSaga({ payload = {} }) {
	const { file, url } = payload

	try {
		const formData = new FormData()
		formData.append('body', file, file.name)

		const response = yield axios.post(url, formData)
		const data = response.data.body

		yield put(fileUploadSuccess(data))
		yield put(appendAnswer({ data }))
	} catch (error) {
		yield put(fileUploadFailure(error))
	}
}
