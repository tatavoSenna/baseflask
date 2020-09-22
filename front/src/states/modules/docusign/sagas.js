import { call, put, takeEvery } from 'redux-saga/effects'

import api from '~/services/api'
import {
	setDocusignRequest,
	setDocusignSuccess,
	setDocusignFailure,
	signContract,
} from '.'

export default function* rootSaga() {
	yield takeEvery(setDocusignRequest, setDocusignSaga)
	yield takeEvery(signContract, signContractSaga)
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

function* signContractSaga(action) {
	// yield put({type: LOADING_STARTED})
	const document_id = action.payload

	try {
		yield api.get(`/documents/${document_id}/sign`)
		console.log({ message: 'Processo de assinatura iniciado via docusign' })
	} catch (e) {
		console.log(
			'Houve um problema na comunicação com o Docusign.\n Por Favor tente mais tarde'
		)
		console.log(e)
	}
	// yield put({type: LOADING_FINISHED})
}
