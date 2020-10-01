export const selectAllUsers = (payload) =>
	payload.map((user) => {
		return {
			name: user.name,
			username: user.username,
			surname: user.surname,
			key: user.email,
			email: user.email,
		}
	})
