import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

import {
	selectStep,
	addStep,
	removeStep,
	selectParties,
	selectEdit,
} from './selectors'

const initialState = {
	data: {
		title: '',
		form: '',
		workflow: {
			nodes: [
				{
					title: '',
					next_node: null,
					responsible_users: [],
					responsible_group: '',
					changed_by: '',
				},
			],
		},
		text: '',
		isFile: false,
		signers: {
			parties: [
				{
					partyTitle: '',
					partySigners: [
						{
							title: '',
							party: '',
							anchor: [
								{
									anchor_string: '',
									anchor_x_offset: 0.0,
									anchor_y_offset: 0.0,
								},
							],
							fields: [
								{
									type: 'text',
									label: '',
									value: 'Nome',
									variable: '',
								},
								{
									type: 'email',
									label: '',
									value: 'Email',
									variable: '',
								},
							],
							status: '',
							signing_date: '',
						},
					],
				},
			],
		},
	},
	error: null,
	loading: false,
}

const { actions, reducer } = createSlice({
	name: 'post',
	initialState,
	reducers: {
		postTemplateTitle: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					title: payload.title,
				}),
			}),
		getTemplateDetail: (state) =>
			extend(state, {
				loading: true,
			}),
		getTemplateDetailSuccess: (state, { payload }) => {
			extend(state, {
				data: selectEdit(state.data, payload),
				loading: false,
			})
		},
		getTemplateDetailFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		postTemplateStepInfo: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					workflow: selectStep(state.data.workflow, payload),
				}),
			}),
		postTemplateStepAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					workflow: addStep(state.data.workflow, payload),
				}),
			}),
		postTemplateStepRemove: (state, { payload }) =>
			extend(state, {
				workflow: removeStep(state.data.workflow, payload),
			}),
		postTemplateSignersInfo: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: selectParties(state.data.signers, payload),
				}),
			}),
		postTemplateSignerAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.map((party, index) => {
							if (index === payload.partyIndex) {
								return extend(party, {
									partySigners: [...party.partySigners, payload.newSigner],
								})
							}
							return party
						}),
					}),
				}),
			}),
		postTemplateSignerRemove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.map((party, index) => {
							if (index === payload.partyIndex) {
								return extend(party, {
									partySigners: party.partySigners.filter(
										(signer, index) => index !== payload.signerIndex
									),
								})
							}
							return party
						}),
					}),
				}),
			}),
		postTemplatePartyAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: [...state.data.signers.parties, payload.newParty],
					}),
				}),
			}),
		postTemplatePartyRemove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.filter(
							(party, index) => index !== payload.partyIndex
						),
					}),
				}),
			}),
		postTemplateAppend: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					[payload.name]: payload.value,
				}),
			}),
		postTemplateRequest: (state) =>
			extend(state, {
				loading: true,
			}),
		postTemplateSuccess: (state) =>
			extend(state, {
				loading: false,
			}),
		postTemplateFailure: (state, { payload }) =>
			extend(state, {
				loading: false,
				error: payload.error,
			}),
	},
})

export const {
	postTemplateTitle,
	getTemplateDetail,
	getTemplateDetailSuccess,
	getTemplateDetailFailure,
	postTemplateStepInfo,
	postTemplateStepAdd,
	postTemplateStepRemove,
	postTemplateSignersInfo,
	postTemplateSignerAdd,
	postTemplateSignerRemove,
	postTemplatePartyAdd,
	postTemplatePartyRemove,
	postTemplateSignersAppend,
	postTemplateAppend,
	postTemplateRequest,
	postTemplateSuccess,
	postTemplateFailure,
} = actions

export { default as postTemplateSaga } from './sagas'

export default reducer
