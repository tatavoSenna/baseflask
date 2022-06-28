import { call, put, takeEvery, select } from 'redux-saga/effects'

import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'

import api from '~/services/api'

import {
	getDetail,
	getDetailSuccess,
	getDetailFailure,
	getText,
	getTextSuccess,
	getTextFailure,
	listItems,
	listItemsSuccess,
	listItemsFailure,
	deleteItem,
	deleteItemFailure,
	editTitle,
	editTitleSuccess,
	editTitleFailure,
	editTextRequest,
	editTextSuccess,
	editTextFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getDetail, getDetailSaga)
	yield takeEvery(getText, getTextSaga)
	yield takeEvery(listItems, listItemsSaga)
	yield takeEvery(deleteItem, deleteItemSaga)
	yield takeEvery(editTitle, editTitleSaga)
	yield takeEvery(editTextRequest, editTextSaga)
}

function* getDetailSaga({ payload = {} }) {
	const { id: db_id } = payload
	try {
		const { data } = yield call(api.get, `/internaldbs/${db_id}`)

		yield put(getDetailSuccess(data))
	} catch (error) {
		yield put(getDetailFailure(error))
	}
}

function* listItemsSaga({ payload = {} }) {
	const { id: db_id } = payload

	try {
		const { data } = yield call(api.get, `/internaldbs/${db_id}/textitems`)

		yield put(listItemsSuccess(data))
	} catch (error) {
		yield put(listItemsFailure(error))
	}
}

function* deleteItemSaga({ payload = {} }) {
	loadingMessage({
		content: 'Excluindo texto...',
		updateKey: 'deleteItem',
	})
	const { id: item_id } = payload
	const database = yield select((state) => {
		const { databaseDetail } = state
		return databaseDetail.database
	})

	try {
		yield call(api.delete, `/internaldbs/textitem/${item_id}`)

		successMessage({
			content: 'Texto excluído com sucesso.',
			updateKey: 'deleteItem',
		})

		yield put(listItems({ id: database.id }))
	} catch (error) {
		yield put(deleteItemFailure(error))
		errorMessage({
			content: 'Exclusão do texto falhou.',
			updateKey: 'deleteItem',
		})
	}
}

function* getTextSaga({ payload = {} }) {
	const { id: item_id } = payload

	try {
		const { data } = yield call(api.get, `/internaldbs/textitem/${item_id}`)

		yield put(getTextSuccess(data))
	} catch (error) {
		yield put(getTextFailure(error))
	}
}

function* editTitleSaga() {
	loadingMessage({
		content: 'Renomeando banco de textos...',
		updateKey: 'editTitle',
	})

	const database = yield select((state) => {
		const { databaseDetail } = state
		return databaseDetail.database
	})

	try {
		const { patch } = yield call(api.patch, `/internaldbs/${database.id}`, {
			title: database.title,
		})

		yield put(editTitleSuccess(patch))
		successMessage({
			content: 'Banco de textos renomeado com sucesso!',
			updateKey: 'editTitle',
		})
	} catch (error) {
		yield put(editTitleFailure(error))
		errorMessage({
			content: 'Falha ao renomear banco de textos',
			updateKey: 'editTitle',
		})
	}
}

function* editTextSaga() {
	loadingMessage({
		content: 'Salvando texto...',
		updateKey: 'editText',
	})

	const { database, editedText } = yield select((state) => {
		const { databaseDetail } = state
		return databaseDetail
	})

	const data = {
		description: editedText.description,
		text: editedText.text,
	}

	try {
		if (editedText.id === 'new') {
			yield call(api.post, `/internaldbs/textitem`, {
				internal_database_id: database.id,
				...data,
			})
		} else {
			yield call(api.patch, `/internaldbs/textitem/${editedText.id}`, data)
		}

		yield put(editTextSuccess())
		successMessage({
			content: 'Texto salvo com sucesso!',
			updateKey: 'editText',
		})

		yield put(listItems({ id: database.id }))
	} catch (error) {
		yield put(editTextFailure(error))
		errorMessage({
			content: 'Falha ao salvar texto',
			updateKey: 'editText',
		})
	}
}
