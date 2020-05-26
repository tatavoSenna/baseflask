import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	answer: {},
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'answer',
	initialState,
	reducers: {
		appendAnswer: (state, { payload }) =>
			extend(state, {
				answer: extend(state.answer, payload.data),
			}),
		answerRequest: (state) => state,
		answerSuccess: (state, { payload }) =>
			extend(state, {
				loadingAnswer: false,
			}),
		answerFailure: (state, { payload }) =>
			extend(state, {
				loadingAnswer: false,
				error: payload.error,
			}),
	},
})

export const {
	appendAnswer,
	answerRequest,
	answerSuccess,
	answerFailure,
} = actions

export { default as answerSaga } from './sagas'

export default reducer
