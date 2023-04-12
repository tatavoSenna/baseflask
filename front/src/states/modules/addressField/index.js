import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: {},
	error: {},
	data: {},
}

const { actions, reducer } = createSlice({
	name: 'addressInfo',
	initialState,
	reducers: {
		getAddressInfo: (state, { payload }) =>
			extend(state, {
				...state,
				loading: { ...state.loading, [payload]: true },
			}),
		getAddressInfoSuccess: (state, { payload }) =>
			extend(state, {
				data: { ...state.data, [payload.keyCep]: payload.data },
				loading: { ...state.loading, [payload.keyCep]: false },
			}),
		getAddressInfoFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: { ...state.loading, [payload.keyCep]: false },
			}),
	},
})

export const { getAddressInfo, getAddressInfoSuccess, getAddressInfoFailure } =
	actions

export { default as addressInfoSaga } from './sagas'

export default reducer
