import _ from 'lodash'
import moment from 'moment'

export const selectAllDocumentDetail = (payload) => {
	let formatingInitialValue
	formatingInitialValue = payload.form.map((page) => {
		return {
			...page,
			fields: page.fields
				.map((field) => {
					if (!['structured_checkbox'].includes(field.type)) {
						if (field.variable?.name) {
							if (payload.variables[field.variable.name]) {
								if (
									typeof payload.variables[field.variable.name] === 'object' &&
									!Array.isArray(payload.variables[field.variable.name])
								) {
									field.initialValue = _.mapKeys(
										payload.variables[field.variable.name],
										(value, key) => key.toLowerCase()
									)
								} else {
									field.initialValue = payload.variables[field.variable.name]

									if (field.type === 'structured_list') {
										const clonedInitialValue = [].concat(
											payload.variables[field.variable.name]
										)

										clonedInitialValue.map((element) => {
											for (let key in element) {
												// sees if value is date by regex analysis
												// regex sees if value has - T00:00:00.000Z with is part of ISO-8601 date representation

												if (
													/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(
														element[key]
													)
												)
													// formatting date and transform in moment object
													element[key] = moment(
														moment(element[key]).utc().format('DD/MM/YYYY'),
														'DD/MM/YYYY'
													)
											}
											return element
										})

										field.initialValue = clonedInitialValue
									}
								}
							} else if (
								field.type === 'variable_image' &&
								payload.variables['image_' + field.variable.name]
							) {
								field.initialValue =
									payload.variables['image_' + field.variable.name]
							}
						}
						return field
					}
					return null
				})
				.filter((x) => x !== null),
		}
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
