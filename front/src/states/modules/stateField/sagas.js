import { call, put, takeEvery } from 'redux-saga/effects'

import axios from 'axios'
import { getStateField, getStateFieldSuccess, getStateFieldFailure } from '.'

const api = axios.create({
	baseURL: `https://servicodados.ibge.gov.br/api/v1/localidades/estados`,
})

export default function* rootSaga() {
	yield takeEvery(getStateField, getStateFieldSaga)
}

function* getStateFieldSaga() {
	try {
		const { data } = yield call(api.get)
		yield put(getStateFieldSuccess(data))
	} catch (error) {
		yield put(getStateFieldFailure(error))
	}
}
