export const selectAllDocumentDetail = (payload) => {
	return {
		...payload,
		workflow: {
			...payload.workflow,
			current: payload.workflow.steps
				.map((item) => item.step)
				.indexOf(payload.workflow.current_step),
		},
		signers: payload.signers.map((signer) => {
			signer.fields = signer.fields.map((field) => {
				if (payload.variables.hasOwnProperty(field.variable)) {
					field.valueVariable = payload.variables[field.variable]
				}
				return field
			})
			return signer
		}),
	}
}

export const selectAllDocumentVersions = (payload) => {
	return {
		...payload.document,
		workflow: {
			...payload.document.workflow,
			current: payload.document.workflow.steps
				.map((item) => item.step)
				.indexOf(payload.document.workflow.current_step),
		},
		versions: payload.versions,
	}
}

export const selectAllDocumentSelectVersion = (payload) => {
	return {
		...payload.document,
		workflow: {
			...payload.document.workflow,
			current: payload.document.workflow.steps
				.map((item) => item.step)
				.indexOf(payload.document.workflow.current_step),
		},
	}
}
