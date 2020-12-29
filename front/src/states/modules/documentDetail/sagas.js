import { all, call, put, takeEvery, select } from 'redux-saga/effects'
import {
	errorMessage,
	successMessage,
	loadingMessage,
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
} from '.'

export default function* rootSaga() {
	yield takeEvery(getDocumentDetail, getDocumentDetailSaga)
	yield takeEvery(newVersion, newVersionSaga)
	yield takeEvery(previousStep, previousStepSaga)
	yield takeEvery(nextStep, nextStepSaga)
	yield takeEvery(newAssign, newAssignSaga)
	yield takeEvery(sentAssign, sentAssignSaga)
	yield takeEvery(selectVersion, selectVersionSaga)
}

function* getDocumentDetailSaga({ payload = {} }) {
	const { id } = payload
	try {
		const [detail, detailText] = yield all([
			call(api.get, `/documents/${id}`),
			call(api.get, `/documents/${id}/text`),
		])
		yield put(getDocumentDetailSuccess({ ...detail.data, ...detailText.data }))
	} catch (error) {
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
			text,
			description,
		})
		successMessage({
			content: 'Versão criada com sucesso',
			updateKey: 'createVersion',
		})
		yield put(
			newVersionSuccess({
				text: response.data.uploaded_text,
				versions: response.data.updated_versions_list,
				document: documentDetail.data,
				version_id:
					response.data.updated_versions_list[
						response.data.updated_versions_list.length - 1
					].id,
			})
		)
	} catch (error) {
		errorMessage({
			content: 'Criação de nova versão falhou',
			updateKey: 'createVersion',
		})
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
				document: documentDetail.data,
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
		} else {
			successMessage({
				content:
					'Envio para docusign falhou, favor revisar os dados de assinantes.',
				updateKey: 'sentAssign',
			})
		}
		yield put(sentAssignSuccess({ ...response.data }))
	} catch (error) {
		let showConnectModal = false
		if (
			error &&
			error.response &&
			error.response.request &&
			error.response.request.responseText &&
			error.response.request.responseText.includes(
				'Invalid Docusign access token'
			)
		) {
			showConnectModal = true
		} else {
			errorMessage({
				content:
					'Envio para docusign falhou, favor revisar os dados de assinantes.',
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
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/previous`)
		yield put(previousStepSuccess(response.data))
	} catch (error) {
		yield put(previousStepFailure(error))
	}
}

function* nextStepSaga({ payload = {} }) {
	const { id } = payload
	try {
		const response = yield call(api.get, `documents/${id}/next`)
		yield put(nextStepSuccess(response.data))
	} catch (error) {
		yield put(nextStepFailure(error))
	}
}
