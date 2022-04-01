import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	legalInfo: {},
}

const { actions, reducer } = createSlice({
	name: 'legalInfo',
	initialState,
	reducers: {
		getLegalInfo: (state) =>
			extend(state, {
				loading: true,
			}),
		getLegalInfoSuccess: (state, { payload }) => {
			return extend(state, {
				legalInfo: { ...state.legalInfo, [payload.ni]: payload },
				loading: false,
			})
		},
		getLegalInfoFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const { getLegalInfo, getLegalInfoSuccess, getLegalInfoFailure } =
	actions

export { default as legalInfoSaga } from './sagas'

export default reducer
