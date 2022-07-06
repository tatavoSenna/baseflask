export const fieldStructure = (type) => {
	let field = {
		type: `${type}`,
		label: '',
		info: '',
		variable: {
			name: '',
		},
		initialValue: '',
		optional: false,
	}

	switch (type) {
		case 'time':
			field.variable.type = 'time'
			field.minute_step = ''
			break
		case 'number':
			field.variable.type = 'number'
			field.variable.doc_display_style = 'plain | extended | ordinal'
			field.decimals = ''
			field.min = ''
			field.max = ''
			field.step = ''
			break
		case 'date':
			field.variable.type = 'date'
			field.variable.doc_display_style = '%d/%m/%Y | extended'
			break
		case 'checkbox':
			field.variable.type = 'list'
			field.variable.doc_display_style = 'commas | bullets'
			break
		case 'currency':
			field.initialValue = 0
			field.variable.type = 'currency'
			field.variable.doc_display_style = 'plain | extended'
			break
		case 'database':
			field.variable.type = 'database'
			field.variable.database_endpoint = ''
			field.variable.search_key = ''
			field.variable.display_key = ''
			break
		case 'variable_image':
			field.variable.type = 'variable_image'
			field.variable.doc_display_style = 'image'
			field.variable.width = 8.0
			break
		case 'person':
			field.variable.type = 'person'
			field.label = ''
			field.person_type = ['legal_person', 'natural_person']
			field.fields = [
				'nationality',
				'cpf',
				'pronoun',
				'name',
				'surname',
				'identity',
				'identity_org',
				'identity_date',
				'email',
				'marital_state',
				'property_regime',
				'profession',
				'legal_nationality',
				'cnpj',
				'society_name',
				'activity',
				'cep',
				'country',
				'number',
				'street',
				'complement',
				'state',
				'district',
				'city',
				'attorney_nationality',
				'attorney_cpf',
				'attorney_pronoun',
				'attorney_name',
				'attorney_surname',
				'attorney_identity',
				'attorney_identity_org',
				'attorney_identity_date',
				'attorney_email',
				'attorney_profession',
				'attorney_cep',
				'attorney_country',
				'attorney_number',
				'attorney_street',
				'attorney_complement',
				'attorney_state',
				'attorney_district',
				'attorney_city',
			]
			field.initialValue = field.fields.reduce(
				(a, field) => ({ ...a, [field]: '' }),
				{ person_type: '' }
			)

			delete field['info']
			break
		case 'address':
			field.variable.type = 'address'
			field.label = ''
			field.fields = [
				'cep',
				'country',
				'number',
				'street',
				'complement',
				'district',
				'state',
				'city',
			]

			field.initialValue = field.fields.reduce(
				(a, field) => ({ ...a, [field]: '' }),
				{}
			)

			delete field['info']
			break
		case 'structured_list':
			field.variable.type = type
			field.variable.doc_display_style = 'text'
			field.variable.extra_style_params = {
				row_template: '',
				separator: '',
			}
			field.structure = [
				{
					type: 'text',
					label: '',
					info: '',
					variable: {
						name: '',
						type: 'string',
						doc_display_style: '',
					},
				},
			]
			break
		case 'structured_checkbox':
			field.variable.type = type
			field.variable.doc_display_style = 'text'
			field.variable.extra_style_params = {
				row_template: '',
				separator: '',
			}
			field.structure = [
				{
					type: 'text',
					label: '',
					info: '',
					variable: {
						name: '',
						type: '',
						doc_display_style: '',
					},
				},
			]
			break
		case 'separator':
			field = {
				type: 'separator',
				title: '',
			}
			break
		case 'text':
			field.placeholder = ''
			field.variable.type = 'string'
			field.variable.doc_display_style =
				'plain | sentence_case | uppercase | lowercase'
			break
		case 'text_area':
			field.placeholder = ''
			field.variable.type = 'string'
			field.variable.doc_display_style =
				'plain | sentence_case | uppercase | lowercase'
			break
		default:
			field.variable.type = 'string'
			field.variable.doc_display_style =
				'plain | sentence_case | uppercase | lowercase'
			break
	}

	const hasOptions = ['dropdown', 'radio', 'checkbox', 'structured_checkbox']
	if (hasOptions.includes(type)) {
		field.options = [
			{ label: '', value: '' },
			{ label: '', value: '' },
			{ label: '', value: '' },
		]
	}

	return field
}
