import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'stateField',
	initialState,
	reducers: {
		getStateField: (state) =>
			extend(state, {
				loading: true,
			}),
		getStateFieldSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: payload,
			}),
		getStateFieldFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const { getStateField, getStateFieldSuccess, getStateFieldFailure } =
	actions

export { default as stateFieldSaga } from './sagas'

export default reducer
