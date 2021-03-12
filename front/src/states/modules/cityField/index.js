import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'cityField',
	initialState,
	reducers: {
		getCityField: (state) =>
			extend(state, {
				loading: true,
			}),
		getCityFieldSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: payload,
			}),
		getCityFieldFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const {
	getCityField,
	getCityFieldSuccess,
	getCityFieldFailure,
} = actions

export { default as cityFieldSaga } from './sagas'

export default reducer
