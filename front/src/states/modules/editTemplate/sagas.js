import { call, put, takeEvery, select } from 'redux-saga/effects'
import { extend } from 'lodash'

import {
	loadingMessage,
	successMessage,
	errorMessage,
} from '~/services/messager'

import api from '~/services/api'

import {
	getTemplateDetail,
	getTemplateDetailSuccess,
	getTemplateDetailFailure,
	editTemplateRequest,
	editTemplateSuccess,
	editTemplateFailure,
	getTemplateDownload,
	getTemplateDownloadSuccess,
	getTemplateDownloadFailure,
	getGroupsUsers,
	getGroupsUsersSuccess,
	getGroupsUsersFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getTemplateDetail, getTemplateDetailSaga)
	yield takeEvery(editTemplateRequest, editTemplateSaga)
	yield takeEvery(getTemplateDownload, getTemplateDownloadSaga)
	yield takeEvery(getGroupsUsers, getGroupsUsersSaga)
}

function* getTemplateDetailSaga({ payload = {} }) {
	const { id, editDOCX } = payload
	try {
		const detail = yield call(api.get, `/templates/${id}`)

		let text = {}
		if (detail.data.text_type === '.txt') {
			text = yield call(api.get, `/templates/${id}/text`)
		} else {
			editDOCX()
		}

		yield put(
			getTemplateDetailSuccess(
				extend(detail.data, {
					textfile: text.data,
				})
			)
		)
	} catch (error) {
		console.log(error)
		yield put(getTemplateDetailFailure(error))
	}
}

function* editTemplateSaga({ payload = {} }) {
	loadingMessage({ content: 'Enviando modelo...', updateKey: 'editTemplate' })

	const { id, files, history } = payload
	const data = yield select((state) => {
		const { editTemplate } = state
		return editTemplate.data
	})

	const toObject = (arr) => {
		var obj = {}
		for (var i = 0; i < arr.length; ++i) obj[i] = arr[i]
		return obj
	}

	const filteredForm = (form) => {
		return form.map((page) => ({ fields: page.fields, title: page.title }))
	}

	const arrangedSigners = (signers) => {
		const signersArray = []
		signers.parties.map((party) =>
			party.partySigners.map((partySigner) => signersArray.push(partySigner))
		)
		return signersArray
	}

	// The 'name' property becomes the key of the object
	const extractName = (object) => {
		const variable = {}
		for (const key in object) {
			if (key !== 'name') {
				variable[key] = object[key]
			}
		}
		return variable
	}

	// Applies the extractName func on variables from the structure
	const structuredVariable = (variable) => {
		const structVarObj = {
			...extractName(variable),
			structure: {},
		}

		variable.structure.forEach((field) => {
			if (field?.name) {
				structVarObj.structure[field.name] = extractName(field)
			}
		})

		return structVarObj
	}

	// Iterates over the variables applying the extractName function.
	const arrangedVariables = (variables) => {
		const variablesObj = {}
		variables.forEach((page) => {
			page.forEach((field) => {
				if (field) {
					if (field.structure) {
						variablesObj[field.name] = structuredVariable(field)
					} else {
						variablesObj[field.name] = extractName(field)
					}
				}
			})
		})
		return variablesObj
	}

	const workflow = {
		nodes: toObject(data.workflow.nodes),
		current_node: '0',
		created_by: '',
	}

	console.log(data.variables)

	if (id === 'new') {
		try {
			const response = yield call(api.post, '/templates/', {
				title: data.title,
				form: filteredForm(data.form),
				workflow: workflow,
				signers: arrangedSigners(data.signers),
				text: data.text,
				text_type: files.length > 0 ? '.docx' : '.txt',
				variables: arrangedVariables(data.variables),
			})

			if (files.length > 0) {
				const formData = new FormData()
				const docFile = files[0]
				formData.append('file', docFile, docFile.name)

				yield call(api.post, `/templates/${response.data.id}/upload`, formData)
			}

			yield put(editTemplateSuccess())
			successMessage({
				content: 'Modelo criado com sucesso!',
				updateKey: 'editTemplate',
			})
			history.push('/models')
		} catch (error) {
			yield put(editTemplateFailure(error))
			errorMessage({
				content: 'A criação do modelo falhou',
				updateKey: 'editTemplate',
			})
		}
	} else {
		try {
			const { patch } = yield call(api.patch, `/templates/${id}`, {
				title: data.title,
				form: filteredForm(data.form),
				workflow: workflow,
				signers: arrangedSigners(data.signers),
				text: data.text,
				text_type: files.length > 0 ? '.docx' : '.txt',
				variables: arrangedVariables(data.variables),
			})

			if (files.length > 0 && files[0].uid !== 'edit') {
				const formData = new FormData()
				const docFile = files[0]
				formData.append('file', docFile, docFile.name)

				yield call(api.post, `/templates/${id}/upload`, formData)
			}

			yield put(editTemplateSuccess(patch))
			successMessage({
				content: 'Modelo atualizado com sucesso!',
				updateKey: 'editTemplate',
			})
			history.push('/models')
		} catch (error) {
			yield put(editTemplateFailure(error))
			console.log(error)
			errorMessage({
				content: 'A atualização do modelo falhou',
				updateKey: 'editTemplate',
			})
		}
	}
}

function* getTemplateDownloadSaga({ payload = {} }) {
	loadingMessage({
		content: 'Realizando download do modelo...',
		updateKey: 'downloadTemplate',
	})
	const { id } = payload
	try {
		const { data } = yield call(api.get, `templates/${id}/getupload`)
		const link = document.createElement('a')
		link.href = data.download_url
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		successMessage({
			content: 'Download realizado com sucesso.',
			updateKey: 'downloadTemplate',
		})
		yield put(getTemplateDownloadSuccess())
	} catch (error) {
		errorMessage({
			content: 'Download falhou, favor tente novamente.',
			updateKey: 'downloadTemplate',
		})
		yield put(getTemplateDownloadFailure(error))
	}
}

function* getGroupsUsersSaga({ payload = {} }) {
	loadingMessage({
		content: 'Carregando usuários do grupo...',
		updateKey: 'getGroupsUsers',
	})
	const groupId = payload
	try {
		const { data } = yield call(api.get, `groups/${groupId}/users`)
		yield put(getGroupsUsersSuccess({ groupId, data }))
		successMessage({
			content: `Usuários do grupo carregados com sucesso`,
			updateKey: 'getGroupsUsers',
		})
	} catch (error) {
		console.log(error)
		yield put(getGroupsUsersFailure())
		errorMessage({
			content: 'Falha ao carregar usuários do grupo.',
			updateKey: 'getGroupsUsers',
		})
	}
}
