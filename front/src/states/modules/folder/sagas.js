import { call, put, select, takeEvery } from 'redux-saga/effects'

import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'
import api from '~/services/api'
import {
	listFolder,
	listFolderSuccess,
	listFolderFailure,
	createFolder,
	createFolderSuccess,
	createFolderFailure,
	resetNewFolder,
	setSelectChildren,
	setSelectChildrenSuccess,
	setSelectChildrenFailure,
	setMoveFolder,
	setMoveFolderSuccess,
	setMoveFolderFailure,
	listFoldersSource,
} from '.'
import { listContract } from '~/states/modules/contract'

export default function* rootSaga() {
	yield takeEvery(createFolder, createFolderSaga)
	yield takeEvery(listFolder, getFolderSaga)
	yield takeEvery(setSelectChildren, getChildrenFolderSaga)
	yield takeEvery(setMoveFolder, setMoveFolderSaga)
}

function* createFolderSaga({ payload = {} }) {
	loadingMessage({
		content: 'Criando pasta...',
		updateKey: 'createFolderSaga',
	})
	const { folder } = yield select()
	const { newFolder = {} } = folder
	const { parent } = payload

	try {
		const { data } = yield call(api.post, `/documents/`, {
			is_folder: true,
			parent: parent,
			title: newFolder.title,
		})
		yield put(
			createFolderSuccess({
				link: `${process.env.REACT_APP_BASE_URL}/documentcreate/${data.token}`,
			})
		)
		successMessage({
			content: 'Pasta criada com sucesso.',
			updateKey: 'createFolderSaga',
		})
		yield put(listContract({ parent: parent }))
	} catch (error) {
		yield put(createFolderFailure(error))
		errorMessage({
			content: error.response.data.error,
			updateKey: 'createFolderSaga',
		})
	}
	yield put(resetNewFolder())
}

function* getFolderSaga({ payload = {} }) {
	let url = '/documents/?type=folder'

	const { source } = payload
	try {
		const { data } = yield call(api.get, url)

		if (source) {
			yield put(listFoldersSource(data))
		} else {
			yield put(listFolderSuccess(data))
		}
	} catch (error) {
		yield put(listFolderFailure(error))
	}
}

function* getChildrenFolderSaga({ payload = {} }) {
	const { parent } = payload
	let url = '/documents/?type=folder'
	if (parent) {
		url = `/documents/?type=folder&folder=${parent}`
	}
	try {
		const { data } = yield call(api.get, url)
		yield put(setSelectChildrenSuccess({ ...data, parent: parent }))
	} catch (error) {
		yield put(setSelectChildrenFailure(error))
	}
}

function* setMoveFolderSaga({ payload = {} }) {
	const { document_id, destination_id, parent } = payload
	try {
		yield call(api.post, '/documents/move', {
			document_id,
			destination_id,
		})
		successMessage({
			content: 'Movido com sucesso.',
			updateKey: 'moveDocSaga',
		})
		yield put(setMoveFolderSuccess())
		yield put(listContract({ parent: parent }))
	} catch (error) {
		yield put(setMoveFolderFailure(error))
		errorMessage({
			content: error.response.data.error,
			updateKey: 'moveDocSaga',
		})
	}
}
