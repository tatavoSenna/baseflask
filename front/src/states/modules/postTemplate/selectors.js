import { extend } from 'lodash'
import update from 'immutability-helper'
import { errorMessage, successMessage } from '~/services/messager'

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

	const pagesList = []
	payload.form.forEach((page) => {
		const pageList = []
		page.fields.forEach((field) => {
			pageList.push(field.variable)
		})
		pagesList.push(pageList)
	})

	return extend(data, {
		title: payload.name,
		form: payload.form,
		text: payload.textfile,
		workflow: extend(data.workflow, {
			nodes: Object.values(payload.workflow.nodes),
		}),
		signers: extend(data.signers, {
			parties: partiesList,
		}),
		variables: pagesList,
	})
}

export const selectForm = (form, payload) => {
	if (payload.name === 'title') {
		const newForm = update(form, {
			[payload.pageIndex]: { title: { $set: payload.value } },
		})
		return newForm
	} else if (payload.name === 'field') {
		try {
			const fieldJSON = JSON.parse(payload.value)
			successMessage({
				content: 'Campo salvo com sucesso.',
			})
			return update(form, {
				[payload.pageIndex]: {
					fields: { [payload.fieldIndex]: { $set: fieldJSON } },
				},
			})
		} catch {
			errorMessage({
				content: 'Não foi possível salvar o campo. Insira JSON válido.',
			})
		}
	}
}

export const addField = (form, payload) => {
	return form.map((page, index) => {
		if (index === payload.pageIndex) {
			return extend(page, {
				fields: [...page.fields, payload.newField],
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
			})
		}
		return page
	})
}

export const selectStep = (workflow, payload) => {
	return extend(workflow, {
		nodes: workflow.nodes.map((node, index) => {
			if (index === payload.index) {
				switch (payload.name) {
					case 'title':
						return extend(node, {
							title: payload.value,
						})
					case 'responsible_users':
						return extend(node, {
							responsible_users: payload.value,
						})
					case 'responsible_group':
						return extend(node, {
							responsible_group: payload.value,
						})
					default:
						return node
				}
			} else {
				return node
			}
		}),
	})
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
		const fieldJSON = JSON.parse(payload.value)
		const variable =
			fieldJSON.variable !== undefined
				? fieldJSON.variable
				: fieldJSON.variables
		const newVariables = update(variables, {
			[payload.pageIndex]: { [payload.fieldIndex]: { $set: variable } },
		})
		return newVariables
	}
	return variables
}

export const move = (data, payload) => {
	switch (payload.name) {
		case 'form':
			return extend(data, {
				form: data.form.map((page, index) => {
					if (index === payload.listIndex) {
						let tmpList = page.fields
						const dragged = tmpList[payload.from]
						tmpList.splice(payload.from, 1)
						tmpList.splice(payload.to, 0, dragged)

						return extend(page, {
							fields: tmpList,
						})
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
