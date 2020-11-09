export const selectAllModels = (payload) =>
	payload.map((model) => ({
		id: model.id,
		label: model.name,
		value: model.name,
	}))
