import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	token: null,
	error: null,
	signed: false,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'session',
	initialState,
	reducers: {
		login: (state) =>
			extend(state, {
				loading: true,
			}),
		loginSuccess: (state, { payload }) =>
			extend(state, {
				token: payload.token,
				error: null,
				signed: true,
				loading: false,
			}),
		loginFailure: (state, { payload }) =>
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
	login,
	loginSuccess,
	loginFailure,
	logout,
	logoutFailure,
	logoutSuccess,
} = actions

export { default as sessionSaga } from './sagas'

export default reducer
