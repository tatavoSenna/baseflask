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
	companyInfo: {
		id: 0,
		name: '',
		stripeCompanyEmail: '',
		remainingDocuments: 0,
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
		getCompanyListFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),

		updateNewCompany: (state, { payload }) => {
			extend(state, {
				newCompany: extend(state.newCompany, {
					name: payload.name,
				}),
			})
		},
		getCompanyInfo: (state) =>
			extend(state, {
				loading: true,
			}),
		getCompanyInfoSuccess: (state, { payload }) => {
			extend(state, {
				loading: false,
				companyInfo: extend(state.companyInfo, {
					id: payload.id,
					name: payload.name,
					stripeDocumentEmail: payload.stripe_document_email,
					remainingDocuments: payload.remaining_documents,
				}),
			})
		},
		getCompanyInfoFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		addCompany: (state) =>
			extend(state, {
				loading: true,
			}),
		addCompanySuccess: (state) => {
			extend(state, {
				loading: false,
				error: undefined,
			})
		},
		addCompanyFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),

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
		changeUserCompany: (state) =>
			extend(state, {
				loading: true,
			}),
		changeUserCompanySuccess: (state, { payload }) => {
			extend(state, {
				loading: false,
			})
		},
		changeUserCompanyFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
	},
})

export const {
	getCompanyList,
	getCompanyListSuccess,
	updateNewCompany,
	getCompanyListFailure,
	getCompanyInfo,
	getCompanyInfoSuccess,
	getCompanyInfoFailure,
	addCompany,
	addCompanySuccess,
	addCompanyFailure,
	resetNewCompany,
	setShowModal,
	changeUserCompany,
	changeUserCompanySuccess,
	changeUserCompanyFailure,
} = actions

export { default as companiesSaga } from './sagas'

export default reducer
