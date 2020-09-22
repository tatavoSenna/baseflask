import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	error: null,
}

const { actions, reducer } = createSlice({
	name: 'docusign',
	initialState,
	reducers: {
		setDocusignRequest: (state) =>
			extend(state, {
				loading: true,
			}),
		setDocusignSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
			}),
		setDocusignFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		signContract: (state) => extend(state),
	},
})

export const {
	setDocusignRequest,
	setDocusignSuccess,
	setDocusignFailure,
	signContract,
} = actions

export { default as docusignSaga } from './sagas'

export default reducer
