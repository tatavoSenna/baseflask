export const alphabeticalOrderCitys = (payload) => {
	return payload.sort((a, b) => {
		if (a.nome > b.nome) {
			return 1
		}
		if (a.nome < b.nome) {
			return -1
		}
		return 0
	})
}
