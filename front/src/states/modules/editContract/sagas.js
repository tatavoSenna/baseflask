import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { editContract, editContractSuccess, editContractFailure } from '.'
import { selectAllDocumentDetail } from '../documentDetail/selectors'
import { listQuestionSuccess } from '../question'

export default function* rootSaga() {
	yield takeEvery(editContract, editContractSaga)
}

function* editContractSaga({ payload = {} }) {
	const { id } = payload

	try {
		const { data } = yield call(api.get, `/documents/${id}`)

		const modelId = id
		const title = data.title
		const parent = data.parent
		const format = selectAllDocumentDetail(data)

		yield put(listQuestionSuccess({ modelId, title, parent, data: format }))
		yield put(editContractSuccess())
	} catch (error) {
		yield put(editContractFailure(error))
	}
}
