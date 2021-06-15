import { call, put, takeEvery, select } from 'redux-saga/effects'
import {
	successMessage,
	loadingMessage,
	errorMessage,
} from '~/services/messager'
import api from '~/services/api'
import {
	getDocumentDetail,
	getDocumentDetailSuccess,
	getDocumentDetailFailure,
	newVersion,
	newVersionSuccess,
	newVersionFailure,
	previousStep,
	previousStepSuccess,
	previousStepFailure,
	nextStep,
	nextStepSuccess,
	nextStepFailure,
	newAssign,
	newAssignSuccess,
	newAssignFailure,
	sentAssign,
	sentAssignSuccess,
	sentAssignFailure,
	selectVersion,
	selectVersionSuccess,
	selectVersionFailure,
	downloadLink,
	downloadLinkSuccess,
	downloadLinkFailure,
	getDocumentWordDownload,
	getDocumentWordDownloadSuccess,
	getDocumentWordDownloadFailure,
	changeVariables,
	changeVariablesSuccess,
	changeVariablesFailure,
} from '.'

export default function* rootSaga() {
	yield takeEvery(getDocumentDetail, getDocumentDetailSaga)
	yield takeEvery(newVersion, newVersionSaga)
	yield takeEvery(previousStep, previousStepSaga)
	yield takeEvery(nextStep, nextStepSaga)
	yield takeEvery(newAssign, newAssignSaga)
	yield takeEvery(sentAssign, sentAssignSaga)
	yield takeEvery(selectVersion, selectVersionSaga)
	yield takeEvery(downloadLink, downloadLinkSaga)
	yield takeEvery(getDocumentWordDownload, getDocumentWordDownloadSaga)
	yield takeEvery(changeVariables, changeVariablesSaga)
}

function* getDocumentDetailSaga({ payload = {} }) {
	const { id } = payload
	try {
		const { data } = yield call(api.get, `/documents/${id}`)
		let response
		if (data.text_type === '.docx') {
			response = yield call(api.get, `/documents/${id}/pdf`)
		} else {
			response = yield call(api.get, `/documents/${id}/text`)
		}
		yield put(getDocumentDetailSuccess({ ...data, ...response.data }))
	} catch (error) {
		errorMessage({
			content:
				'Ooops, ocorreu um erro. Já avisamos nossos engenheiros, por favor tente mais tarde.',
			updateKey: 'getDocumentDetail',
		})
		yield put(getDocumentDetailFailure(error))
	}
}

function* newVersionSaga({ payload = {} }) {
	loadingMessage({
		content: 'Criando nova versão do documento...',
		updateKey: 'createVersion',
	})
	const { id, description, text } = payload
	const { documentDetail } = yield select()
	try {
		const response = yield call(api.post, `/documents/${id}/text`, {
			text: text.text,
			description,
			comments: text.comments,
		})
		successMessage({
			content: 'Versão criada com sucesso',
			updateKey: 'createVersion',
		})

		let version_id = response.data.updated_versions_list[0].id

		yield put(
			newVersionSuccess({
				text: response.data.uploaded_text,
				versions: response.data.updated_versions_list,
				document: { ...documentDetail.data, version_id },
				version_id,
			})
		)
	} catch (error) {
		yield put(newVersionFailure(error))
	}
}

function* selectVersionSaga({ payload = {} }) {
	loadingMessage({
		content: 'Selecionando versão do documento...',
		updateKey: 'selectVersion',
	})
	const { id } = payload
	const { documentDetail } = yield select()
	try {
		const response = yield call(
			api.get,
			`/documents/${documentDetail.data.id}/text?version=${id}`
		)
		successMessage({
			content: 'Versão selecionada com sucesso.',
			updateKey: 'selectVersion',
		})
		yield put(
			selectVersionSuccess({
				text: response.data.text,
				comments: response.data.comments,
				document: {
					...documentDetail.data,
					version_id: response.data.version_id,
				},
				version_id: response.data.version_id,
			})
		)
	} catch (error) {
		errorMessage({
			content: 'Seleção de versão falhou.',
			updateKey: 'selectVersion',
		})
		yield put(selectVersionFailure(error))
	}
}

