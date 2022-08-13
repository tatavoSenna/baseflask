export const selectAllDatabases = (payload) =>
	payload.map((database) => ({
		id: parseInt(database.id, 10),
		key: parseInt(database.id, 10),
		title: database.title,
		table_type: database.table_type,
		text_count: database.text_count,
	}))

export const selectAllTags = (payload) =>
	payload.map((tags) => ({
		id: tags.id,
		title: tags.title,
	}))
