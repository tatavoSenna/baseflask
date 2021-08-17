import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import { selectAllContracts } from './selectors'

const initialState = {
	data: [],
	showModal: false,
	showLinkModal: false,
	link: '',
	pages: {
		page: 0,
		per_page: 0,
		total: 0,
	},
	error: null,
	loading: false,
	parent: null,
}

const { actions, reducer } = createSlice({
	name: 'contract',
	initialState,
	reducers: {
		listContract: (state) => {
			extend(state, {
				loading: true,
			})
		},
		listContractSuccess: (state, { payload }) => {
			extend(state, {
				data: selectAllContracts(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
				error: null,
				loading: false,
				parent: payload.parent,
			})
		},
		listContractFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		createLink: (state) =>
			extend(state, {
				loading: true,
				showModal: false,
			}),
		createLinkSuccess: (state, { payload }) =>
			extend(state, {
				link: payload.link,
				showLinkModal: true,
				error: null,
				loading: false,
			}),
		createLinkFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		deleteContract: (state) =>
			extend(state, {
				loading: true,
			}),
		deleteContractSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllContracts(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
				error: null,
				loading: false,
			}),
		deleteContractFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		viewContract: (state) => state,
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
		setShowLinkModal: (state, { payload }) =>
			extend(state, {
				showLinkModal: payload,
			}),
	},
})

export const {
	listContract,
	createLink,
	createLinkSuccess,
	createLinkFailure,
	deleteContract,
	deleteContractSuccess,
	deleteContractFailure,
	listContractSuccess,
	listContractFailure,
	viewContract,
	setShowModal,
	setShowLinkModal,
} = actions

export { default as contractSaga } from './sagas'

export default reducer
