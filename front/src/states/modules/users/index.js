import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	userList: [],
	showModal: false,
	showEditModal: false,
	newUser: {
		name: '',
		email: '',
		groups: [],
	},
	editUser: {
		username: '',
		name: '',
		email: '',
		groups: [],
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
					groups: payload.groups,
				}),
			}),
		updateEditUser: (state, { payload }) =>
			extend(state, {
				editUser: extend(state.editUser, {
					username: !payload.username
						? state.editUser.username
						: payload.username,
					name: payload.name,
					email: payload.email,
					groups: payload.groups,
				}),
			}),
		createUser: (state) => extend(state),
		resetNewUser: (state) =>
			extend(state, {
				newUser: extend(state.newUser, {
					name: '',
					email: '',
					groups: [],
				}),
			}),
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
		setShowEditModal: (state, { payload }) =>
			extend(state, {
				showEditModal: payload,
			}),
		updateUser: (state) => extend(state),
		deleteUser: (state) => extend(state),
	},
})

export const {
	getUserList,
	getUserListSuccess,
	getUserListFailure,
	createUser,
	updateUser,
	deleteUser,
	setShowModal,
	setShowEditModal,
	updateNewUser,
	updateEditUser,
	resetNewUser,
} = actions

export { default as usersSaga } from './sagas'

export default reducer
