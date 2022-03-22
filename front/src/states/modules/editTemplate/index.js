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
	movePage,
} from './selectors'

const initialState = {
	data: {
		title: '',
		form: [
			{
				title: '',
				fields: [],
				ids: [],
			},
		],
		workflow: {
			nodes: [],
		},
		text: '',
		isFile: false,
		signers: {
			parties: [],
		},
		variables: [[]],
	},
	groupsUsers: {
		loading: false,
		data: {},
	},
	error: null,
	loading: false,
	docPosted: false,
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
				docPosted: true,
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
					form: [
						...state.data.form,
						{ ...initialState.data.form[0], ...payload.newPage },
					],
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
		editTemplatePageMove: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: movePage(state.data.form, payload),
				}),
			}),
		editTemplateFieldAdd: (state, { payload }) =>
			extend(state, {
				data: extend(state.data, {
					form: addField(state.data.form, payload),
					variables: addVariable(state.data.variables, payload),
				}),
			}),
		editTemplateFieldRemove: (state, { payload }) => {
			return extend(state, {
				data: extend(state.data, {
					form: removeField(state.data.form, payload),
					variables: removeVariable(state.data.variables, payload),
				}),
			})
		},
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
				docPosted: true,
			}),
		editTemplateFailure: (state, { payload }) =>
			extend(state, {
				loading: false,
				error: payload.error,
			}),
		getTemplateDownload: (state) =>
			extend(state, {
				loading: true,
			}),
		getTemplateDownloadSuccess: (state) =>
			extend(state, {
				loading: false,
			}),
		getTemplateDownloadFailure: (state, { payload }) =>
			extend(state, {
				error: payload.error,
				loading: false,
			}),
		setDocPosted: (state, { payload }) =>
			extend(state, {
				docPosted: payload,
			}),
		getGroupsUsers: (state, { payload }) => {
			const { groupsUsers } = state
			groupsUsers.loading = true
			extend(state, {
				groupsUsers,
			})
		},
		getGroupsUsersSuccess: (state, { payload }) => {
			const { groupId, data } = payload
			const { groupsUsers } = state
			groupsUsers.data[groupId] = data.users
			groupsUsers.loading = false
			extend(state, { groupsUsers })
		},
		getGroupsUsersFailure: (state) => {
			const { groupsUsers } = state
			groupsUsers.loading = false
			extend(state, { groupsUsers })
		},
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
	editTemplatePageMove,
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
	getTemplateDownload,
	getTemplateDownloadSuccess,
	getTemplateDownloadFailure,
	setDocPosted,
	getGroupsUsers,
	getGroupsUsersSuccess,
	getGroupsUsersFailure,
} = actions

export { default as editTemplateSaga } from './sagas'

export default reducer
