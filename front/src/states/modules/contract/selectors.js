// import get from 'lodash/get'
// import sortBy from 'lodash/sortBy'
import * as moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

export const selectAllContracts = (payload) =>
	payload.map((contract) => ({
		id: parseInt(contract.id, 10),
		key: parseInt(contract.id, 10),
		title: contract.title,
		clientId: contract.client_id,
		author: `${contract.user.name} ${contract.user.surname}`,
		authorEmail: contract.user.email,
		documentId: contract.document_model_id,
		status: contract.status,
		createdAt: contract.created_at
			? moment(contract.created_at).fromNow()
			: null,
	}))
