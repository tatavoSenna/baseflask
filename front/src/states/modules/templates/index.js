import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

import { selectAllTemplates } from './selectors'

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
	viewTemplate,
	setShowModal,
} = actions

export { default as templateSaga } from './sagas'

export default reducer
