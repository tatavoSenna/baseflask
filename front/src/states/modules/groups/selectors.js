export const selectAllGroups = (payload) =>
	payload.map((group) => {
		return {
			id: group.id,
			name: group.name,
		}
	})
