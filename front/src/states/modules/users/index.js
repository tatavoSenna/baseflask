import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import { selectAllUsers } from './selectors'

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
	pages: {
		page: 0,
		per_page: 0,
		total: 0,
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
				userList: selectAllUsers(payload.users),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
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
