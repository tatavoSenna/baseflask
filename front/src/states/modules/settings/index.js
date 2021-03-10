import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		getSettings: (state) =>
			extend(state, {
				loading: true,
			}),
		getSettingsSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: payload,
			}),
		getSettingsFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		saveSettings: (state) =>
			extend(state, {
				loading: true,
			}),
		saveSettingsSuccess: (state, { payload }) =>
			extend(state, {
				data: payload,
				loading: false,
			}),
		saveSettingsFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const {
	getSettings,
	getSettingsSuccess,
	getSettingsFailure,
	saveSettings,
	saveSettingsSuccess,
	saveSettingsFailure,
} = actions

export { default as settingsSaga } from './sagas'

export default reducer
