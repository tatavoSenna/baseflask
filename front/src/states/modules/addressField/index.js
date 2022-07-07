import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	error: {},
	data: {},
}

const { actions, reducer } = createSlice({
	name: 'addressInfo',
	initialState,
	reducers: {
		getAddressInfo: (state) => extend(state, { loading: true }),
		getAddressInfoSuccess: (state, { payload }) => {
			const keyCep = payload.cep.replace(/[^0-9]/g, '')
			return extend(state, {
				data: { ...state.data, [keyCep]: payload },
				loading: false,
			})
		},
		getAddressInfoFailure: (state, { payload }) =>
			extend(state, { error: payload.error, loading: false }),
	},
})

export const { getAddressInfo, getAddressInfoSuccess, getAddressInfoFailure } =
	actions

export { default as addressInfoSaga } from './sagas'

export default reducer
