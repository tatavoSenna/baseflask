import _ from 'lodash'

export const selectAllDocumentDetail = (payload) => {
	let formatingInitialValue
	formatingInitialValue = payload.form.map((form, j) => {
		form.fields.map((field) => {
			if (!field.variable.type.includes('structured_list')) {
				if (payload.variables[field.variable.name]) {
					if (
						typeof payload.variables[field.variable.name] === 'object' &&
						!Array.isArray(payload.variables[field.variable.name])
					) {
						payload.variables[field.variable.name] = _.mapKeys(
							payload.variables[field.variable.name],
							(value, key) => key.toLowerCase()
						)
					}
					field.initialValue = payload.variables[field.variable.name]
				}
			}
			return field
		})
		return form
	})

	return {
		...payload,
		form: formatingInitialValue,
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
