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
	postTemplateRequest,
	postTemplateSuccess,
	postTemplateFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getTemplateDetail, getTemplateDetailSaga)
	yield takeEvery(postTemplateRequest, postTemplateSaga)
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

function* postTemplateSaga({ payload = {} }) {
	loadingMessage({ content: 'Enviando template...', updateKey: 'postTemplate' })

	const { id, files, history } = payload
	const data = yield select((state) => {
		const { postTemplate } = state
		return postTemplate.data
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

	const arrangedVariables = (variables) => {
		const variablesObj = {}
		variables.forEach((page) =>
			page.fields.forEach((field) => {
				const variable = {}
				for (const key in field) {
					if (key !== 'name') {
						variable[key] = field[key]
					}
				}
				variablesObj[field.name] = variable
			})
		)
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

			yield put(postTemplateSuccess())
			successMessage({
				content: 'Template criado com sucesso!',
				updateKey: 'postTemplate',
			})
			history.push('/templates')
		} catch (error) {
			yield put(postTemplateFailure(error))
			errorMessage({
				content: 'A criação do template falhou',
				updateKey: 'postTemplate',
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

			yield put(postTemplateSuccess(patch))
			successMessage({
				content: 'Template atualizado com sucesso!',
				updateKey: 'postTemplate',
			})
			history.push('/templates')
		} catch (error) {
			yield put(postTemplateFailure(error))
			errorMessage({
				content: 'A atualização do template falhou',
				updateKey: 'postTemplate',
			})
		}
	}
}
