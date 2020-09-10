import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import api from '~/services/api'
import { setDocusignRequest } from '.'

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
		history.push('/')
	} catch (error) {
		history.push('/')
	}
}
