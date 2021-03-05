import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

import { selectParties } from './selectors'

const initialState = {
	data: {
		title: '',
		form: {},
		workflow: {},
		text: '',
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
					validation: {
						title: false,
						signers: [
							{
								title: false,
								anchor: [{ anchor_string: false }],
								fields: [false, false],
							},
						],
					},
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
		postTemplateTitle: (state, { payload }) => {
			extend(state, {
				data: { ...state.data, title: payload.title },
			})
			state.data.title = payload.title
		},
		postTemplateSignersInfo: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					signers: selectParties(state.data.signers, payload),
				}),
			})
		},
		postTemplateSignersAdd: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.map((party, index) => {
							if (index === payload.partyIndex) {
								return extend(party, {
									partySigners: [...party.partySigners, payload.newSigner],
									validation: extend(party.validation, {
										signers: [...party.validation.signers, payload.validation],
									}),
								})
							}
							return party
						}),
					}),
				}),
			})
		},
		postTemplateSignersRemove: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.map((party, index) => {
							if (index === payload.partyIndex) {
								return extend(party, {
									partySigners: party.partySigners.filter(
										(signer, index) => index !== payload.signerIndex
									),
									validation: extend(party.validation, {
										signers: party.validation.signers.filter(
											(signer, index) => index !== payload.signerIndex
										),
									}),
								})
							}
							return party
						}),
					}),
				}),
			})
		},
		postTemplatePartyAdd: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: [...state.data.signers.parties, payload.newParty],
					}),
				}),
			})
		},
		postTemplatePartyRemove: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.filter(
							(party, index) => index !== payload.partyIndex
						),
					}),
				}),
			})
		},
		postTemplateAppend: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					[payload.name]: payload.value,
				}),
			})
		},
		postTemplateRequest: (state) => state,
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
	postTemplateSignersInfo,
	postTemplateSignersAdd,
	postTemplateSignersRemove,
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
