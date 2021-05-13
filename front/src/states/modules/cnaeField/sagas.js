import { call, put, takeEvery } from 'redux-saga/effects'

import axios from 'axios'
import { getCnaeField, getCnaeFieldSuccess, getCnaeFieldFailure } from '.'

const api = axios.create({
	baseURL: `https://servicodados.ibge.gov.br/api/v2/cnae/classes`,
})

export default function* rootSaga() {
	yield takeEvery(getCnaeField, getCnaeFieldSaga)
}

function* getCnaeFieldSaga() {
	try {
		const { data } = yield call(api.get)
		yield put(getCnaeFieldSuccess(data))
	} catch (error) {
		yield put(getCnaeFieldFailure(error))
	}
}
