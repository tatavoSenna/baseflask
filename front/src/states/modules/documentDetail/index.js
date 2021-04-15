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
}

const { actions, reducer } = createSlice({
	name: 'documentDetail',
	initialState,
	reducers: {
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
} = actions

export { default as documentDetailSaga } from './sagas'

export default reducer
