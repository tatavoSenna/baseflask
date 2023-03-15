import { extend } from 'lodash'
import update from 'immutability-helper'
import { successMessage } from '~/services/messager'
import { v4 as uuidv4 } from 'uuid'

const formatWorkflowNodes = (workflowNodes) => {
	const workflowNodesList = []
	for (const key in workflowNodes) {
		workflowNodesList.push(workflowNodes[key])
	}
	return workflowNodesList
}

export const selectEdit = (data, payload) => {
	let partiesList = []
	let signersCount = 0
	while (signersCount < payload.signers.length) {
		const party = {
			partyTitle: payload.signers[signersCount].party,
			partySigners: [],
		}
		for (let i = signersCount; i < payload.signers.length; i++) {
			if (payload.signers[i].party === party.partyTitle) {
				party.partySigners.push(payload.signers[i])
				signersCount += 1
			} else {
				break
			}
		}
		partiesList.push(party)
	}

	let form = payload.form

	const pageVariables = form.map((page) => page.fields.map(getVariable))

	form.forEach((page) => {
		page.ids = page.fields.map(() => uuidv4())
		page.valid = page.fields.map(() => true)
	})

	const temp = extend(data, {
		title: payload.name,
		form: form,
		text: payload.textfile,
		workflow: extend(payload.workflow, {
			nodes: formatWorkflowNodes(payload.workflow.nodes),
		}),
		signers: extend(data.signers, {
			parties: partiesList,
		}),
		variables: pageVariables,
	})
	return temp
}

const getVariable = (field) => {
	let variable
	if (field.structure) {
		let structure
		if (Array.isArray(field.structure)) {
			structure = field.structure.map((f) => f.variable)
		} else {
			structure = [field.structure.variable]
		}

		variable = {
			...field.variable,
			structure: structure,
		}
	} else if (field.fields) {
		variable = getSubfieldVariables(field)
	} else {
		variable = field.variable
	}

	return variable
}

const getSubfieldVariables = (field) => {
	let fields = []
	if (Array.isArray(field.fields)) {
		fields = field.fields.map((f) => f.toUpperCase())
	}

	if (
		field?.variable?.type === 'person' &&
		Array.isArray(field?.person_type) &&
		field.person_type.length > 1
	) {
		fields.push('PERSON_TYPE')
	}

	return {
		fields: fields,
		...field.variable,
	}
}

export const selectForm = (form, payload) => {
	if (payload.name === 'title') {
		const newForm = update(form, {
			[payload.pageIndex]: { title: { $set: payload.value } },
		})
		return newForm
	} else if (payload.name === 'field') {
		successMessage({
			content: 'Campo salvo com sucesso.',
		})
		return update(form, {
			[payload.pageIndex]: {
				fields: { [payload.fieldIndex]: { $set: payload.value } },
			},
		})
	}
}

export const addPage = (form, newPage, currentIndex, reference) => {
	const formCopy = form.map((item) => ({ ...item }))
	formCopy.splice(parseInt(currentIndex) + 1, 0, {
		...reference[0],
		...newPage,
	})

	return formCopy
}

export const addField = (form, payload) => {
	return form.map((page, index) => {
		if (index === payload.pageIndex) {
			return extend(page, {
				fields: [...page.fields, payload.newField],
				ids: [...page.ids, uuidv4()],
				valid: [...page.valid, true],
			})
		}
		return page
	})
}

export const removeField = (form, payload) => {
	return form.map((page, index) => {
		if (index === payload.pageIndex) {
			return extend(page, {
				fields: page.fields.filter(
					(field, index) => index !== payload.fieldIndex
				),
				ids: page.ids.filter((field, index) => index !== payload.fieldIndex),
				valid: page.valid.filter(
					(field, index) => index !== payload.fieldIndex
				),
			})
		}
		return page
	})
}

export const validField = (form, payload) => {
	return form.map((page, index) => {
		if (index === payload.pageIndex) {
			return extend(page, {
				valid: page.valid.map((value, index) =>
					index === payload.fieldIndex ? payload.value : value
				),
			})
		}
		return page
	})
}

export const selectStep = (workflow, payload) => {
	const { node, index } = payload
	const { nodes } = workflow
	nodes[index] = node
	return extend(workflow, { nodes })
}

export const addStep = (workflow, payload) => {
	const tmpList = workflow.nodes.map((node, index) => {
		if (index === payload.count - 1) {
			return extend(node, {
				next_node: `${payload.count}`,
			})
		}
		return node
	})
	return extend(workflow, {
		nodes: [...tmpList, payload.newStep],
	})
}

export const removeStep = (workflow, payload) => {
	const tmpList = workflow.nodes.filter(
		(node, index) => index !== payload.index
	)
	return extend(workflow, {
		nodes: tmpList.map((node, index) => {
			if (index === tmpList.length - 1) {
				return extend(node, {
					next_node: null,
				})
			} else if (index >= payload.index) {
				return extend(node, {
					next_node: `${node.next_node - 1}`,
				})
			}
			return node
		}),
	})
}

