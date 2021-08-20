import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {},
	visible: {},
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'question',
	initialState,
	reducers: {
		listQuestion: (state) =>
			extend(state, {
				loading: true,
			}),
		listQuestionSuccess: (state, { payload }) => {
			const { modelId, title, parent, data } = payload
			extend(state, {
				parent,
				modelId,
				title,
				data: data.form,
				error: null,
				loading: false,
			})
		},
		listQuestionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		listVisible: (state, { payload }) =>
			extend(state, {
				visible: payload.questions.map((page) => {
					return page.fields.map((field) => {
						return !field.condition
					})
				}),
			}),
		updateVisible: (state, { payload }) =>
			extend(state, {
				visible: state.visible.map((page, index) => {
					if (index === payload.pageIndex) {
						return page.map((field, index) => {
							if (index === payload.fieldIndex) {
								return payload.value
							}
							return field
						})
					}
					return page
				}),
			}),
		setResetQuestion: (state) => {
			extend(state, {
				data: {},
				error: null,
				loading: false,
				parent: null,
				modelId: null,
				title: '',
				visible: [],
			})
		},
	},
})

export const {
	listQuestion,
	listQuestionSuccess,
	listQuestionFailure,
	listVisible,
	updateVisible,
	setResetQuestion,
} = actions

export { default as questionSaga } from './sagas'

export default reducer
