import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	token: null,
	error: null,
	signed: false,
	loggedUser: {
		id: null,
		username: '',
		email: '',
		name: '',
		companyId: null,
	},
}

const { actions, reducer } = createSlice({
	name: 'session',
	initialState,
	reducers: {
		getJWToken: (state) =>
			extend(state, {
				loading: true,
			}),
		getJWTSuccess: (state, { payload }) =>
			extend(state, {
				token: payload.access_token,
				signed: true,
				loading: false,
			}),
		getJWTFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
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
				loggedUser: extend(state.loggedUser, {
					id: null,
					username: '',
					email: '',
					name: '',
					companyId: null,
				}),
			}),
		logoutFailure: (state) =>
			extend(state, {
				loading: false,
			}),
		getLoggedUser: (state) => state,
		getLoggedUserSuccess: (state, { payload }) =>
			extend(state, {
				loggedUser: extend(state.loggedUser, {
					id: payload.id,
					username: payload.username,
					email: payload.email,
					name: payload.name,
					companyId: payload.company_id,
				}),
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
	getLoggedUser,
	getLoggedUserSuccess,
} = actions

export { default as sessionSaga } from './sagas'

export default reducer
