import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import {
	selectAllDocumentDetail,
	selectAllDocumentVersions,
	selectAllDocumentSelectVersion,
} from './selectors'

const initialState = {
	data: {},
	text: '',
	file: '',
	comments: [],
	textUpdate: {
		text: '',
		comments: [],
	},
	description: '',
	showModal: false,
	showAssignModal: false,
	showConnectModal: false,
	error: null,
	loading: false,
	loadingSign: false,
	loadingVersion: false,
	version_id: '0',
	/**
	 * This object stores the details from a specific version of a text document.
	 * It can be accessed using useSelector(({documentDetail})=> documentDetail.textDocumentVersion) (Retuns a object with the data, error and loading values from this state)
	 */
	textDocumentVersion: {
		data: null,
		error: null,
		loading: false,
	},
	cancelledDocument: {
		data: null,
		error: null,
		loading: false,
	},
}

const { actions, reducer } = createSlice({
	name: 'documentDetail',
	initialState,
	reducers: {
		getDocumentCertificate: (state) =>
			extend(state, {
				loading: true,
			}),
		getDocumentCertificateFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		getDocumentDetail: (state) =>
			extend(state, {
				data: {},
				loading: true,
				text: '',
				comments: [],
				textUpdate: {
					text: '',
					comments: [],
				},
			}),
		getDocumentDetailSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				text: payload.text ? payload.text : '',
				comments: payload.comments ? payload.comments : [],
				textUpdate: {
					text: payload.text ? payload.text : '',
					comments: payload.comments ? payload.comments : [],
				},
				file: payload.download_url ? payload.download_url : '',
				version_id: payload.version_id,
				error: null,
				loading: false,
			}),
		getDocumentDetailFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		newAssign: (state) =>
			extend(state, {
				loading: true,
			}),
		newAssignSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				error: null,
				loading: false,
			}),
		newAssignFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		sentAssign: (state) =>
			extend(state, {
				loadingSign: true,
			}),
		sentAssignSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				error: null,
				loadingSign: false,
			}),
		sentAssignFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loadingSign: false,
				showConnectModal: payload.showConnectModal,
			}),
		selectVersion: (state) =>
			extend(state, {
				loadingVersion: true,
			}),
		selectVersionSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentSelectVersion(payload),
				text: payload.text,
				file: payload.file,
				comments: payload.comments ? payload.comments : [],
				textUpdate: {
					text: payload.text,
					comments: payload.comments ? payload.comments : [],
				},
				version_id: payload.version_id,
				description: '',
				error: null,
				loadingVersion: false,
			}),
		selectVersionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loadingVersion: false,
			}),
		newVersion: (state) =>
			extend(state, {
				loadingVersion: true,
			}),
		newVersionSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentVersions(payload),
				text: payload.text,
				comments: payload.versions[0].comments
					? payload.versions[0].comments
					: [],
				textUpdate: {
					text: payload.text,
					comments: payload.versions[0].comments
						? payload.versions[0].comments
						: [],
				},
				version_id: payload.version_id,
				description: '',
				error: null,
				loadingVersion: false,
			}),
		newVersionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loadingVersion: false,
			}),
		updateTextVersion: (state, { payload }) =>
			extend(state, {
				textUpdate: payload,
			}),
		previousStep: (state) =>
			extend(state, {
				loading: true,
			}),
		previousStepSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				loading: false,
			}),
		previousStepFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		nextStep: (state) =>
			extend(state, {
				loading: true,
			}),
		nextStepSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				loading: false,
			}),
		nextStepFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		editStep: (state) =>
			extend(state, {
				loading: true,
			}),
		editStepSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				loading: false,
			}),
		editStepFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
		setShowAssignModal: (state, { payload }) =>
			extend(state, {
				showAssignModal: payload,
			}),
		setShowConnectModal: (state, { payload }) =>
			extend(state, {
				showConnectModal: payload,
			}),
		updateDescription: (state, { payload }) =>
			extend(state, {
				description: payload.description,
			}),
		downloadLink: (state) =>
			extend(state, {
				loading: true,
			}),
		downloadLinkSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
			}),
		downloadLinkFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		getDocumentWordDownload: (state) =>
			extend(state, {
				loading: true,
			}),
		getDocumentWordDownloadSuccess: (state) =>
			extend(state, {
				loading: false,
			}),
		getDocumentWordDownloadFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		changeVariables: (state) =>
			extend(state, {
				loading: true,
				loadingSign: true,
			}),
		changeVariablesSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				file: payload.download_url ? payload.download_url : '',
				error: null,
				loading: false,
				loadingSign: false,
			}),
		changeVariablesFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
				loadingSign: false,
			}),
		downloadTextDocumentVersion: (state) =>
			extend(state, {
				textDocumentVersion: {
					...state.textDocumentVersion,
					loading: true,
					error: null,
				},
			}),
		downloadTextDocumentVersionSuccess: (state, { payload }) =>
			extend(state, {
				textDocumentVersion: {
					data: payload,
					loading: false,
					error: null,
				},
			}),
		downloadTextDocumentVersionFailure: (state, { payload }) =>
			extend(state, {
				textDocumentVersion: {
					...state.textDocumentVersion,
					loading: false,
					error: payload,
				},
			}),
		cancelDocument: (state, { payload }) =>
			extend(state, {
				cancelledDocument: {
					loading: true,
					error: null,
					data: null,
				},
			}),
		cancelDocumentSuccess: (state, { payload }) => {
			extend(state, {
				data: selectAllDocumentDetail(payload),
				cancelledDocument: {
					...state.cancelledDocument,
					loading: false,
					error: null,
					data: payload,
				},
			})
		},
		cancelDocumentFailure: (state, { payload }) =>
			extend(state, {
				cancelledDocument: {
					...state.cancelledDocument,
					loading: false,
					error: payload,
				},
			}),
	},
})

export const {
	getDocumentDetail,
	getDocumentDetailSuccess,
	getDocumentDetailFailure,
	newVersion,
	newVersionSuccess,
	newVersionFailure,
	updateTextVersion,
	previousStep,
	previousStepSuccess,
	previousStepFailure,
	nextStep,
	nextStepSuccess,
	nextStepFailure,
	editStep,
	editStepSuccess,
	editStepFailure,
	setShowModal,
	setShowAssignModal,
	updateDescription,
	newAssign,
	newAssignSuccess,
	newAssignFailure,
	sentAssign,
	sentAssignSuccess,
	sentAssignFailure,
	selectVersion,
	selectVersionSuccess,
	selectVersionFailure,
	setShowConnectModal,
	downloadLink,
	downloadLinkSuccess,
	downloadLinkFailure,
	getDocumentWordDownload,
	getDocumentWordDownloadSuccess,
	getDocumentWordDownloadFailure,
	changeVariables,
	changeVariablesSuccess,
	changeVariablesFailure,
	getDocumentCertificate,
	getDocumentCertificateFailure,
	downloadTextDocumentVersion,
	downloadTextDocumentVersionSuccess,
	downloadTextDocumentVersionFailure,
	cancelDocument,
	cancelDocumentSuccess,
	cancelDocumentFailure,
} = actions

export { default as documentDetailSaga } from './sagas'

export default reducer
