export const fieldsTypes = [
	{
		label: 'Pessoa Física',
		personType: 'natural_person',
		fields: [
			{
				title: 'Nacionalidade',
				fields: [
					{ label: 'País de origem', field: 'nationality', flex: '1 0 100%' },
				],
			},
			{
				title: 'CPF',
				fields: [{ label: 'Número do Cpf', field: 'cpf', flex: '1 0 100%' }],
			},
			{
				title: 'Nome Completo',
				fields: [
					{ label: 'Pronome', field: 'pronoun', flex: '1' },
					{ label: 'Nome', field: 'name', flex: '1' },
					{ label: 'Sobrenome', field: 'surname', flex: '1 0 100%' },
				],
			},
			{
				title: 'Identidade',
				fields: [
					{ label: 'RG', field: 'identity', flex: '1' },
					{ label: 'Orgão exp', field: 'identity_org', flex: '1' },
					{ label: 'Data de exp', field: 'identity_date', flex: '1' },
				],
			},
			{
				title: 'Dados Civis',
				fields: [
					{ label: 'Estado Civil', field: 'marital_state', flex: '1' },
					{ label: 'Regime de bens', field: 'property_regime', flex: '1' },
				],
			},
			{
				title: 'E-mail',
				fields: [
					{ label: 'Endereço de e-mail', field: 'email', flex: '1 0 100%' },
				],
			},
			{
				title: 'Profissão',
				fields: [
					{
						label: 'Nome da profissão',
						field: 'profession',
						flex: '1 0 100%',
					},
				],
			},
		],
	},
	{
		label: 'Pessoa Jurídica',
		personType: 'legal_person',
		fields: [
			{
				title: 'Nacionalidade',
				fields: [
					{
						label: 'País de origem',
						field: 'legal_nationality',
						flex: '1 0 100%',
					},
				],
			},
			{
				title: 'CNPJ',
				fields: [{ label: 'Número do Cnpj', field: 'cnpj', flex: '1 0 100%' }],
			},
			{
				title: 'Razão social',
				fields: [
					{
						label: 'Nome da razão social',
						field: 'society_name',
						flex: '1 0 100%',
					},
				],
			},
			{
				title: 'Área da atividade',
				fields: [
					{
						label: 'Nome da área da atividade',
						field: 'activity',
						flex: '1 0 100%',
					},
				],
			},
		],
	},
	{
		label: 'Endereço',
		fields: [
			{
				fields: [
					{ label: 'Cep', field: 'cep', flex: '1' },
					{ label: 'País', field: 'country', flex: '1' },
					{ label: 'Número', field: 'number', flex: '1' },
					{ label: 'Logradouro', field: 'street', flex: '1 0 100%' },
					{ label: 'Complemento', field: 'complement', flex: '1 0 190px' },
					{ label: 'Bairro', field: 'district', flex: '1 0 190px' },
					{ label: 'Estado', field: 'state', flex: '1 0 190px' },
					{ label: 'Cidade', field: 'city', flex: '1 0 190px' },
				],
			},
		],
	},
	{
		label: 'Procurador',
		fields: [
			{
				title: 'Nacionalidade',
				fields: [
					{
						label: 'País de origem',
						field: 'attorney_nationality',
						flex: '1 0 100%',
					},
				],
			},
			{
				title: 'CPF',
				fields: [
					{ label: 'Número do Cpf', field: 'attorney_cpf', flex: '1 0 100%' },
				],
			},
			{
				title: 'Nome Completo',
				fields: [
					{ label: 'Pronome', field: 'attorney_pronoun', flex: '1' },
					{ label: 'Nome', field: 'attorney_name', flex: '1' },
					{ label: 'Sobrenome', field: 'attorney_surname', flex: '1 0 100%' },
				],
			},
			{
				title: 'Identidade',
				fields: [
					{ label: 'RG', field: 'attorney_identity', flex: '1' },
					{ label: 'Orgão exp', field: 'attorney_identity_org', flex: '1' },
					{
						label: 'Data de exp',
						field: 'attorney_identity_date',
						flex: '1 0 100%',
					},
				],
			},
			{
				title: 'E-mail',
				fields: [
					{
						label: 'Endereço de e-mail',
						field: 'attorney_email',
						flex: '1 0 100%',
					},
				],
			},
			{
				title: 'Profissão',
				fields: [
					{
						label: 'Nome da profissão',
						field: 'attorney_profession',
						flex: '1 0 100%',
					},
				],
			},
			{
				title: 'Endereço',
				fields: [
					{ label: 'Cep', field: 'attorney_cep', flex: '1' },
					{ label: 'País', field: 'attorney_country', flex: '1' },
					{ label: 'Número', field: 'attorney_number', flex: '1' },
					{ label: 'Logradouro', field: 'attorney_street', flex: '1 0 100%' },
					{
						label: 'Complemento',
						field: 'attorney_complement',
						flex: '1 0 190px',
					},
					{ label: 'Bairro', field: 'attorney_district', flex: '1 0 190px' },
					{ label: 'Estado', field: 'attorney_state', flex: '1 0 190px' },
					{ label: 'Cidade', field: 'attorney_city', flex: '1 0 190px' },
				],
			},
		],
	},
]
