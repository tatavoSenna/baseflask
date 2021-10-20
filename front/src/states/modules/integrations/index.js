import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	company: {},
	d4sign: {},
}

const { actions, reducer } = createSlice({
	name: 'integrations',
	initialState,
	reducers: {
		getIntegration: (state) =>
			extend(state, {
				loading: true,
				company: {},
			}),
		getIntegrationSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				company: {
					...payload.company,
				},
				data: payload,
			}),
		getIntegrationFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		saveIntegration: (state) =>
			extend(state, {
				loading: true,
			}),
		saveIntegrationSuccess: (state, { payload }) =>
			extend(state, {
				data: payload,
				company: {
					...payload.company,
				},
				loading: false,
			}),
		saveIntegrationFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		connectDocusign: (state) =>
			extend(state, {
				loading: true,
			}),
		getD4sign: (state) =>
			extend(state, {
				loading: true,
			}),
		getD4signSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				d4sign: {
					...payload,
				},
				data: payload,
			}),
		getD4signFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const {
	getIntegration,
	getIntegrationSuccess,
	getIntegrationFailure,
	saveIntegration,
	saveIntegrationSuccess,
	saveIntegrationFailure,
	connectDocusign,
	getD4sign,
	getD4signSuccess,
	getD4signFailure,
} = actions

export { default as integrationsSaga } from './sagas'

export default reducer
