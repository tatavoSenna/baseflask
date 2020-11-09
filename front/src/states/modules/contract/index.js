import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import { selectAllContracts } from './selectors'

const initialState = {
	data: [],
	showModal: false,
	pages: {
		page: 0,
		per_page: 0,
		total: 0,
	},
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'contract',
	initialState,
	reducers: {
		listContract: (state) =>
			extend(state, {
				loading: true,
			}),
		listContractSuccess: (state, { payload }) =>
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
		listContractFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		viewContract: (state) => state,
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
	},
})

export const {
	listContract,
	listContractSuccess,
	listContractFailure,
	viewContract,
	setShowModal,
} = actions

export { default as contractSaga } from './sagas'

export default reducer
