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
		editTemplateTitle: (state, { payload }) =>
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
		editTemplateFormInfo: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: selectForm(state.data.form, payload),
					variables: selectVariable(state.data.variables, payload),
				}),
			}),
		editTemplatePageAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: [...state.data.form, payload.newPage],
					variables: [...state.data.variables, []],
				}),
			}),
		editTemplatePageRemove: (state, { payload }) =>
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
		editTemplateFieldAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: addField(state.data.form, payload),
					variables: addVariable(state.data.variables, payload),
				}),
			}),
		editTemplateFieldRemove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: removeField(state.data.form, payload),
					variables: removeVariable(state.data.variables, payload),
				}),
			}),
		editTemplateStepInfo: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					workflow: selectStep(state.data.workflow, payload),
				}),
			}),
		editTemplateStepAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					workflow: addStep(state.data.workflow, payload),
				}),
			}),
		editTemplateStepRemove: (state, { payload }) =>
			extend(state, {
				workflow: removeStep(state.data.workflow, payload),
			}),
		editTemplateSignersInfo: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: selectParties(state.data.signers, payload),
				}),
			}),
		editTemplateSignerAdd: (state, { payload }) =>
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
		editTemplateSignerRemove: (state, { payload }) =>
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
		editTemplatePartyAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: [...state.data.signers.parties, payload.newParty],
					}),
				}),
			}),
		editTemplatePartyRemove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					signers: extend(state.data.signers, {
						parties: state.data.signers.parties.filter(
							(party, index) => index !== payload.partyIndex
						),
					}),
				}),
			}),
		editTemplateMove: (state, { payload }) =>
			extend(state, {
				data: move(state.data, payload),
			}),
		editTemplateText: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					text: payload.value,
				}),
			}),
		editTemplateRequest: (state) =>
			extend(state, {
				loading: true,
			}),
		editTemplateSuccess: (state) =>
			extend(state, {
				loading: false,
			}),
		editTemplateFailure: (state, { payload }) =>
			extend(state, {
				loading: false,
				error: payload.error,
			}),
	},
})

export const {
	editTemplateTitle,
	resetTemplateState,
	getTemplateDetail,
	getTemplateDetailSuccess,
	getTemplateDetailFailure,
	editTemplateFormInfo,
	editTemplatePageAdd,
	editTemplatePageRemove,
	editTemplateFieldAdd,
	editTemplateFieldRemove,
	editTemplateStepInfo,
	editTemplateStepAdd,
	editTemplateStepRemove,
	editTemplateSignersInfo,
	editTemplateSignerAdd,
	editTemplateSignerRemove,
	editTemplatePartyAdd,
	editTemplatePartyRemove,
	editTemplateSignersAppend,
	editTemplateText,
	editTemplateRequest,
	editTemplateSuccess,
	editTemplateFailure,
	editTemplateMove,
} = actions

export { default as editTemplateSaga } from './sagas'

export default reducer
