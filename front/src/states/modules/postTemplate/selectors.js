import { extend } from 'lodash'

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
						validation: extend(party.validation, {
							signers: party.validation.signers.map((signer, index) => {
								if (index === payload.signerIndex) {
									return extend(signer, {
										fields: signer.fields.map((field, index) => {
											if (index === payload.name) {
												return !payload.value
											}
											return field
										}),
									})
								}
								return signer
							}),
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
						validation: extend(party.validation, {
							signers: party.validation.signers.map((signer, index) => {
								if (index === payload.signerIndex) {
									return extend(signer, {
										title: !payload.value,
									})
								}
								return signer
							}),
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
						validation: extend(party.validation, {
							title: !payload.value,
						}),
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
						validation: extend(party.validation, {
							signers: party.validation.signers.map((signer, index) => {
								if (index === payload.signerIndex) {
									return extend(signer, {
										anchor: signer.anchor.map((anchor) => {
											return extend(anchor, {
												anchor_string: !payload.value,
											})
										}),
									})
								}
								return signer
							}),
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