function* sentAssignSaga({ payload = {} }) {
	loadingMessage({
		content: 'Enviando documento para assinatura via Docusign.',
		updateKey: 'sentAssign',
	})
	const { id } = payload
	try {
		const response = yield call(api.post, `/documents/sign`, {
			document_id: id,
		})
		if (response.data.sent) {
			successMessage({
				content: 'Enviamos, via docusign, o documento para assinatura.',
				updateKey: 'sentAssign',
			})
			yield put(sentAssignSuccess({ ...response.data }))
		} else {
			errorMessage({
				content:
					'Envio para docusign falhou, favor revisar os dados de assinantes.',
				updateKey: 'sentAssign',
			})
		}
		yield put(
			sentAssignFailure({
				error:
					'Envio para docusign falhou, favor revisar os dados de assinantes.',
				showConnectModal: false,
			})
		)
	} catch (error) {
		let showConnectModal = false
		if (error.response.data.message.includes('Invalid Docusign access token')) {
			showConnectModal = true
		} else {
			errorMessage({
				content: error.response.data.message,
				updateKey: 'sentAssign',
			})
		}
		yield put(sentAssignFailure({ error, showConnectModal }))
	}
}

function* newAssignSaga({ payload = {} }) {
	const { id, signers } = payload
	try {
		const response = yield call(api.post, `/documents/${id}/signers`, {
			...signers,
		})
		yield put(newAssignSuccess({ ...response.data }))
	} catch (error) {
		yield put(newAssignFailure(error))
	}
}

function* previousStepSaga({ payload }) {
	loadingMessage({
		content: 'Mudando o status do documento. Por favor aguarde.',
		updateKey: 'status',
	})
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/previous`)
		yield put(previousStepSuccess(response.data))
		successMessage({
			content: 'Alteração do status do documento realizada com sucesso.',
			updateKey: 'status',
		})
	} catch (error) {
		errorMessage({
			content: 'Alteração do status do documento falhou.',
			updateKey: 'status',
		})
		yield put(previousStepFailure(error))
	}
}

function* nextStepSaga({ payload = {} }) {
	loadingMessage({
		content: 'Mudando o status do documento. Por favor aguarde.',
		updateKey: 'status',
	})
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/next`)
		yield put(nextStepSuccess(response.data))
		successMessage({
			content: 'Alteração do status do documento realizada com sucesso.',
			updateKey: 'status',
		})
	} catch (error) {
		errorMessage({
			content: 'Alteração do status do documento falhou.',
			updateKey: 'status',
		})
		yield put(nextStepFailure(error))
	}
}

function* downloadLinkSaga({ payload = {} }) {
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/download`)
		window.open(response.data.download_url, '_blank', 'noopener,noreferrer')

		yield put(downloadLinkSuccess())
	} catch (error) {
		yield put(downloadLinkFailure(error))
	}
}

function* getDocumentWordDownloadSaga({ payload = {} }) {
	loadingMessage({
		content: 'Realizando download do documento...',
		updateKey: 'downloadWord',
	})
	const { id } = payload
	try {
		const { data } = yield call(api.get, `documents/${id}/docx`)
		const link = document.createElement('a')
		link.href = data.download_url
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		successMessage({
			content: 'Download realizado com sucesso.',
			updateKey: 'downloadWord',
		})
		yield put(getDocumentWordDownloadSuccess())
	} catch (error) {
		errorMessage({
			content: 'Download falhou, favor tente novamente.',
			updateKey: 'downloadWord',
		})
		yield put(getDocumentWordDownloadFailure(error))
	}
}

function* changeVariablesSaga({ payload = {} }) {
	loadingMessage({
		content: 'Alterando váriaveis do documento...',
		updateKey: 'variablesDocument',
	})
	const { id, values } = payload

	// This function nests the struct variables, since Form only supports single level nesting
	const arrangeStructs = (values) => {
		Object.keys(values).forEach((fieldName) => {
			if (fieldName.slice(0, 10) === 'structured') {
				let arranged = []
				Object.keys(values[fieldName]).forEach((structVar) => {
					if (parseInt(structVar.split('_').pop()) + 1 > arranged.length) {
						arranged.push({})
					}
				})

				Object.keys(values[fieldName]).forEach((structVar) => {
					const nameSplit = structVar.split('_')
					const index = parseInt(nameSplit.pop())
					const name = nameSplit.join('_')
					arranged[index][name] = values[fieldName][structVar]
				})
				values[fieldName] = arranged
			}
		})
		return values
	}

	try {
		const { data } = yield call(api.post, `documents/${id}/modify`, {
			variables: arrangeStructs(values),
		})

		const response = yield call(api.get, `/documents/${id}/pdf`)
		successMessage({
			content: 'Alteração realizada com sucesso.',
			updateKey: 'variablesDocument',
		})
		yield put(changeVariablesSuccess({ ...data, ...response.data }))
	} catch (error) {
		errorMessage({
			content: 'Alteração falhou, favor tente novamente.',
			updateKey: 'variablesDocument',
		})
		yield put(changeVariablesFailure(error))
	}
}
