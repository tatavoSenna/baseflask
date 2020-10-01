import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	userList: [],
	showModal: false,
	newUser: {
		name: '',
		email: '',
	},
}

const { actions, reducer } = createSlice({
	name: 'users',
	initialState,
	reducers: {
		getUserList: (state) =>
			extend(state, {
				loading: true,
			}),
		getUserListSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				userList: payload,
			}),
		updateNewUser: (state, { payload }) =>
			extend(state, {
				newUser: extend(state.newUser, {
					name: payload.name,
					email: payload.email,
				}),
			}),
		createUser: (state) => extend(state),
		resetNewUser: (state) =>
			extend(state, {
				newUser: extend(state.newUser, {
					name: '',
					email: '',
				}),
			}),
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
		deleteUser: (state) => extend(state),
	},
})

export const {
	getUserList,
	getUserListSuccess,
	getUserListFailure,
	createUser,
	deleteUser,
	setShowModal,
	updateNewUser,
	resetNewUser,
} = actions

export { default as usersSaga } from './sagas'

export default reducer
