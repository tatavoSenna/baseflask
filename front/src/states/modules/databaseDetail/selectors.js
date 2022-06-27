export const selectAllItems = (payload) =>
	payload.map((database) => ({
		id: parseInt(database.id, 10),
		key: parseInt(database.id, 10),
		description: database.description,
		text: database.text,
	}))

export const selectTextEdit = (editedText, payload) => {
	return { ...editedText, ...payload }
}
