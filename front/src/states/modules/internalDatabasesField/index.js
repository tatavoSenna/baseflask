import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {},
}

const { actions, reducer } = createSlice({
	name: 'internalDatabaseField',
	initialState,
	reducers: {
		getDatabaseTexts: (state, { payload }) =>
			extend(state, {
				data: {
					...state.data,
					[payload.id]: {
						loading: true,
						error: null,
					},
				},
			}),
		getDatabaseTextsSuccess: (state, { payload }) =>
			extend(state, {
				data: {
					...state.data,
					[payload.id]: {
						texts: payload.items,
						loading: false,
						error: null,
					},
				},
			}),
		getDatabaseTextsFailure: (state, { payload }) =>
			extend(state, {
				data: {
					...state.data,
					[payload.id]: { loading: false, error: payload.error },
				},
			}),
	},
})

export const {
	getDatabaseTexts,
	getDatabaseTextsSuccess,
	getDatabaseTextsFailure,
} = actions

export { default as internalDatabaseFieldSaga } from './sagas'

export default reducer
