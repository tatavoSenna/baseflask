export const selectAllUsers = (payload) =>
	payload.map((user) => {
		return {
			name: user.name,
			username: user.username,
			surname: user.surname,
			key: user.email,
			email: user.email,
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
