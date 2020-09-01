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
		listQuestionSuccess: (state, { payload }) =>
			extend(state, {
				data: payload,
				error: null,
				loading: false,
			}),
		listQuestionFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
		// answer: (state, { payload }) =>
		// 	extend(state, {
		// 		questions: map(
		// 			state.questions,
		// 			(v) => assign({}, v, { answer: payload.data[v.variable] || '' }) // no v.value maybe a problem
		// 		),
		// 		loadingAnswer: true,
		// 	}),
		// answerSuccess: (state, { payload }) =>
		// 	extend(state, {
		// 		loadingAnswer: false,
		// 	}),
		// answerFailure: (state, { payload }) =>
		// 	extend(state, {
		// 		loadingAnswer: false,
		// 		error: payload.error,
		// 	}),
	},
})

export const {
	listQuestion,
	listQuestionSuccess,
	listQuestionFailure,
} = actions

export { default as questionSaga } from './sagas'

export default reducer
