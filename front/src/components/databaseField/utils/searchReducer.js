export const INITIAL_STATE = {
	loading: false,
	options: [],
	starting: true,
	error: false,
}

export const optionsReducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_START':
			return {
				error: false,
				loading: true,
				starting: false,
				options: [],
			}
		case 'FETCH_SUCCESS':
			return {
				error: false,
				loading: false,
				starting: false,
				options: action.payload,
			}
		case 'FETCH_ERROR':
			return {
				error: true,
				loading: false,
				starting: false,
				options: [],
			}
		case 'FETCH_CLEAR':
			return INITIAL_STATE
		default:
			return state
	}
}

export const populateData = (data, label, value) => {
	return data.data.map((item) => ({
		label: String(item[label]),
		value: item[value],
	}))
}

export const errorMessage = (fetch, error) => {
	if (fetch.isCancel(error)) {
		console.warn('Chamada com a api foi cancelada')
	} else {
		console.error('Erro ao contactar com a api')
	}
}
