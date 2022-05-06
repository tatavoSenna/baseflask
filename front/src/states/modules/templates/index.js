import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import {
	selectAllTemplates,
	updatePublished,
	updateFavorite,
} from './selectors'

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
	name: 'template',
	initialState,
	reducers: {
		listTemplate: (state) =>
			extend(state, {
				loading: true,
			}),
		listTemplateSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllTemplates(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
				error: null,
				loading: false,
			}),
		listTemplateFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		publishTemplate: (state) =>
			extend(state, {
				loading: true,
			}),
		publishTemplateSuccess: (state, { payload }) =>
			extend(state, {
				data: updatePublished(state.data, payload),
				loading: false,
				error: null,
			}),
		publishTemplateFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		duplicateTemplate: (state) =>
			extend(state, {
				loading: true,
			}),
		duplicateTemplateSuccess: (state, { payload }) => {
			if (payload.items !== undefined) {
				return extend(state, {
					data: selectAllTemplates(payload.items),
					pages: {
						page: payload.page,
						per_page: payload.per_page,
						total: payload.total,
					},
					error: null,
					loading: false,
				})
			}
			return extend(state, {
				error: null,
				loading: false,
			})
		},
		duplicateTemplateFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		favorteTemplate: (state) =>
			extend(state, {
				loading: true,
			}),
		favoriteTemplateSuccess: (state, { payload }) =>
			extend(state, {
				data: updateFavorite(state.data, payload),
				loading: false,
				error: null,
			}),
		favoriteTemplateFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		deleteTemplate: (state) =>
			extend(state, {
				loading: true,
			}),
		deleteTemplateSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllTemplates(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
				error: null,
				loading: false,
			}),
		deleteTemplateFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		viewTemplate: (state) => state,
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
	},
})

export const {
	listTemplate,
	listTemplateSuccess,
	listTemplateFailure,
	publishTemplate,
	publishTemplateSuccess,
	publishTemplateFailure,
	duplicateTemplate,
	duplicateTemplateSuccess,
	duplicateTemplateFailure,
	favorteTemplate,
	favoriteTemplateSuccess,
	favoriteTemplateFailure,
	deleteTemplate,
	deleteTemplateSuccess,
	deleteTemplateFailure,
	viewTemplate,
	setShowModal,
} = actions

export { default as templateSaga } from './sagas'

export default reducer
