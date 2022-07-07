export const alphabeticalOrder = (payload) => {
	return payload
		.map((item) => ({ state: item.nome, stateInitials: item.sigla }))
		.sort((a, b) => {
			if (a.state > b.state) {
				return 1
			}
			if (a.state < b.state) {
				return -1
			}
			return 0
		})
}
