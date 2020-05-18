import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	contracts: [],
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
				contracts: payload.items,
				error: null,
				loading: false,
			}),
		listContractFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		viewContract: (state) => state,
	},
})

export const {
	listContract,
	listContractSuccess,
	listContractFailure,
	viewContract,
} = actions

export { default as contractSaga } from './sagas'

export default reducer
