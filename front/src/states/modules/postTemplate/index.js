import { extend } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

import {
	selectForm,
	addField,
	removeField,
	selectStep,
	addStep,
	removeStep,
	selectParties,
	selectEdit,
	addVariable,
	removeVariable,
	selectVariable,
	move,
} from './selectors'

const initialState = {
	data: {
		title: '',
		form: [
			{
				title: '',
				fields: [],
			},
		],
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
			parties: [],
		},
		variables: [[]],
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
		resetTemplateState: () => initialState,
		getTemplateDetail: (state) =>
			extend(state, {
				loading: true,
			}),
		getTemplateDetailSuccess: (state, { payload }) =>
			extend(state, {
				data: selectEdit(state.data, payload),
				loading: false,
			}),
		getTemplateDetailFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		postTemplateFormInfo: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: selectForm(state.data.form, payload),
					variables: selectVariable(state.data.variables, payload),
				}),
			}),
		postTemplatePageAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: [...state.data.form, payload.newPage],
					variables: [...state.data.variables, []],
				}),
			}),
		postTemplatePageRemove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: state.data.form.filter(
						(page, index) => index !== payload.pageIndex
					),
					variables: state.data.variables.filter(
						(page, index) => index !== payload.pageIndex
					),
				}),
			}),
		postTemplateFieldAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: addField(state.data.form, payload),
					variables: addVariable(state.data.variables, payload),
				}),
			}),
		postTemplateFieldRemove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: removeField(state.data.form, payload),
					variables: removeVariable(state.data.variables, payload),
				}),
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
		postTemplateMove: (state, { payload }) =>
			extend(state, {
				data: move(state.data, payload),
			}),
		postTemplateText: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					text: payload.value,
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
	resetTemplateState,
	getTemplateDetail,
	getTemplateDetailSuccess,
	getTemplateDetailFailure,
	postTemplateFormInfo,
	postTemplatePageAdd,
	postTemplatePageRemove,
	postTemplateFieldAdd,
	postTemplateFieldRemove,
	postTemplateStepInfo,
	postTemplateStepAdd,
	postTemplateStepRemove,
	postTemplateSignersInfo,
	postTemplateSignerAdd,
	postTemplateSignerRemove,
	postTemplatePartyAdd,
	postTemplatePartyRemove,
	postTemplateSignersAppend,
	postTemplateText,
	postTemplateRequest,
	postTemplateSuccess,
	postTemplateFailure,
	postTemplateMove,
} = actions

export { default as postTemplateSaga } from './sagas'

export default reducer
