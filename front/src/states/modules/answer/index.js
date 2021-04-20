import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

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
				data: extend(state.data, payload.data),
			}),
		answerRequest: (state) =>
			extend(state, {
				loadingAnswer: true,
			}),
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
