import { extend, map, assign } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	questions: [],
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
		listQuestionSuccess: (state, { payload }) =>
			extend(state, {
				questions: payload,
				error: null,
				loading: false,
			}),
		listQuestionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		awnser: (state, { payload }) =>
			extend(state, {
				questions: map(
					state.questions,
					(v) => assign({}, v, { answer: payload.data[v.variable] || '' }) // no v.value maybe a problem
				),
				loading: true,
			}),
		awnserSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
			}),
		awnserFailure: (state, { payload }) =>
			extend(state, {
				loading: false,
				error: payload.error,
			}),
	},
})

export const {
	listQuestion,
	listQuestionSuccess,
	listQuestionFailure,
	awnser,
	awnserSuccess,
	awnserFailure,
} = actions

export { default as questionSaga } from './sagas'

export default reducer
