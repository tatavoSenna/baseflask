import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

import { selectAllItems, selectTextEdit } from './selectors'

const initialState = {
	database: {
		id: 0,
		title: '',
		table_type: '',
		error: null,
		loading: false,
	},
	items: {
		data: [],
		pages: {
			page: 0,
			per_page: 10,
			total: 0,
		},
		error: null,
		loading: false,
	},
	editedText: {
		id: 'new',
		description: '',
		text: '',
		error: null,
		loading: false,
	},
}

const { actions, reducer } = createSlice({
	name: 'post',
	initialState,
	reducers: {
		resetState: () => initialState,

		getDetail: (state, { payload }) =>
			extend(state, {
				database: { ...initialState.database, loading: true, id: payload.id },
				items: { ...initialState.items, loading: true },
			}),
		getDetailSuccess: (state, { payload }) =>
			extend(state, {
				database: {
					...state.database,
					title: payload.title,
					table_type: payload.table_type,
					loading: false,
				},
			}),
		getDetailFailure: (state, { payload }) =>
			extend(state, {
				database: {
					...state.database,
					error: payload.error,
					loading: false,
				},
			}),

		getText: (state, { payload }) =>
			extend(state, {
				editedText: {
					...initialState.editedText,
					id: payload.id,
					loading: true,
				},
			}),
		getTextSuccess: (state, { payload }) =>
			extend(state, {
				editedText: {
					...state.editedText,
					description: payload.description,
					text: payload.text,
					error: null,
					loading: false,
				},
			}),
		getTextFailure: (state, { payload }) =>
			extend(state, {
				editedText: {
					...state.editedText,
					error: payload.error,
					loading: false,
				},
			}),

		listItems: (state) =>
			extend(state, {
				items: {
					...state.items,
					loading: true,
				},
			}),
		listItemsSuccess: (state, { payload }) =>
			extend(state, {
				items: {
					data: selectAllItems(payload.items),
					pages: {
						page: payload.page,
						per_page: payload.per_page,
						total: payload.total,
					},
					error: null,
					loading: false,
				},
			}),
		listItemsFailure: (state, { payload }) =>
			extend(state, {
				items: {
					...state.items,
					error: payload.error,
					loading: false,
				},
			}),

		deleteItem: (state) =>
			extend(state, {
				items: {
					...state.items,
					loading: true,
				},
			}),
		deleteItemFailure: (state, { payload }) =>
			extend(state, {
				items: {
					...state.items,
					error: payload.error,
					loading: false,
				},
			}),

		editTitle: (state, { payload }) =>
			extend(state, {
				database: { ...state.database, title: payload.title },
			}),
		editTitleSuccess: (state) =>
			extend(state, {
				database: {
					...state.database,
					loading: false,
				},
			}),
		editTitleFailure: (state, { payload }) =>
			extend(state, {
				database: {
					...state.database,
					loading: false,
					error: payload.error,
				},
			}),

		newText: (state, { payload }) =>
			extend(state, {
				editedText: {
					...initialState.editedText,
					description: payload.description,
				},
			}),

		editText: (state, { payload }) =>
			extend(state, {
				editedText: selectTextEdit(state.editedText, payload),
			}),
		editTextRequest: (state) =>
			extend(state, {
				editedText: { ...state.editedText, loading: true },
			}),
		editTextSuccess: (state) =>
			extend(state, {
				editedText: {
					...state.editedText,
					loading: false,
				},
			}),
		editTextFailure: (state, { payload }) =>
			extend(state, {
				editedText: {
					...state.editedText,
					loading: false,
					error: payload.error,
				},
			}),
	},
})

export const {
	resetState,

	create,
	createSuccess,
	createFailure,

	getDetail,
	getDetailSuccess,
	getDetailFailure,

	getText,
	getTextSuccess,
	getTextFailure,

	listItems,
	listItemsSuccess,
	listItemsFailure,

	deleteItem,
	deleteItemFailure,

	editTitle,
	editTitleSuccess,
	editTitleFailure,

	newText,
	editText,
	editTextRequest,
	editTextSuccess,
	editTextFailure,
} = actions

export { default as databaseDetailSaga } from './sagas'

export default reducer
