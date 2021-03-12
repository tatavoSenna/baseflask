import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'cnaeField',
	initialState,
	reducers: {
		getCnaeField: (state) =>
			extend(state, {
				loading: true,
			}),
		getCnaeFieldSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: payload,
			}),
		getCnaeFieldFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const {
	getCnaeField,
	getCnaeFieldSuccess,
	getCnaeFieldFailure,
} = actions

export { default as cnaeFieldSaga } from './sagas'

export default reducer
