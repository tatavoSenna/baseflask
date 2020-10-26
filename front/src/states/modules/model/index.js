import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: [],
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'model',
	initialState,
	reducers: {
		listModel: (state) =>
			extend(state, {
				loading: true,
			}),
		listModelSuccess: (state, { payload }) =>
			extend(state, {
				data: payload.DocumentTemplates,
				error: null,
				loading: false,
			}),
		listModelFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const { listModel, listModelFailure, listModelSuccess } = actions

export { default as modelSaga } from './sagas'

export default reducer
