import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import { selectAllDocumentDetail } from './selectors'

const initialState = {
	data: {},
	text: '',
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'documentDetail',
	initialState,
	reducers: {
		getDocumentDetail: (state) =>
			extend(state, {
				loading: true,
			}),
		getDocumentDetailSuccess: (state, { payload }) =>
			extend(state, {
				data: selectAllDocumentDetail(payload),
				text: payload.text,
				error: null,
				loading: false,
			}),
		getDocumentDetailtFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
			}),
	},
})

export const {
	getDocumentDetail,
	getDocumentDetailSuccess,
	getDocumentDetailFailure,
} = actions

export { default as documentDetailSaga } from './sagas'

export default reducer
