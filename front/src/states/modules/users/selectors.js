export const selectAllUsers = (payload) =>
	payload.map((user) => {
		return {
			id: user.id.toString(),
			name: user.name,
			username: user.username,
			key: user.email,
			email: user.email,
			verified: user.verified,
			is_company_admin: user.is_company_admin,
			groups: user.participates_on.sort((a, b) => {
				if (a.name < b.name) {
					return -1
				}
				if (b.name < a.name) {
					return 1
				}
				return 0
			}),
		}
	})
