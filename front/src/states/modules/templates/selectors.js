import * as moment from 'moment'
import 'moment/locale/pt-br'
import update from 'immutability-helper'

moment.locale('pt-br')

export const selectAllTemplates = (payload) =>
	payload.map((template) => ({
		id: parseInt(template.id, 10),
		key: parseInt(template.id, 10),
		published: template.published,
		name: template.name,
		authorEmail: template.user.email,
		createdAt: template.created_at
			? moment(template.created_at).fromNow()
			: null,
	}))

export const updatePublished = (data, payload) => {
	let index
	for (var i = 0; i < data.length; i++) {
		if (data[i].id === payload.id) {
			index = i
		}
	}
	return update(data, { [index]: { published: { $set: payload.status } } })
}
