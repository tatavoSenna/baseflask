import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {},
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
			const { modelId, title, data } = payload
			extend(state, {
				modelId,
				title,
				data: data.DocumentTemplate.form,
				error: null,
				loading: false,
			})
		},
		listQuestionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const {
	listQuestion,
	listQuestionSuccess,
	listQuestionFailure,
} = actions

export { default as questionSaga } from './sagas'

export default reducer
