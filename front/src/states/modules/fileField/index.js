import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {},
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'fileField',
	initialState,
	reducers: {
		fileUploadRequest: (state) =>
			extend(state, {
				loading: true,
			}),
		fileUploadSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: payload.data,
			}),
		fileUploadFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const { fileUploadRequest, fileUploadSuccess, fileUploadFailure } =
	actions

export { default as fileFieldSaga } from './sagas'

export default reducer
