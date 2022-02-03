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
		template_name: contract.template_name,
		clientId: contract.client_id,
		author: contract.user.name /*(
			<>
				<Text>{contract.user.name}</Text>
			</>
		),*/,
		authorEmail: contract.user.email,
		documentId: contract.document_model_id,
		status: contract.status,
		is_folder: contract.is_folder,
		parent_id: contract.parent_id,
		createdAt: contract.created_at
			? moment(contract.created_at).format('DD/MM/YYYY')
			: null,
		dueDate: contract.due_date
			? moment(contract.due_date).format('DD/MM/YYYY')
			: null,
	}))
