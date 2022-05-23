import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'
import { selectAnswer, selectImages } from './selectors'

const initialState = {
	data: {},
	dataImg: {},
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
				dataImg: selectImages(state.dataImg, payload),
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
		setResetAnswer: (state) => {
			extend(state, {
				data: {},
				dataImg: {},
				error: null,
				loadingAnswer: false,
			})
		},
	},
})

export const {
	appendAnswer,
	answerRequest,
	answerSuccess,
	answerFailure,
	setResetAnswer,
} = actions

export { default as answerSaga } from './sagas'

export default reducer
