import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import { selectAllWebhooks } from './selectors'

const initialState = {
	loading: false,
	webhookList: [],
	newWebhook: {
		url: '',
	},
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
		getWebhooks: (state) =>
			extend(state, {
				loading: true,
			}),
		getWebhooksSuccess: (state, { payload }) => {
			extend(state, {
				loading: false,
				webhookList: selectAllWebhooks(payload.items),
			})
		},
		getWebhooksFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		updateNewWebhook: (state, { payload }) => {
			extend(state, {
				newWebhook: extend(state.newWebhook, {
					url: payload.webhook,
				}),
			})
		},
		saveWebhooks: (state) => {
			extend(state, {
				loading: true,
			})
		},
		saveWebhooksSuccess: (state, { payload }) => {
			extend(state, {
				url: payload.webhook,
				loading: false,
			})
		},
		saveWebhooksFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		deleteWebhooks: (state) => {
			extend(state, {
				loading: true,
			})
		},
		deleteWebhooksSuccess: (state) => {
			extend(state, {
				loading: false,
			})
		},
		deleteWebhooksFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		editWebhooks: (state) => {
			extend(state, {
				loading: true,
			})
		},
		editWebhooksSuccess: (state) => {
			extend(state, {
				loading: false,
			})
		},
		editWebhooksFailure: (state, { payload }) =>
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
	getWebhooks,
	getWebhooksSuccess,
	getWebhooksFailure,
	updateNewWebhook,
	saveWebhooks,
	saveWebhooksSuccess,
	saveWebhooksFailure,
	deleteWebhooks,
	deleteWebhooksSuccess,
	deleteWebhooksFailure,
	editWebhooks,
	editWebhooksSuccess,
	editWebhooksFailure,
} = actions

export { default as settingsSaga } from './sagas'

export default reducer
