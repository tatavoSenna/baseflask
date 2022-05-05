const attorney = {
	attorney_cpf: {
		field_type: 'attorney_cpf',
		label: 'CPF',
		value: '',
		title: 'Procurador',
	},
	attorney_pronoun: {
		field_type: 'attorney_pronoun',
		label: 'Pronome',
		value: '',
	},
	attorney_name: { field_type: 'attorney_name', label: 'Nome', value: '' },
	attorney_surname: {
		field_type: 'attorney_surname',
		label: 'Sobrenome',
		value: '',
	},
	attorney_identity: {
		field_type: 'attorney_identity',
		label: 'RG',
		value: '',
	},
	attorney_identity_org: {
		field_type: 'attorney_identity_org',
		label: 'Orgão exp',
		value: '',
	},
	attorney_identity_date: {
		field_type: 'attorney_identity_date',
		label: 'Data de exp',
		value: '',
	},
	attorney_email: { field_type: 'attorney_email', label: 'E-mail', value: '' },
	attorney_profession: {
		field_type: 'attorney_profession',
		label: 'Profissão',
		value: '',
	},
	// attorney address
	attorney_country: {
		field_type: 'attorney_country',
		label: 'País',
		value: '',
		title: 'Endereço do Procurador',
	},
	attorney_cep: { field_type: 'attorney_cep', label: 'CEP', value: '' },
	attorney_number: {
		field_type: 'attorney_number',
		label: 'Número',
		value: '',
	},
	attorney_street: {
		field_type: 'attorney_street',
		label: 'Logradouro',
		value: '',
	},
	attorney_complement: {
		field_type: 'attorney_complement',
		label: 'Complemento',
		value: '',
	},
	attorney_city: { field_type: 'attorney_city', label: 'Cidade', value: '' },
	attorney_state: { field_type: 'attorney_state', label: 'Estado', value: '' },
}

const address = {
	cep: { field_type: 'cep', label: 'CEP', value: '', title: 'Endereço' },
	country: { field_type: 'country', label: 'País', value: '' },
	number: { field_type: 'number', label: 'Número', value: '' },
	street: { field_type: 'street', label: 'Logradouro', value: '' },
	complement: { field_type: 'complement', label: 'Complemento', value: '' },
	city: { field_type: 'city', label: 'Cidade', value: '' },
	state: { field_type: 'state', label: 'Estado', value: '' },
}

const legalPerson = {
	society_name: {
		field_type: 'society_name',
		label: 'Razão Social',
		value: '',
	},
	cnpj: { field_type: 'cnpj', label: 'CNPJ', value: '' },
	activity: { field_type: 'activity', label: 'Área da atividade', value: '' },
	...address,
	...attorney,
}

const naturalPerson = {
	cpf: { field_type: 'cpf', label: 'CPF', value: '' },
	pronoun: { field_type: 'pronoun', label: 'Pronome', value: '' },
	name: { field_type: 'name', label: 'Nome', value: '' },
	surname: { field_type: 'surname', label: 'Sobrenome', value: '' },
	identity: { field_type: 'identity', label: 'RG', value: '' },
	identity_org: { field_type: 'identity_org', label: 'Orgão exp', value: '' },
	identity_date: {
		field_type: 'identity_date',
		label: 'Data de exp',
		value: '',
	},
	email: { field_type: 'email', label: 'E-mail', value: '' },
	marital_state: {
		field_type: 'marital_state',
		label: 'Estado Civil',
		value: '',
	},
	property_regime: {
		field_type: 'property_regime',
		label: 'Regime de bens',
		value: '',
	},
	profession: { field_type: 'profession', label: 'Profissão', value: '' },
	...address,
}

export const getAllNaturalPerson = () => {
	return naturalPerson
}

export const getAllLegalPerson = () => {
	return legalPerson
}
