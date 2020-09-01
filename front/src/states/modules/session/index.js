import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	token: null,
	error: null,
	signed: false,
}

const { actions, reducer } = createSlice({
	name: 'session',
	initialState,
	reducers: {
		getJWToken: (state) =>
			extend(state),
		getJWTSuccess: (state, { payload }) =>
			extend(state, {
				token: payload.access_token,
				error: null,
				signed: true,
			}),
		getJWTFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		logout: (state) =>
			extend(state, {
				loading: true,
			}),
		logoutSuccess: (state) =>
			extend(state, {
				token: null,
				signed: false,
				loading: false,
			}),
		logoutFailure: (state) =>
			extend(state, {
				loading: false,
			}),
	},
})

export const {
	getJWToken,
	getJWTSuccess,
	getJWTFailure,
	logout,
	logoutFailure,
	logoutSuccess,
} = actions

export { default as sessionSaga } from './sagas'

export default reducer
