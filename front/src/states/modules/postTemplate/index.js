import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {
		title: '',
		form: '',
		workflow: '',
		signers: '',
		text: '',
	},
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'post',
	initialState,
	reducers: {
		postTemplateTitle: (state, { payload }) => {
			state.data.title = payload.title
		},
		postTemplateAppend: (state, { payload }) => {
			state.data[payload.name] = payload.value
		},
		postTemplateRequest: (state) => state,
		postTemplateSuccess: (state) =>
			extend(state, {
				loading: false,
			}),
		postTemplateFailure: (state, { payload }) =>
			extend(state, {
				loading: false,
				error: payload.error,
			}),
	},
})

export const {
	postTemplateTitle,
	postTemplateAppend,
	postTemplateRequest,
	postTemplateSuccess,
	postTemplateFailure,
} = actions

export { default as postTemplateSaga } from './sagas'

export default reducer
