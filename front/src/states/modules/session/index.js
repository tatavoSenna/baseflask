import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	is_admin: false,
}

const { actions, reducer } = createSlice({
	name: 'users',
	initialState,
	reducers: {
		getUserProfile: (state) => extend(state),
		getUserProfileSuccess: (state, { payload }) => extend(state, payload),
		getUserProfileFailure: (state) => extend(state),
		setCompanyId: (state, { payload }) =>
			extend(state, { company_id: payload.user.company_id }),
		setSignaturesProvider: (state, { payload }) => {
			extend(state, { signatures_provider: payload })
		},
	},
})

export const {
	getUserProfile,
	getUserProfileSuccess,
	getUserProfileFailure,
	setCompanyId,
	setSignaturesProvider,
} = actions

export { default as sessionSaga } from './sagas'

export default reducer
