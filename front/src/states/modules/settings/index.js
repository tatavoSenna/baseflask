import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import { selectAllWebhooks } from './selectors'

const initialState = {
	loading: false,
	priceId: '',
	data: { url: '' },
	isCanceled: false,
	expireAt: 0,
	webhookList: [],
	newWebhook: {
		url: '',
	},
	error: false,
}

const { actions, reducer } = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		getSettings: (state) =>
			extend(state, {
				loading: true,
				error: false,
			}),
		getSettingsSuccess: (state, { payload }) =>
			extend(state, {
				loading: false,
				data: { ...state.data, url: payload },
			}),
		getSettingsFailure: (state, { payload }) =>
			extend(state, {
				error: payload,
				loading: false,
			}),
		getStripePlan: (state) =>
			extend(state, {
				loading: true,
			}),
		getStripePlanSuccess: (state, { payload }) =>
			extend(state, {
				expireAt: payload.expires_at,
				priceId: payload.price_id,
				isCanceled: payload.is_canceled,
				loading: false,
			}),
		getStripePlanFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		uploadStripePlan: (state) => {
			extend(state, {
				loading: true,
			})
		},
		uploadStripePlanSuccess: (state, { payload }) =>
			extend(state, {
				priceId: payload.price_id,
				loading: false,
			}),
		uploadStripePlanFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		uploadStripePlanPortal: (state) => {
			extend(state, {
				loading: true,
			})
		},
		uploadStripePlanPortalSuccess: (state) => {
			extend(state, {
				loading: false,
			})
		},
		uploadStripePlanPortalFailure: (state, { payload }) => {
			extend(state, {
				loading: false,
				error: payload.error,
			})
		},
		saveSettings: (state) =>
			extend(state, {
				loading: true,
				error: false,
			}),
		saveSettingsSuccess: (state) =>
			extend(state, {
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
	getStripePlan,
	getStripePlanSuccess,
	getStripePlanFailure,
	uploadStripePlan,
	uploadStripePlanSuccess,
	uploadStripePlanFailure,
	uploadStripePlanPortal,
	uploadStripePlanPortalSuccess,
	uploadStripePlanPortalFailure,
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
