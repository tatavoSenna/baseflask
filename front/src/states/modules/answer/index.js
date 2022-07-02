import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'
import { selectAnswer } from './selectors'

const initialState = {
	data: {},
	error: null,
	loadingAnswer: false,
}

const { actions, reducer } = createSlice({
	name: 'answer',
	initialState,
	reducers: {
		appendAnswer: (state, { payload }) =>
			extend(state, {
				data: selectAnswer(state.data, payload),
			}),
		appendAnswerEdit: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, payload.answer),
			}),
		answerRequest: (state) =>
			extend(state, {
				loadingAnswer: true,
			}),
		answerModify: (state) =>
			extend(state, {
				loadingAnswer: true,
			}),
		answerSuccess: (state) =>
			extend(state, {
				loadingAnswer: false,
			}),
		answerFailure: (state, { payload }) =>
			extend(state, {
				loadingAnswer: false,
				error: payload.error,
			}),
		setResetAnswer: (state) => {
			extend(state, {
				data: {},
				error: null,
				loadingAnswer: false,
			})
		},
	},
})

export const {
	appendAnswer,
	appendAnswerEdit,
	answerModify,
	answerRequest,
	answerSuccess,
	answerFailure,
	setResetAnswer,
} = actions

export { default as answerSaga } from './sagas'

export default reducer
