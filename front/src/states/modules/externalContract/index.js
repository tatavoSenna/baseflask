import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {},
	form: [],
	user: {},
	created: false,
	authorized: true,
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'externalContract',
	initialState,
	reducers: {
		verifyToken: (state) =>
			extend(state, {
				loading: true,
			}),
		verifyTokenSuccess: (state, { payload }) =>
			extend(state, {
				data: payload.data,
				form: payload.data.form ? payload.data.form : [],
				authorized: payload.data.Authorized,
				error: null,
				loading: false,
			}),
		verifyTokenFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				authorized: false,
				loading: false,
			}),
		createContractExternal: (state) => state,
		createContractExternalSuccess: (state) =>
			extend(state, {
				created: true,
			}),
		createContractExternalFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
	},
})

export const {
	verifyToken,
	verifyTokenSuccess,
	verifyTokenFailure,
	createContractExternal,
	createContractExternalSuccess,
	createContractExternalFailure,
} = actions

export { default as externalContractSaga } from './sagas'

export default reducer
