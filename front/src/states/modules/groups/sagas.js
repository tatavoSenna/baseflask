import { call, put, select, takeEvery } from 'redux-saga/effects'
import { successMessage, loadingMessage } from '~/services/messager'

import api from '~/services/api'
import {
	getGroupList,
	getGroupListSuccess,
	createGroup,
	deleteGroup,
	resetNewGroup,
} from '.'
import { selectAllGroups } from './selectors'

export default function* rootSaga() {
	yield takeEvery(getGroupList, getGroupListSaga)
	yield takeEvery(createGroup, createGroupSaga)
	yield takeEvery(deleteGroup, deleteGroupSaga)
}

function* getGroupListSaga() {
	const url = '/groups'
	try {
		const { data } = yield call(api.get, url)
		const groupList = selectAllGroups(data.groups)
		yield put(getGroupListSuccess(groupList))
	} catch {}
}

function* createGroupSaga() {
	const { groups } = yield select()
	const { newGroup = {} } = groups

	loadingMessage({
		content: 'Criando novo grupo...',
		updateKey: 'createGroup',
	})
	try {
		yield call(api.post, '/groups', newGroup)
		successMessage({
			content: 'Grupo criado com sucesso',
			updateKey: 'createGroup',
		})
		yield put(getGroupList())
	} catch (error) { }
	yield put(resetNewGroup())
}

function* deleteGroupSaga({ payload }) {
	loadingMessage({
		content: 'Deletando grupo...',
		updateKey: 'deleteGroup',
	})
	try {
		yield call(api.delete, `/groups/${payload}`)
		successMessage({
			content: 'Grupo deletado com sucesso',
			updateKey: 'deleteGroup',
		})
		yield put(getGroupList())
	} catch (error) { }
}
