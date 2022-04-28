import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {},
	error: {},
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'databaseField',
	initialState,
	reducers: {
		apiRequest: (state) =>
			extend(state, {
				loading: true,
			}),
		apiRequestSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: { ...state.data, [payload.url]: payload.data },
			}),
		apiRequestFailure: (state, { payload }) =>
			extend(state, {
				loading: false,
				error: { ...state.error, [payload.url]: payload.error },
				data: { ...state.data, [payload.url]: [] },
			}),
	},
})

export const { apiRequest, apiRequestSuccess, apiRequestFailure } = actions

export { default as databaseFieldSaga } from './sagas'

export default reducer
