export const alphabeticalOrderCitys = (payload) => {
	return payload
		.map((item) => ({
			city: item.nome,
			state: item['regiao-imediata']['regiao-intermediaria'].UF.nome,
			stateInitials: item['regiao-imediata']['regiao-intermediaria'].UF.sigla,
		}))
		.sort((a, b) => {
			if (a.city > b.city) {
				return 1
			}
			if (a.city < b.city) {
				return -1
			}
			return 0
		})
}
