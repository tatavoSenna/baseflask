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
} from '.'

export default function* rootSaga() {
	yield takeEvery(getTemplateDetail, getTemplateDetailSaga)
	yield takeEvery(editTemplateRequest, editTemplateSaga)
	yield takeEvery(getTemplateDownload, getTemplateDownloadSaga)
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
		yield put(getTemplateDetailFailure(error))
	}
}

function* editTemplateSaga({ payload = {} }) {
	loadingMessage({ content: 'Enviando template...', updateKey: 'editTemplate' })

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
			structure: {},
			main: {},
		}
		if (Array.isArray(variable.structure)) {
			variable.structure.forEach((field) => {
				if (field?.name) {
					structVarObj.structure[field.name] = extractName(field)
				}
			})
		} else {
			structVarObj.structure[variable.structure.name] = extractName(
				variable.structure
			)
		}

		if (Array.isArray(variable.main)) {
			variable.main.forEach((field) => {
				structVarObj.main[field.name] = extractName(field)
			})
		} else {
			structVarObj.main[variable.main.name] = extractName(variable.main)
		}
		return structVarObj
	}

	// Iterates over the variables applying the extractName function.
	// Structured variables are named after their specific type and index of both page and field, e.g., structured_list_0_3.
	const arrangedVariables = (variables) => {
		const variablesObj = {}
		variables.forEach((page, pageIndex) => {
			page.forEach((field, fieldIndex) => {
				if (field) {
					if (field.type === 'person') {
						const type = field.type
						variablesObj[`${type}_${pageIndex}_${fieldIndex}`] = {
							[field.name]: extractName(field),
						}
					} else if (field.structure && field.main) {
						const type = Array.isArray(field.main)
							? field.main[0].type
							: field.main.type
						variablesObj[
							`${type}_${pageIndex}_${fieldIndex}`
						] = structuredVariable(field)
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

	if (id === 'new') {
		try {
			const response = yield call(api.post, '/templates/', {
				title: data.title,
				form: data.form,
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
				content: 'Template criado com sucesso!',
				updateKey: 'editTemplate',
			})
			history.push('/templates')
		} catch (error) {
			yield put(editTemplateFailure(error))
			errorMessage({
				content: 'A criação do template falhou',
				updateKey: 'editTemplate',
			})
		}
	} else {
		try {
			const { patch } = yield call(api.patch, `/templates/${id}`, {
				title: data.title,
				form: data.form,
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
				content: 'Template atualizado com sucesso!',
				updateKey: 'editTemplate',
			})
			history.push('/templates')
		} catch (error) {
			yield put(editTemplateFailure(error))
			console.log(error)
			errorMessage({
				content: 'A atualização do template falhou',
				updateKey: 'editTemplate',
			})
		}
	}
}

function* getTemplateDownloadSaga({ payload = {} }) {
	loadingMessage({
		content: 'Realizando download do template...',
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
