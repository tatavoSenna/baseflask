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
	updateIsCompanyAdmin: {
		user: {
			username: '',
			is_company_admin: null,
		},
		error: null,
		loading: false,
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
		resendInvite: (state) => extend(state),
		updateUserIsCompanyAdminStatus: (state, { payload }) => {
			extend(state, {
				updateIsCompanyAdmin: {
					...state.updateIsCompanyAdmin,
					loading: true,
					error: null,
				},
			})
		},
		updateUserIsCompanyAdminStatusSuccess: (state, { payload }) => {
			extend(state, {
				updateIsCompanyAdmin: {
					...state.updateIsCompanyAdmin,
					loading: false,
					error: false,
					user: {
						username: payload.username,
						isCompanyAdmin: payload.is_company_admin,
					},
				},
			})
		},
		updateUserIsCompanyAdminStatusFailure: (state, { payload }) =>
			extend(state, {
				updateIsCompanyAdmin: {
					...state.updateIsCompanyAdmin,
					loading: false,
					error: payload,
				},
			}),
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
	resendInvite,
	updateUserIsCompanyAdminStatus,
	updateUserIsCompanyAdminStatusSuccess,
	updateUserIsCompanyAdminStatusFailure,
} = actions

export { default as usersSaga } from './sagas'

export default reducer
