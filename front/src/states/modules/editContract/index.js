import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	error: null,
	loading: false,
	draft: false,
}

const { actions, reducer } = createSlice({
	name: 'editContract',
	initialState,
	reducers: {
		editContract: (state) =>
			extend(state, {
				loading: true,
			}),
		editContractSuccess: (state, { payload }) =>
			extend(state, {
				error: null,
				loading: false,
				draft: payload.draft,
			}),
		editContractFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const { editContract, editContractSuccess, editContractFailure } =
	actions

export { default as editContractSaga } from './sagas'

export default reducer