export const selectParties = (signers, payload) => {
	// If payload.name is an integer, means the field that triggered the event is on the fields array
	if (Number.isInteger(payload.name)) {
		return extend(signers, {
			parties: signers.parties.map((party, index) => {
				if (index === payload.partyIndex) {
					return extend(party, {
						partySigners: party.partySigners.map((signer, index) => {
							if (index === payload.signerIndex) {
								return extend(signer, {
									fields: signer.fields.map((field, index) => {
										if (index === payload.name) {
											return extend(field, {
												variable: payload.value.toUpperCase(),
											})
										}
										return field
									}),
								})
							}
							return signer
						}),
					})
				}
				return party
			}),
		})
	}

	if (payload.name === 'title') {
		return extend(signers, {
			parties: signers.parties.map((party, index) => {
				if (index === payload.partyIndex) {
					return extend(party, {
						partySigners: party.partySigners.map((signer, index) => {
							if (index === payload.signerIndex) {
								return extend(signer, {
									title: payload.value,
								})
							}
							return signer
						}),
					})
				}
				return party
			}),
		})
	}

	if (payload.name === 'partyTitle') {
		return extend(signers, {
			parties: signers.parties.map((party, index) => {
				if (index === payload.partyIndex) {
					return extend(party, {
						partyTitle: payload.value,
						partySigners: party.partySigners.map((signer) =>
							extend(signer, {
								party: payload.value,
							})
						),
					})
				}
				return party
			}),
		})
	}

	if (payload.name === 'anchor_string') {
		return extend(signers, {
			parties: signers.parties.map((party, index) => {
				if (index === payload.partyIndex) {
					return extend(party, {
						partySigners: party.partySigners.map((signer, index) => {
							if (index === payload.signerIndex) {
								return extend(signer, {
									anchor: signer.anchor.map((anchor) => {
										return extend(anchor, {
											anchor_string: payload.value,
										})
									}),
								})
							}
							return signer
						}),
					})
				}
				return party
			}),
		})
	}

	if (payload.name.slice(9) === 'offset') {
		return extend(signers, {
			parties: signers.parties.map((party, index) => {
				if (index === payload.partyIndex) {
					return extend(party, {
						partySigners: party.partySigners.map((signer, index) => {
							if (index === payload.signerIndex) {
								return extend(signer, {
									anchor: signer.anchor.map((anchor) => {
										if (payload.name[7] === 'x') {
											return extend(anchor, {
												anchor_x_offset: payload.value,
											})
										}
										return extend(anchor, {
											anchor_y_offset: payload.value,
										})
									}),
								})
							}
							return signer
						}),
					})
				}
				return party
			}),
		})
	}
}

export const addVariable = (variables, payload) => {
	const newVariables = update(variables, { [payload.pageIndex]: { $push: [] } })
	return newVariables
}

export const removeVariable = (variables, payload) => {
	const newVariables = update(variables, {
		[payload.pageIndex]: { $splice: [[payload.fieldIndex, 1]] },
	})
	return newVariables
}

export const selectVariable = (variables, payload) => {
	if (payload.name === 'field') {
		const field = payload.value
		if (field.type !== 'separator') {
			let variable = getVariable(field)

			const newVariables = update(variables, {
				[payload.pageIndex]: { [payload.fieldIndex]: { $set: variable } },
			})
			return newVariables
		}
	}
	return variables
}

export const move = (data, payload) => {
	const moveArrayItem = (array, from, to) => {
		let tmpList = [...array]
		const item = array[from]
		tmpList.splice(from, 1)
		tmpList.splice(to, 0, item)
		return tmpList
	}
	switch (payload.name) {
		case 'form':
			return extend(data, {
				form: data.form.map((page, index) => {
					if (index === payload.listIndex) {
						return extend(page, {
							fields: moveArrayItem(page.fields, payload.from, payload.to),
							ids: moveArrayItem(page.ids, payload.from, payload.to),
							valid: moveArrayItem(page.valid, payload.from, payload.to),
						})
					}
					return page
				}),
				variables: data.variables.map((page, index) => {
					if (index === payload.listIndex) {
						return moveArrayItem(page, payload.from, payload.to)
					}
					return page
				}),
			})

		case 'workflow':
			let tmpList = data.workflow.nodes
			const dragged = tmpList[payload.from]
			tmpList.splice(payload.from, 1)
			tmpList.splice(payload.to, 0, dragged)

			tmpList.forEach((node, index) => {
				node.next_node = index === tmpList.length - 1 ? null : `${index + 1}`
			})

			return extend(data, {
				workflow: extend(data.workflow, {
					nodes: tmpList,
				}),
			})

		case 'signers':
			return extend(data, {
				signers: {
					parties: data.signers.parties.map((party, index) => {
						if (index === payload.listIndex) {
							let tmpList = party.partySigners
							const dragged = tmpList[payload.from]
							tmpList.splice(payload.from, 1)
							tmpList.splice(payload.to, 0, dragged)

							return extend(party, {
								partySigners: tmpList,
							})
						}
						return party
					}),
				},
			})

		default:
			return data
	}
}

export const movePage = (form, payload) => {
	let tmpForm = form
	const dragged = tmpForm[payload.from]
	tmpForm.splice(payload.from, 1)
	tmpForm.splice(payload.to, 0, dragged)

	return tmpForm
}
