import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import { setDocusignRequest, setDocusignSuccess, setDocusignFailure } from '.'

export default function* rootSaga() {
	yield takeEvery(setDocusignRequest, setDocusignSaga)
}

function* setDocusignSaga({ payload }) {
	const { code, history } = payload
	try {
		const { data } = yield call(api.get, '/docusign/token', {
			params: {
				code,
			},
		})
		yield put(setDocusignSuccess(data))
		history.push('/')
	} catch (error) {
		yield put(setDocusignFailure(error))
		history.push('/')
	}
}
