import extend from 'lodash/extend'
import { createSlice } from '@reduxjs/toolkit'
import { selectAllCompanies } from './selectors'

const initialState = {
	loading: false,
	companyList: [],
	showModal: false,
	newCompany: {
		name: '',
	},
	pages: {
		page: 0,
		per_page: 0,
		total: 0,
	},
}

const { actions, reducer } = createSlice({
	name: 'company',
	initialState,
	reducers: {
		getCompanyList: (state) =>
			extend(state, {
				loading: true,
			}),
		getCompanyListSuccess: (state, { payload }) => {
			extend(state, {
				loading: false,
				companyList: selectAllCompanies(payload.items),
				pages: {
					page: payload.page,
					per_page: payload.per_page,
					total: payload.total,
				},
			})
		},
		updateNewCompany: (state, { payload }) => {
			extend(state, {
				newCompany: extend(state.newCompany, {
					name: payload.name,
				}),
			})
		},
		addCompany: (state) => extend(state),
		resetNewCompany: (state) =>
			extend(state, {
				newCompany: extend(state.newCompany, {
					name: '',
				}),
			}),
		setShowModal: (state, { payload }) =>
			extend(state, {
				showModal: payload,
			}),
	},
})

export const {
	getCompanyList,
	getCompanyListSuccess,
	updateNewCompany,
	getCompanyListFailure,
	addCompany,
	resetNewCompany,
	setShowModal,
} = actions

export { default as companiesSaga } from './sagas'

export default reducer
