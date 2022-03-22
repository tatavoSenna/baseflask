const envTag = process.env.REACT_APP_ENVIRONMENT_TAG

const plans = [
	{
		payment: 'month',
		type: 'Gratuito',
		info: {
			users: 3,
			documents: 20,
			models: 5,
		},
		selected: false,
		price: null,
		value:
			envTag && envTag === 'production'
				? 'price_1Kfv9LHIZcJ4D4nawRSfC6t6'
				: 'price_1KP85XHIZcJ4D4nayv0Sx6dc',
	},
	{
		payment: 'month',
		type: 'Básico',
		info: {
			users: 10,
			documents: 200,
			models: 15,
			docusign: 'Integração com docusign',
			d4sign: 'Integração com d4sign',
		},
		selected: false,
		value:
			envTag && envTag === 'production'
				? 'price_1Kfv9PHIZcJ4D4naroreR2dr'
				: 'price_1KP83oHIZcJ4D4na4K1VSAmQ',
		price: 'R$ 150',
	},
	{
		payment: 'month',
		type: 'Avançado',
		info: {
			users: 'usuários ilimitados',
			documents: 500,
			models: 15,
			docusign: 'Integração com docusign',
			d4sign: 'Integração com d4sign',
		},
		selected: false,
		value:
			envTag && envTag === 'production'
				? 'price_1Kfv99HIZcJ4D4naoCHG2P7W'
				: 'price_1KRHaBHIZcJ4D4naBNvrq4ya',
		price: 'R$ 250',
	},
	{
		payment: 'year',
		type: 'Gratuito',
		info: {
			users: 3,
			documents: 20,
			models: 5,
		},
		selected: false,
		price: null,
		value:
			envTag && envTag === 'production'
				? 'price_1Kfv9LHIZcJ4D4nawRSfC6t6'
				: 'price_1KP85XHIZcJ4D4nayv0Sx6dc',
	},
	{
		payment: 'year',
		type: 'Básico',
		info: {
			users: 10,
			documents: 200,
			models: 15,
			docusign: 'Integração com docusign',
			d4sign: 'Integração com d4sign',
		},
		selected: false,
		value:
			envTag && envTag === 'production'
				? 'price_1Kfv9PHIZcJ4D4naQzMyhsDc'
				: 'price_1KP83oHIZcJ4D4nadQJ7UpZW',
		price: 'R$ 1.500',
	},
	{
		payment: 'year',
		type: 'Avançado',
		info: {
			users: 'usuários ilimitados',
			documents: 500,
			models: 15,
			docusign: 'Integração com docusign',
			d4sign: 'Integração com d4sign',
		},
		selected: false,
		value:
			envTag && envTag === 'production'
				? 'price_1Kfv99HIZcJ4D4naJmmRPBn7'
				: 'price_1KRHaBHIZcJ4D4nat4kzntJD',
		price: 'R$ 2.500',
	},
]

const getPlans = () => {
	return plans
}

const filterPlans = (type) => {
	return plans.filter((p) => p.payment === type)
}

const findPlan = (priceId) => {
	return plans.find((p) => p.value === priceId)
}

export { getPlans, filterPlans, findPlan }
