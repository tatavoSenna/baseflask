import * as moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

export const selectAllTemplates = (payload) =>
	payload.map((template) => ({
		id: parseInt(template.id, 10),
		key: parseInt(template.id, 10),
		name: template.name,
		authorEmail: template.user.email,
		createdAt: template.created_at
			? moment(template.created_at).fromNow()
			: null,
	}))
