import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
	successMessage,
	loadingMessage,
	errorMessage,
} from '~/services/messager'

import api from '~/services/api'
import {
	getUserList,
	getUserListSuccess,
	createUser,
	deleteUser,
	resetNewUser,
	updateUser,
	resendInvite,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getUserList, getUserListSaga)
	yield takeEvery(createUser, createUserSaga)
	yield takeEvery(updateUser, updateUserSaga)
	yield takeEvery(deleteUser, deleteUserSaga)
	yield takeEvery(resendInvite, resendInviteSaga)
}

function* getUserListSaga({ payload = {} }) {
	const { perPage = 10, page = 1, search = '' } = payload

	const url = `/users?per_page=${perPage}&page=${page}&search=${search}`
	try {
		const { data } = yield call(api.get, url)
		yield put(getUserListSuccess(data))
	} catch {}
}

function* createUserSaga() {
	const { users } = yield select()
	const { newUser = {} } = users
	loadingMessage({
		content: 'Criando novo usuário...',
		updateKey: 'createUser',
	})
	try {
		yield call(api.post, '/users', newUser)
		successMessage({
			content: 'Usuário criado com sucesso',
			updateKey: 'createUser',
		})
		yield put(getUserList())
	} catch (error) {
		errorMessage({
			content: error.response.data.error,
			updateKey: 'createUser',
		})
	}
	yield put(resetNewUser())
}

function* updateUserSaga() {
	const { users } = yield select()
	const { editUser = {} } = users
	loadingMessage({
		content: 'Editando usuário...',
		updateKey: 'updateUser',
	})
	try {
		yield call(api.patch, `/users/${editUser.username}`, {
			groups: editUser.groups,
		})
		successMessage({
			content: 'Usuário editado com sucesso',
			updateKey: 'updateUser',
		})
		yield put(getUserList())
	} catch {}
}

function* deleteUserSaga({ payload }) {
	loadingMessage({
		content: 'Deletando usuário...',
		updateKey: 'deleteUser',
	})
	try {
		yield call(api.delete, `/users/${payload}`)
		successMessage({
			content: 'Usuário deletado com sucesso',
			updateKey: 'deleteUser',
		})
		yield put(getUserList())
	} catch {}
}

function* resendInviteSaga({ payload }) {
	loadingMessage({
		content: 'Reenviando convite...',
		updateKey: 'resendInvite',
	})
	try {
		yield call(api.post, `/users/re-invite`, {
			username: payload.username,
		})
		successMessage({
			content: 'Convite reeenviado com sucesso',
			updateKey: 'resendInvite',
		})
	} catch {
		errorMessage({
			content: 'Falha no reenvio do convite',
			updateKey: 'resendInvite',
		})
	}
}
