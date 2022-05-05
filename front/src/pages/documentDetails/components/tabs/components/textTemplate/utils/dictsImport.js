const attorney = [
	{ title: 'Procurador' },
	{ field_type: 'attorney_cpf', label: 'CPF', value: '' },
	{ field_type: 'attorney_pronoun', label: 'Pronome', value: '' },
	{ field_type: 'attorney_name', label: 'Nome', value: '' },
	{ field_type: 'attorney_surname', label: 'Sobrenome', value: '' },
	{ field_type: 'attorney_identity', label: 'RG', value: '' },
	{ field_type: 'attorney_identity_org', label: 'Orgão exp', value: '' },
	{ field_type: 'attorney_identity_date', label: 'Data de exp', value: '' },
	{ field_type: 'attorney_email', label: 'E-mail', value: '' },
	{ field_type: 'attorney_profession', label: 'Profissão', value: '' },
	{ title: 'Endereço do procurador' },
	{ field_type: 'attorney_country', label: 'País', value: '' },
	{ field_type: 'attorney_cep', label: 'CEP', value: '' },
	{ field_type: 'attorney_number', label: 'Número', value: '' },
	{ field_type: 'attorney_street', label: 'Logradouro', value: '' },
	{ field_type: 'attorney_complement', label: 'Complemento', value: '' },
	{ field_type: 'attorney_city', label: 'Cidade', value: '' },
	{ field_type: 'attorney_state', label: 'Estado', value: '' },
]

const address = [
	{ field_type: 'country', label: 'País', value: '' },
	{ field_type: 'cep', label: 'CEP', value: '' },
	{ field_type: 'number', label: 'Número', value: '' },
	{ field_type: 'street', label: 'Logradouro', value: '' },
	{ field_type: 'complement', label: 'Complemento', value: '' },
	{ field_type: 'city', label: 'Cidade', value: '' },
	{ field_type: 'state', label: 'Estado', value: '' },
]

const legalPerson = [
	{ field_type: 'society_name', label: 'Razão Social', value: '' },
	{ field_type: 'cnpj', label: 'CNPJ', value: '' },
	{ field_type: 'activity', label: 'Área da atividade', value: '' },
	{ title: 'Endereço da empresa' },
	...address,
	...attorney,
]

const naturalPerson = [
	{ field_type: 'cpf', label: 'CPF', value: '' },
	{ field_type: 'pronoun', label: 'Pronome', value: '' },
	{ field_type: 'name', label: 'Nome', value: '' },
	{ field_type: 'surname', label: 'Sobrenome', value: '' },
	{ field_type: 'identity', label: 'RG', value: '' },
	{ field_type: 'identity_org', label: 'Orgão exp', value: '' },
	{ field_type: 'identity_date', label: 'Data de exp', value: '' },
	{ field_type: 'email', label: 'E-mail', value: '' },
	{ field_type: 'marital_state', label: 'Estado Civil', value: '' },
	{ field_type: 'property_regime', label: 'Regime de bens', value: '' },
	{ field_type: 'profession', label: 'Profissão', value: '' },
	{ title: 'Endereço da Pessoa' },
	...address,
]

export const getAllNaturalPerson = () => {
	return naturalPerson
}

export const getAllLegalPerson = () => {
	return legalPerson
}
