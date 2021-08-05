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
	getCompanyListFailure,
	addCompany,
	addCompanySuccess,
	addCompanyFailure,
	resetNewCompany,
	changeUserCompany,
	changeUserCompanySuccess,
	changeUserCompanyFailure,
} from '.'

import { setCompanyId } from '~/states/modules/session'

import { getSettings } from '~/states/modules/settings'

export default function* rootSaga() {
	yield takeEvery(getCompanyList, getCompanyListSaga)
	yield takeEvery(addCompany, addCompanySaga)
	yield takeEvery(changeUserCompany, changeUserCompanySaga)
}

function* getCompanyListSaga({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload

	const url = `/company/?per_page=${perPage}&page=${page}&search=${search}`
	try {
		const { data } = yield call(api.get, url)
		yield put(getCompanyListSuccess(data))
	} catch (error) {
		yield put(getCompanyListFailure(error))
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
		successMessage({
			content: 'Empresa adicionada com sucesso',
			updateKey: 'addCompany',
		})
		yield put(addCompanySuccess())
		yield put(getCompanyList())
	} catch (error) {
		errorMessage({
			content: error.response.data.error,
			updateKey: 'addCompany',
		})
		yield put(addCompanyFailure(error))
	}
	yield put(resetNewCompany())
}

function* changeUserCompanySaga({ payload = {} }) {
	loadingMessage({
		content: 'Trocando o usuário de Empresa...',
		updateKey: 'changeUserCompany',
	})

	try {
		const { data } = yield call(api.post, '/company/join', {
			new_id: payload.id,
		})
		successMessage({
			content: 'Empresa do usuário trocada com sucesso',
			updateKey: 'changeUserCompany',
		})
		yield put(setCompanyId(data))
		yield put(changeUserCompanySuccess(data))
		yield put(getSettings())
	} catch (error) {
		errorMessage({
			content: error.response.data.error,
			updateKey: 'changeUserCompany',
		})
		yield put(changeUserCompanyFailure(error))
	}
}
