import { call, put, takeEvery } from 'redux-saga/effects'

import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'
import api from '~/services/api'
import {
	listDatabases,
	listAllDatabases,
	listDatabasesSuccess,
	listDatabasesFailure,
	createDatabase,
	createDatabaseSuccess,
	createDatabaseFailure,
	deleteDatabase,
	deleteDatabaseSuccess,
	deleteDatabaseFailure,
	listTags,
	listTagsSuccess,
	listTagsFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(listDatabases, fetchDatabases)
	yield takeEvery(listAllDatabases, fetchAllDatabases)
	yield takeEvery(createDatabase, createDatabaseSaga)
	yield takeEvery(deleteDatabase, deleteDatabaseSaga)
	yield takeEvery(listTags, listTagsSaga)
}

function* fetchDatabases({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload
	try {
		const { data } = yield call(
			api.get,
			`/internaldbs/?per_page=${perPage}&page=${page}&search=${search}`
		)

		yield put(listDatabasesSuccess(data))
	} catch (error) {
		yield put(listDatabasesFailure(error))
	}
}

function* fetchAllDatabases() {
	try {
		const { data } = yield call(api.get, `/internaldbs/`)

		yield put(listDatabasesSuccess(data))
	} catch (error) {
		yield put(listDatabasesFailure(error))
	}
}

function* createDatabaseSaga({ payload = {} }) {
	const { title, history } = payload
	loadingMessage({
		content: 'Criando banco de textos...',
		updateKey: 'createDatabase',
	})

	try {
		const { data } = yield call(api.post, '/internaldbs/', {
			title,
		})

		yield put(createDatabaseSuccess())
		successMessage({
			content: 'Banco de textos criado com sucesso!',
			updateKey: 'createDatabase',
		})

		history.push({
			pathname: `/databases/${data.id}`,
		})
	} catch (error) {
		yield put(createDatabaseFailure(error))
		errorMessage({
			content: 'A criação do banco de textos falhou',
			updateKey: 'createDatabase',
		})
	}
}

function* deleteDatabaseSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo base de textos...',
		updateKey: 'deleteDatabase',
	})
	const { id, pages } = payload
	const { perPage = 10, page = 1, search = '' } = pages
	try {
		yield call(api.delete, `/internaldbs/${id}`)
		const { data } = yield call(
			api.get,
			`/internaldbs/?per_page=${perPage}&page=${page}&search=${search}`
		)
		yield put(deleteDatabaseSuccess(data))
		successMessage({
			content: 'Base de textos excluído com sucesso.',
			updateKey: 'deleteDatabase',
		})
	} catch (error) {
		yield put(deleteDatabaseFailure(error))
		errorMessage({
			content: 'Exclusão da base de textos falhou.',
			updateKey: 'deleteDatabase',
		})
	}
}

function* listTagsSaga({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload
	try {
		const { data } = yield call(
			api.get,
			`/company/tags?per_page=${perPage}&page=${page}&search=${search}`
		)

		yield put(listTagsSuccess(data))
	} catch (error) {
		yield put(listTagsFailure(error))
	}
}
