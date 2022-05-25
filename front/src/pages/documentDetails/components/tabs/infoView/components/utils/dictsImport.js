const attorney = {
	attorney_nationality: {
		label: 'Nacionalidade',
		title: 'Procurador',
	},
	attorney_cpf: {
		label: 'CPF',
	},
	attorney_pronoun: {
		label: 'Pronome',
	},
	attorney_name: { label: 'Nome' },
	attorney_surname: {
		label: 'Sobrenome',
	},
	attorney_identity: {
		label: 'RG',
	},
	attorney_identity_org: {
		label: 'Orgão exp',
	},
	attorney_identity_date: {
		label: 'Data de exp',
	},
	attorney_email: { label: 'E-mail' },
	attorney_profession: {
		label: 'Profissão',
	},
	// attorney address
	attorney_country: {
		label: 'País',
	},
	attorney_cep: { label: 'CEP' },
	attorney_number: {
		label: 'Número',
	},
	attorney_street: {
		label: 'Logradouro',
	},
	attorney_complement: {
		label: 'Complemento',
	},
	attorney_city: { label: 'Cidade' },
	attorney_state: { label: 'Estado' },
}

const address = {
	cep: { label: 'CEP' },
	country: { label: 'País' },
	number: { label: 'Número' },
	street: { label: 'Logradouro' },
	complement: { label: 'Complemento' },
	city: { label: 'Cidade' },
	state: { label: 'Estado' },
}

const legalPerson = {
	nationality: {
		label: 'Nacionalidade',
	},
	society_name: {
		label: 'Razão Social',
	},
	cnpj: { label: 'CNPJ' },
	activity: { label: 'Área da atividade' },
	...address,
	...attorney,
}

const naturalPerson = {
	nationality: {
		label: 'Nacionalidade',
	},
	cpf: { label: 'CPF' },
	pronoun: { label: 'Pronome' },
	name: { label: 'Nome' },
	surname: { label: 'Sobrenome' },
	identity: { label: 'RG' },
	identity_org: { label: 'Orgão exp' },
	identity_date: {
		label: 'Data de exp',
	},
	email: { label: 'E-mail' },
	marital_state: {
		label: 'Estado Civil',
	},
	property_regime: {
		label: 'Regime de bens',
	},
	profession: { label: 'Profissão' },
	...address,
}

export const getAllNaturalPerson = () => {
	return naturalPerson
}

export const getAllLegalPerson = () => {
	return legalPerson
}
