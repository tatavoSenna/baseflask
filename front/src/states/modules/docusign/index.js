import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	token: null,
	error: null,
}

const { actions, reducer } = createSlice({
	name: 'docusign',
	initialState,
	reducers: {
		setDocusignRequest: (state) => extend(state),
	},
})

export const {
	setDocusignRequest,
	setDocusignSuccess,
	setDocusignFailure,
} = actions

export { default as docusignSaga } from './sagas'

export default reducer
