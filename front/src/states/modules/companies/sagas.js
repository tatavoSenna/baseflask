import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
	successMessage,
	loadingMessage,
	errorMessage,
} from '~/services/messager'

import api from '~/services/api'
import {
	getCompanyList,
	getCompanyListSuccess,
	addCompany,
	resetNewCompany,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getCompanyList, getCompanyListSaga)
	yield takeEvery(addCompany, addCompanySaga)
}

function* getCompanyListSaga({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload

	const url = `/company/?per_page=${perPage}&page=${page}&search=${search}`
	try {
		const { data } = yield call(api.get, url)
		yield put(getCompanyListSuccess(data))
	} catch (error) {
		console.log(error)
	}
}

function* addCompanySaga() {
	const { companies } = yield select()
	const { newCompany = {} } = companies
	const createdCompany = {}
	loadingMessage({
		content: 'Adicionando uma nova empresa...',
		updateKey: 'addCompany',
	})
	createdCompany['company_name'] = newCompany.name
	try {
		yield call(api.post, '/company/', createdCompany)
		console.log('newCompany:', newCompany.name)
		successMessage({
			content: 'Empresa adicionada com sucesso',
			updateKey: 'addCompany',
		})
		yield put(getCompanyList())
	} catch (error) {
		errorMessage({
			content: error.response.data.error,
			updateKey: 'addCompany',
		})
	}
	yield put(resetNewCompany())
}
