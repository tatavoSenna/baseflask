import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import { selectAllDocumentDetail, selectAllDocumentVersions } from './selectors'

const initialState = {
	data: {},
	text: '',
	textUpdate: '',
	description: '',
	showModal: false,
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'documentDetail',
	initialState,
	reducers: {
		getDocumentDetail: (state) =>
			extend(state, {
				loading: true,
			}),
		getDocumentDetailSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				text: payload.text,
				textUpdate: payload.text,
				error: null,
				loading: false,
			}),
		getDocumentDetailtFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		newVersion: (state) => extend(state),
		newVersionSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentVersions(payload),
				text: payload.text,
				textUpdate: payload.text,
				description: '',
				error: null,
				loading: false,
			}),
		newVersionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		updateTextVersion: (state, { payload }) =>
			extend(state, {
				textUpdate: payload.text,
			}),
		previousStep: (state) => extend(state),
		previousStepSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
			}),
		previousStepFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		nextStep: (state) => extend(state),
		nextStepSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
			}),
		nextStepFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
		updateDescription: (state, { payload }) =>
			extend(state, {
				description: payload.description,
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
	updateDescription,
} = actions

export { default as documentDetailSaga } from './sagas'

export default reducer
