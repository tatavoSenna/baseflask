import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import { selectAllDatabases, selectAllTags } from './selectors'

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
	tags: { data: [], loading: false, error: null },
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
		listTags: (state) =>
			extend(state, {
				tags: { ...state.tags, data: [], loading: true },
			}),
		listTagsSuccess: (state, { payload }) =>
			extend(state, {
				tags: {
					...state.tags,
					data: selectAllTags(payload.items),
					loading: false,
				},
			}),
		listTagsFailure: (state, { payload }) =>
			extend(state, {
				tags: { ...state.tags, error: payload.error, loading: false },
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
	listTags,
	listTagsSuccess,
	listTagsFailure,
} = actions

export { default as databaseSaga } from './sagas'

export default reducer
