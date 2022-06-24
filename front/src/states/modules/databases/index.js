import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import { selectAllDatabases } from './selectors'

const initialState = {
	data: [],
	showModal: false,
	pages: {
		page: 0,
		per_page: 0,
		total: 0,
	},
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'database',
	initialState,
	reducers: {
		listDatabases: (state) =>
			extend(state, {
				loading: true,
			}),
		listAllDatabases: (state) =>
			extend(state, {
				loading: true,
			}),
		listDatabasesSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDatabases(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
				error: null,
				loading: false,
			}),
		listDatabasesFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),

		createDatabase: (state) =>
			extend(state, {
				loading: true,
			}),
		createDatabaseSuccess: (state) =>
			extend(state, {
				loading: false,
			}),
		createDatabaseFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),

		deleteDatabase: (state) =>
			extend(state, {
				loading: true,
			}),
		deleteDatabaseSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDatabases(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
				error: null,
				loading: false,
			}),
		deleteDatabaseFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
	},
})

export const {
	listDatabases,
	listAllDatabases,
	listDatabasesSuccess,
	listDatabasesFailure,
	createDatabase,
	createDatabaseSuccess,
	createDatabaseFailure,
	deleteDatabase,
	deleteDatabaseSuccess,
	deleteDatabaseFailure,
	setShowModal,
} = actions

export { default as databaseSaga } from './sagas'

export default reducer
