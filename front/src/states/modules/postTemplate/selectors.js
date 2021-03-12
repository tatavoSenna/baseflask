import { extend } from 'lodash'

export const selectStep = (workflow, payload) => {
	return extend(workflow, {
		nodes: workflow.nodes.map((node, index) => {
			if (index === payload.index) {
				switch (payload.name) {
					case 'title':
						return extend(node, {
							title: payload.value,
						})
					case 'responsible_user':
						return extend(node, {
							responsible_user: payload.value,
						})
					case 'responsible_groups':
						return extend(node, {
							responsible_groups: [payload.value],
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
